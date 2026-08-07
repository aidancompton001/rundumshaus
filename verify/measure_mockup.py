# Измерение геометрии мокапа download.jpg (Home) — все числа из пикселей, не на глаз
import json
from PIL import Image
import numpy as np

img = Image.open(r'c:/Projects/HennerHeede-Site/assets/references/download.jpg').convert('RGB')
W, H = img.size
a = np.asarray(img, dtype=np.int16)

CREAM = np.array([243, 240, 236])
def not_cream(px, tol=18):
    return np.abs(px - CREAM).sum(axis=-1) > tol * 3

mask = not_cream(a)

out = {'size': [W, H]}

# 1) Портрет в hero: большой не-крем блок в правой части верхних 35% высоты
hero_rows = slice(0, int(H * 0.35))
col_density = mask[hero_rows].mean(axis=0)
# ищем непрерывную зону справа с плотностью > 0.8
right = np.where(col_density > 0.8)[0]
right = right[right > W * 0.4]
runs = np.split(right, np.where(np.diff(right) > 3)[0] + 1)
portrait_cols = max(runs, key=len)
px0, px1 = int(portrait_cols[0]), int(portrait_cols[-1])
row_density = mask[hero_rows, px0:px1].mean(axis=1)
prow = np.where(row_density > 0.8)[0]
py0, py1 = int(prow[0]), int(prow[-1])
out['portrait_bbox'] = {'x0': px0, 'x1': px1, 'y0': py0, 'y1': py1}

# 2) Блок имени: тёмные пиксели слева в hero
dark = (a.sum(axis=-1) < 250)
name_zone = dark[0:int(H*0.35), 0:int(W*0.4)]
rows = np.where(name_zone.any(axis=1))[0]
cols = np.where(name_zone.any(axis=0))[0]
out['name_dark_bbox'] = {'x0': int(cols[0]), 'x1': int(cols[-1]), 'y0': int(rows[0]), 'y1': int(rows[-1])}

# 3) Полоса лого: между hero (низ портрета) и рядом кейсов — зона где крем и редкие тёмные глифы
strip_top = py1 + 1
# ищем следующий плотный фото-ряд (кейсы): плотность маски по строкам > 0.5 на полной ширине
full_density = mask[:, int(W*0.05):int(W*0.95)].mean(axis=1)
below = np.where(full_density[strip_top+20:] > 0.5)[0]
strip_bottom = strip_top + 20 + int(below[0]) if len(below) else strip_top + 80
out['logo_strip'] = {'y0': int(strip_top), 'y1': int(strip_bottom)}

# лого-глифы в полосе: кластеры тёмных колонок
strip_dark = dark[strip_top:strip_bottom]
cd = strip_dark.mean(axis=0)
on = np.where(cd > 0.02)[0]
clusters = np.split(on, np.where(np.diff(on) > 25)[0] + 1) if len(on) else []
out['logo_clusters'] = [{'x0': int(c[0]), 'x1': int(c[-1])} for c in clusters if len(c) > 5]

print(json.dumps(out, indent=1))
with open(r'c:/Projects/HennerHeede-Site/verify/mockup_geometry.json', 'w') as f:
    json.dump(out, f, indent=1)
