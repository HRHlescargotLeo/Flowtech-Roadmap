# Flowtech — website improvement prototypes (V2)

Five clickable prototypes for improvements to flowtech.co.uk, prepared by ClerksWell
following the phase 1 review (1 October 2026). The Flowtech design layer (Inter, Flowtech blue and sky,
square 52px controls, the blue footer and black utility strips) lives entirely in `src/css/theme.css`;
remove that file to get the greyscale prototypes back. `src/css/flowtech-tokens.css` holds the measured tokens.

Product shots and photography are Flowtech's own, loaded directly from flowtech.co.uk's image hosts
(ImageKit for Pimberly product images, payload.flowtech.co.uk for CMS photos) by `src/js/photos.js`,
which maps images to products, case studies, services, sectors and branches. Where an image can't load,
an illustrated placeholder in the brand blues shows instead. Photography © Flowtech; the repository and
site are public, so treat them accordingly. Maps, the hose diagram and logos for group brands stay drawn.

## View
Live: https://hrhlescargotleo.github.io/Flowtech-Roadmap/

Or open `docs/index.html` in a browser. No server or install needed.

GitHub Pages publishes from the `docs/` folder on `main`
(Settings → Pages → Deploy from a branch → `main` / `/docs`).

## Prototypes
1. Find a fitting — `pages/find-a-fitting.html`, plus `pages/fitting-finder.html`
2. Product page — `pages/product.html` (opens any sample product via `?code=<code>`)
3. Order and quote — `pages/quick-order.html`, `pages/request-a-quote.html`, `pages/my-quotes.html`, `pages/register.html`
4. Engineering services — `pages/services.html`, `pages/service.html?id=`, `pages/sector.html?id=`, `pages/case-studies.html`, `pages/hose-builder.html`, `pages/book-a-visit.html`
5. Find a branch — `pages/branches.html`, `pages/branch.html?id=`

Module library: `modules/library.html`. Requirements (R-numbers mapped to idea numbers): `requirements/requirements.md`.

## Build
```
node build-includes.js && node validate.js
```
Edit files in `src/`; `docs/` is generated (commit it, as GitHub Pages serves it). The prototype navigator
(top bar with the Notes switch and sample basket) and the previous/next footer live in `src/includes/`.
All behaviour is in `src/js/wireframe.js`; sample data is in `src/js/data.js`.

## Data
Product codes, names, prices and national stock follow flowtech.co.uk as seen on 1 October 2026.
Branch towns and group brands follow the Contact and Locations pages; only County Durham's address and
phone are real. Branch stock, lead times, quotes, hose options and prices, course dates, equivalents
mapping and anything in [brackets] are samples.

## Status
V2, designed prototypes for internal review (V1 was greyscale). Flowtech's own header and footer are replaced by a
prototype navigator. Notes are off by default; switch "Notes on" in the top bar to show what each
prototype proposes and why, plus in-page annotations (yellow: behaviour, red: questions for Flowtech).
