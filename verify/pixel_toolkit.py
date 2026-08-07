# -*- coding: utf-8 -*-
"""
PIXEL-PERFECT REPLICATION TOOLKIT — переиспользуемый инструмент замера ΔE.
Система: vault/02_Knowledge/Pixel-Perfect Site Replication System.md
Usage:
  py pixel_toolkit.py proof   ref.jpg rep.png          # общий + CIEDE2000 + композит
  py pixel_toolkit.py bgaudit ref.jpg rep.png          # аудит фоновых цветов по зонам
  py pixel_toolkit.py hedges  ref.jpg  Y0 Y1           # горизонтальные кромки (карта высот)
  py pixel_toolkit.py bbox    img.png  X0 X1 Y0 Y1     # bbox текста в окне
Все числа — из скрипта. НЕ на глаз (Закон 1 системы).
"""
import sys, json
import numpy as np
from PIL import Image

def lab(a):
    a=np.asarray(a,float)/255; m=a>0.04045; a=np.where(m,((a+0.055)/1.055)**2.4,a/12.92)
    M=np.array([[.4124,.3576,.1805],[.2126,.7152,.0722],[.0193,.1192,.9505]])
    xyz=a@M.T/np.array([.95047,1,1.08883]); f=np.where(xyz>.008856,np.cbrt(xyz),7.787*xyz+16/116)
    return np.stack([116*f[...,1]-16,500*(f[...,0]-f[...,1]),200*(f[...,1]-f[...,2])],-1)

def de2000(l1,l2):
    L1,a1,b1=l1[...,0],l1[...,1],l1[...,2]; L2,a2,b2=l2[...,0],l2[...,1],l2[...,2]
    C1=np.hypot(a1,b1); C2=np.hypot(a2,b2); aC=(C1+C2)/2
    G=0.5*(1-np.sqrt(aC**7/(aC**7+25.0**7+1e-12)))
    a1p=a1*(1+G); a2p=a2*(1+G); C1p=np.hypot(a1p,b1); C2p=np.hypot(a2p,b2)
    h1=np.degrees(np.arctan2(b1,a1p))%360; h2=np.degrees(np.arctan2(b2,a2p))%360
    dL=L2-L1; dC=C2p-C1p; dh=h2-h1; dh=np.where(dh>180,dh-360,dh); dh=np.where(dh<-180,dh+360,dh)
    dH=2*np.sqrt(C1p*C2p)*np.sin(np.radians(dh)/2); aLp=(L1+L2)/2; aCp=(C1p+C2p)/2
    ah=np.where(np.abs(h1-h2)>180,(h1+h2+360)/2,(h1+h2)/2)
    T=1-.17*np.cos(np.radians(ah-30))+.24*np.cos(np.radians(2*ah))+.32*np.cos(np.radians(3*ah+6))-.20*np.cos(np.radians(4*ah-63))
    Sl=1+.015*(aLp-50)**2/np.sqrt(20+(aLp-50)**2); Sc=1+.045*aCp; Sh=1+.015*aCp*T
    dt=30*np.exp(-(((ah-275)/25)**2)); Rc=2*np.sqrt(aCp**7/(aCp**7+25.0**7+1e-12)); Rt=-Rc*np.sin(np.radians(2*dt))
    return np.sqrt((dL/Sl)**2+(dC/Sc)**2+(dH/Sh)**2+Rt*(dC/Sc)*(dH/Sh))

def load2(ref,rep):
    r=np.asarray(Image.open(ref).convert('RGB')); p=np.asarray(Image.open(rep).convert('RGB'))
    h=min(r.shape[0],p.shape[0]); w=min(r.shape[1],p.shape[1]); return r[:h,:w],p[:h,:w],h,w

