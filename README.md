# Web Tišnov podniká – průzkum mezi podnikateli Tišnovska

Statický web (čisté HTML/CSS, bez build kroku) pro Cloudflare Pages.
**Obsah této složky = kořen GitHub repozitáře.**

## Struktura

```
web/
├── index.html               ← landing page
├── zpracovani-udaju.html    ← informace o zpracování osobních údajů (čl. 13 GDPR)
├── 404.html                 ← chybová stránka (Cloudflare ji použije automaticky)
├── _headers                 ← bezpečnostní hlavičky + cache
├── robots.txt
├── README.md                ← tento soubor (do repozitáře může jít, na webu nevadí)
└── assets/
    ├── styles.css
    ├── favicon.svg
    ├── apple-touch-icon.png
    ├── og.png               ← náhled při sdílení na FB / WhatsApp / LinkedIn (1200×630)
    └── fonts/               ← Fraunces + Inter, hostované lokálně (žádný Google Fonts)
```

## Před spuštěním – co doplnit (hledej v souborech)

| Co | Kde | Poznámka |
|---|---|---|
| `tisnovpodnika.cz` | index.html, zpracovani-udaju.html | Pokud bude jiná doména → najít a nahradit všude (i v e-mailu `info@`) |
| `FORM_ID` + smazat `form-placeholder` | index.html, sekce `#dotaznik` | Postup v komentáři přímo v HTML |
| `pocet-firem` | index.html | Ruční přepis 1× týdně |
| žluté `[doplnit]` | zpracovani-udaju.html | IČO, sídlo, spisová značka spolku, datum spuštění, ověření DPF |
| `og.png` | assets/ | Pokud změníš doménu nebo nadpis, náhled přegenerovat |

**Nesazej ostrou verzi se žlutými `[doplnit]`** – GDPR stránka bez identifikace správce je vadná.

## Nasazení – jednorázově

1. **Doména (.cz):** registrovat u českého registrátora (Wedos, Forpsi, Active24…).
   Cloudflare Registrar .cz domény neregistruje (ověř aktuální stav).
2. **GitHub:** nový repozitář (může být private) → nahrát obsah této složky do kořene.
3. **Cloudflare:** Workers & Pages → Create → Pages → Connect to Git → vybrat repozitář.
   - Framework preset: *None*
   - Build command: *(prázdné)*
   - Build output directory: `/`
4. **Vlastní doména:** v Cloudflare přidat doménu (Free plan) → u registrátora přepnout
   NS servery na Cloudflare → v projektu Pages → Custom domains → přidat
   `tisnovpodnika.cz` i `www.tisnovpodnika.cz` (www přesměrovat na hlavní doménu).
5. **E-mail `info@`:** Cloudflare Email Routing (zdarma) → přeposílání na tvůj e-mail.
   Odesílání z této adresy vyřeší až Workspace nebo jiný poštovní hosting.
6. **Kontrola náhledu:** po nasazení vložit URL do
   https://developers.facebook.com/tools/debug/ (načte og.png).

## Průběžná údržba

- **Počítadlo:** v `index.html` přepsat číslo v `<strong id="pocet-firem">` → commit →
  Cloudflare nasadí automaticky (cca 1 min). Záměrně ručně – web nemá žádné napojení
  na tabulku s osobními údaji.
- **Průběžné výsledky (duben):** doplnit novou sekci do `index.html` (připravíme).

## Technické poznámky

- Žádné cookies, žádná analytika, fonty z vlastního serveru → není potřeba cookie lišta.
  Pokud chceš statistiky návštěvnosti: Cloudflare Web Analytics (bez cookies),
  ale je nutné upravit `script-src` v `_headers`.
- `Content-Security-Policy` povoluje vkládat rámce jen z `docs.google.com` (formulář).
  Video (YouTube apod.) nebo externí skripty se bez úpravy hlavičky nenačtou.
- **Všechny cesty jsou relativní** (`assets/…`, `zpracovani-udaju.html`), takže web funguje
  na vlastní doméně i na GitHub Pages pod podadresou (`…github.io/tisnov-podnika/`).
  Nové odkazy nikdy nezačínej lomítkem `/` – na GitHub Pages by vedly mimo projekt.
- `_headers` čte jen Cloudflare. GitHub Pages ho ignoruje (náhled funguje, jen bez CSP).
- `.nojekyll` vypíná Jekyll na GitHub Pages (jinak by ignoroval soubory začínající `_`).
- Lokální náhled: ve složce spustit `python -m http.server` a otevřít http://localhost:8000
