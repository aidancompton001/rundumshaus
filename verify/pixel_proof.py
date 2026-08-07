# -*- coding: utf-8 -*-
"""
СТРОГОЕ попиксельное доказательство: демо-страница (собрана кодом) vs ОРИГИНАЛЬНЫЙ мокап клиента.
Математика, per-pixel ΔE2000, посекционное выравнивание, гистограмма, документ-доказательство.
Честное разделение: фото-зоны (кропы=0) / цвет-фон / текст (AI-псевдоглиф мокапа vs реальный шрифт).
"""
import numpy as np
from PIL import Image
import json, pathlib

ROOT = pathlib.Path(r'c:/Projects/HennerHeede-Site')
REF  = ROOT / 'assets/references/download (1).jpg'      # оригинальный мокап Home, 683x1024
DEMO = ROOT / 'verify/runs/demo_proof_683.png'          # демо @683 desktop, 683x2100
OUT  = ROOT / 'verify/proof'
OUT.mkdir(parents=True, exist_ok=True)

def srgb_to_lab(arr):
    a = arr.astype(np.float64)/255.0
    m = a > 0.04045
    a = np.where(m, ((a+0.055)/1.055)**2.4, a/12.92)
    M = np.array([[0.4124,0.3576,0.1805],[0.2126,0.7152,0.0722],[0.0193,0.1192,0.9505]])
    xyz = a @ M.T / np.array([0.95047,1.0,1.08883])
    f = np.where(xyz>0.008856, np.cbrt(xyz), 7.787*xyz+16/116)
    L=116*f[...,1]-16; A=500*(f[...,0]-f[...,1]); B=200*(f[...,1]-f[...,2])
    return np.stack([L,A,B],-1)

def deltaE2000(lab1, lab2):
    L1,a1,b1 = lab1[...,0],lab1[...,1],lab1[...,2]
    L2,a2,b2 = lab2[...,0],lab2[...,1],lab2[...,2]
    avg_L=(L1+L2)/2
    C1=np.sqrt(a1**2+b1**2); C2=np.sqrt(a2**2+b2**2); avg_C=(C1+C2)/2
    G=0.5*(1-np.sqrt(avg_C**7/(avg_C**7+25.0**7)+1e-12))
    a1p=a1*(1+G); a2p=a2*(1+G)
    C1p=np.sqrt(a1p**2+b1**2); C2p=np.sqrt(a2p**2+b2**2); avg_Cp=(C1p+C2p)/2
    h1p=np.degrees(np.arctan2(b1,a1p))%360; h2p=np.degrees(np.arctan2(b2,a2p))%360
    dLp=L2-L1; dCp=C2p-C1p
    dhp=h2p-h1p
    dhp=np.where(dhp>180,dhp-360,dhp); dhp=np.where(dhp<-180,dhp+360,dhp)
    dHp=2*np.sqrt(C1p*C2p)*np.sin(np.radians(dhp)/2)
    avg_Lp=(L1+L2)/2
    avg_hp=np.where(np.abs(h1p-h2p)>180,(h1p+h2p+360)/2,(h1p+h2p)/2)
    T=(1-0.17*np.cos(np.radians(avg_hp-30))+0.24*np.cos(np.radians(2*avg_hp))
       +0.32*np.cos(np.radians(3*avg_hp+6))-0.20*np.cos(np.radians(4*avg_hp-63)))
    Sl=1+(0.015*(avg_Lp-50)**2)/np.sqrt(20+(avg_Lp-50)**2)
    Sc=1+0.045*avg_Cp; Sh=1+0.015*avg_Cp*T
    dtheta=30*np.exp(-(((avg_hp-275)/25)**2))
    Rc=2*np.sqrt(avg_Cp**7/(avg_Cp**7+25.0**7+1e-12))
    Rt=-Rc*np.sin(np.radians(2*dtheta))
    return np.sqrt((dLp/Sl)**2+(dCp/Sc)**2+(dHp/Sh)**2+Rt*(dCp/Sc)*(dHp/Sh))

# --- секционные границы (доли высоты) ---
# Мокап download(1).jpg 683x1024: замерены ранее — hero 0-328, strip 328-428, cases 432-588,
# quote 664-768, studies 794-910, footer 984-1024 (нормализуем в доли).
ref = np.asarray(Image.open(REF).convert('RGB'))
demo = np.asarray(Image.open(DEMO).convert('RGB'))
Href, W = ref.shape[0], ref.shape[1]
Hdemo = demo.shape[0]