def proof(ref,rep):
    r,p,h,w=load2(ref,rep); L1,L2=lab(r),lab(p); d76=np.sqrt(((L1-L2)**2).sum(-1)); d00=de2000(L1,L2)
    out={'CIE76':{'mean':round(float(d76.mean()),2),'le5':round(float((d76<=5).mean()*100),1),'lt1':round(float((d76<1).mean()*100),1)},
         'CIEDE2000':{'mean':round(float(d00.mean()),2),'le5':round(float((d00<=5).mean()*100),1)}}
    heat=np.zeros((h,w,3),np.uint8); heat[...,0]=np.clip(d76*14,0,255).astype(np.uint8); heat[...,1]=np.clip((3-d76)*40,0,90).astype(np.uint8)
    comp=Image.new('RGB',(w*3+40,h),(20,18,16)); comp.paste(Image.fromarray(r),(0,0)); comp.paste(Image.fromarray(p),(w+20,0)); comp.paste(Image.fromarray(heat),(2*w+40,0))
    comp.save('_toolkit_composite.png'); print(json.dumps(out,ensure_ascii=False,indent=1)); print('-> _toolkit_composite.png')

def bgaudit(ref,rep):
    r,p,h,w=load2(ref,rep)
    def lab1(c):
        a=np.array(c,float)/255; m=a>0.04045; a=np.where(m,((a+0.055)/1.055)**2.4,a/12.92)
        M=np.array([[.4124,.3576,.1805],[.2126,.7152,.0722],[.0193,.1192,.9505]]); xyz=M@a/np.array([.95047,1,1.08883])
        f=np.where(xyz>.008856,np.cbrt(xyz),7.787*xyz+16/116); return np.array([116*f[1]-16,500*(f[0]-f[1]),200*(f[1]-f[2])])
    med=lambda img,x0,x1,y0,y1:np.median(img[y0:y1,x0:x1].reshape(-1,3),0).astype(int)
    # сетка 6x8 проб по не-краю; репорт зон с ΔE>3 (промах фона)
    print('зона(x,y)         МАКЕТ        РЕПЛИКА      ΔE')
    for yy in range(40,h-40,max(1,(h-80)//8)):
        for xx in range(40,w-40,max(1,(w-80)//6)):
            a=med(r,xx,xx+20,yy,yy+12); b=med(p,xx,xx+20,yy,yy+12)
            d=np.sqrt(((lab1(a)-lab1(b))**2).sum())
            if d>3: print('(%3d,%3d) %-12s %-12s %.2f  <-- ПРОМАХ'%(xx,yy,str(a),str(b),d))
    print('(зоны без вывода = ΔE<=3, совпадают)')

def hedges(ref,y0,y1):
    a=np.asarray(Image.open(ref).convert('RGB')); x0,x1=24,a.shape[1]-24
    base=a[max(0,y0-8):max(1,y0-3),x0:x1].mean()
    for y in range(y0,y1):
        row=a[y,x0:x1].mean(1)
        if row.mean()<base-8 and row.std()<28: print('кромка y%d lum%.0f'%(y,row.mean()))

def bbox(img,x0,x1,y0,y1,thr=200):
    a=np.asarray(Image.open(img).convert('RGB')); z=a[y0:y1,x0:x1].sum(-1)<thr; ys,xs=np.where(z)
    if len(ys): print('bbox x%d-%d y%d-%d  W%d H%d'%(xs.min()+x0,xs.max()+x0,ys.min()+y0,ys.max()+y0,xs.max()-xs.min(),ys.max()-ys.min()))
    else: print('пусто')

if __name__=='__main__':
    c=sys.argv[1]
    if c=='proof': proof(sys.argv[2],sys.argv[3])
    elif c=='bgaudit': bgaudit(sys.argv[2],sys.argv[3])
    elif c=='hedges': hedges(sys.argv[2],int(sys.argv[3]),int(sys.argv[4]))
    elif c=='bbox': bbox(sys.argv[2],*map(int,sys.argv[3:7]))
    else: print(__doc__)
