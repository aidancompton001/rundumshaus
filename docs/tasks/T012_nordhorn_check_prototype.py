# -*- coding: utf-8 -*-
"""Прототип проверки Ф5 для T012 — дальняя городская страница Nordhorn.

Проверка смотрит ТОЛЬКО на два куска страницы:
  1) раздел «Entkernungsfirma …» (строки 125–136 текста Кевина),
  2) ответ FAQ на вопрос «Führen Sie Entkernungen außerhalb von Osnabrück durch?» (строки 182–183).
Во всей странице искать нельзя: список «Weitere Einsatzorte» и так содержит Belm и Lotte.

Запрещено в этих кусках:  «in <город> … tätig», «Osnabrücker Land», соседи Osnabrück из строк 129–135.
Обязательно в этих кусках: жёсткие соседи города из cities.json (для Nordhorn — Twist, Meppen, Wietmarschen).

Сейчас страницы нет — куски собираются по разметке из roadmap прямо из файла текста Кевина.
В Ф5 те же функции check_* получат куски, вырезанные из собранного HTML.
"""
import io, json, re, sys
sys.stdout.reconfigure(encoding="utf-8")
ROOT = r"C:\Projects\RundUmsHaus"
L = io.open(ROOT + r"\docs\kevin-entkernung-text-2026-09-13.txt", encoding="utf-8").read().split("\n")
C = json.load(io.open(ROOT + r"\site\src\data\cities.json", encoding="utf-8"))["cities"]
by = {c["slug"]: c for c in C}
OSN_NEIGHBORS = [L[i - 1] for i in range(129, 136)]          # Belm … Bissendorf
MAX_LIST = 7                                                  # в списке Кевина 7 соседей после Osnabrück

def hard_neighbors(city):
    return [by[s]["displayName"] for s in city.get("neighbors", []) if s in by and s != "osnabrueck" and s != city["slug"]]

def render(city, mutate_126=False):
    name = city["displayName"]
    nb = hard_neighbors(city)[:MAX_LIST]
    line126 = L[125].replace("Osnabrück", name) if mutate_126 else L[125]          # разметка: ОСТАВИТЬ
    firma = "\n".join([L[124], line126, L[126]] + [name] + nb + [L[135], L[136]])   # 125 О, 126 О, 127 как есть, 128 С, 129–135 С, 136–137 как есть
    places = ", ".join([name] + nb)
    faq = L[182].replace("im umliegenden Osnabrücker Land", "in " + places)        # 183: «Neben Osnabrück» О, «Osnabrücker Land» С
    return firma, faq, nb

def check(city, firma, faq, nb):
    name = re.escape(city["displayName"])
    blocks = firma + "\n" + faq
    problems = []
    if re.search(r"in\s+" + name + r"\b[^.]{0,80}\btätig", blocks):
        problems.append("есть «in %s … tätig»" % city["displayName"])
    if "Osnabrücker Land" in blocks:
        problems.append("есть «Osnabrücker Land»")
    leaked = [n for n in OSN_NEIGHBORS if re.search(r"(^|\n)" + re.escape(n) + r"(\n|$)", firma) or n in faq]
    if leaked:
        problems.append("соседи Osnabrück: " + ", ".join(leaked))
    missing = [n for n in nb if n not in firma or n not in faq]
    if missing:
        problems.append("нет соседей города: " + ", ".join(missing))
    return problems

def main(argv):
    """Код выхода: 0 — GREEN, 1 — RED. Флаг --mutate-126 подкладывает дефект:
    в строке 126 «Osnabrück» заменяется на город."""
    mutate = "--mutate-126" in argv
    city = by["nordhorn"]
    firma, faq, nb = render(city, mutate_126=mutate)
    problems = check(city, firma, faq, nb)
    print("режим:", "подлог строки 126" if mutate else "правильная страница")
    print("  126:", firma.splitlines()[1])
    print("  183:", faq)
    if problems:
        print("RESULT: RED — " + "; ".join(problems))
        return 1
    print("RESULT: GREEN")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