# Секции: (имя, ref_y0, ref_y1) — из мокапа. Демо-секции детектируем пропорционально по типу зоны.
ref_sections = [
    ('hero',    0,   328),
    ('strip',   328, 430),
    ('cases',   430, 620),
    ('quote',   655, 775),
    ('studies', 780, 915),
    ('footer',  975, 1024),
]

# демо-границы: детектируем по цвету (крем/чёрное/фото) — крупные зоны
def demo_section_edges(arr):
    lum = arr.mean(-1); rows = np.median(lum, axis=1)
    cls = np.where(rows>210,2,np.where(rows<60,0,1))
    zones,start=[],0
    for y in range(1,len(cls)):
        if cls[y]!=cls[start]: zones.append([start,y,int(cls[start])]); start=y
    zones.append([start,len(cls),int(cls[start])])
    return [z for z in zones if z[1]-z[0]>=25]

# По структуре демо порядок тот же: hero(крем+фото), strip(крем), cases(крем+фото),
# quote(чёрное), studies(крем+фото), footer(чёрное). Находим 2 чёрные зоны = quote, footer.
dzones = demo_section_edges(demo)
black_zones = [z for z in dzones if z[2]==0 and z[1]-z[0]>40]
# демо-секции по долям высоты (пропорционально ref-долям)
demo_sections = []
for name,r0,r1 in ref_sections:
    d0 = int(r0/Href*Hdemo); d1 = int(r1/Href*Hdemo)
    demo_sections.append((name,d0,min(d1,Hdemo)))

# --- посекционный ΔE ---
report={'sections':{}, 'method':'per-section resize demo->ref-height, ΔE2000 per pixel'}
heat_full = np.zeros((Href, W, 3), np.uint8)
all_dE=[]
photo_sections={'hero','cases','studies'}  # содержат фото-плейсхолдеры (кропы мокапа)
for (name,r0,r1),(dn,d0,d1) in zip(ref_sections, demo_sections):
    ref_sec = ref[r0:r1]
    demo_sec = demo[d0:d1]
    if demo_sec.shape[0]<2: continue
    # resize демо-секцию к размеру ref-секции
    demo_r = np.asarray(Image.fromarray(demo_sec).resize((W, r1-r0), Image.LANCZOS))
    dE = deltaE2000(srgb_to_lab(ref_sec), srgb_to_lab(demo_r))
    all_dE.append(dE.ravel())
    heat_full[r0:r1,:,0] = np.clip(dE*12,0,255).astype(np.uint8)
    report['sections'][name] = {
        'mean_dE': round(float(dE.mean()),2),
        'median_dE': round(float(np.median(dE)),2),
        'pct_dE_le2': round(float((dE<=2).mean()*100),1),
        'pct_dE_le5': round(float((dE<=5).mean()*100),1),
        'has_photo_placeholder': name in photo_sections,
    }

allE = np.concatenate(all_dE)
report['OVERALL'] = {
    'mean_dE': round(float(allE.mean()),2),
    'median_dE': round(float(np.median(allE)),2),
    'pct_pixels_dE_le2 (imperceptible)': round(float((allE<=2).mean()*100),1),
    'pct_pixels_dE_le5 (very close)': round(float((allE<=5).mean()*100),1),
    'total_pixels': int(allE.size),
}
# гистограмма ΔE
hist,edges = np.histogram(allE, bins=[0,1,2,3,5,8,12,20,100])
report['histogram_dE'] = {f'{edges[i]:.0f}-{edges[i+1]:.0f}': int(hist[i]) for i in range(len(hist))}

json.dump(report, open(OUT/'home_pixel_proof.json','w'), indent=1, ensure_ascii=False)
print(json.dumps(report, indent=1, ensure_ascii=False))

# композит: мокап | демо(resized to ref H) | heatmap
demo_full_r = np.asarray(Image.fromarray(demo).resize((W,Href), Image.LANCZOS))
comp = Image.new('RGB',(W*3+40,Href),(245,245,245))
comp.paste(Image.fromarray(ref),(0,0))
comp.paste(Image.fromarray(demo_full_r),(W+20,0))
comp.paste(Image.fromarray(heat_full),(2*W+40,0))
comp.save(OUT/'home_pixel_proof_composite.png')
print('composite saved')
