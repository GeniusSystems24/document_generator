# Genius PDF Web

مكتبة React + TypeScript لتوليد المستندات المالية والمحاسبية بصيغة PDF — بدعم عربي أصيل و RTL، وبوّابة تحقّق مالي تمنع التوليد قبل أن تختلّ الأرقام.

**Genius PDF Web** is a React + TypeScript library for generating financial and accounting documents in PDF — with first-class Arabic support, RTL/LTR rendering, and a financial validation gate that blocks generation before the numbers break.

---

## Overview

This repository contains the **showcase site** for the Genius PDF library. It is built as a static, multi-page site (HTML/CSS/JS) and demonstrates the library’s components, templates, architecture, and a live in-browser document generator.

### What it covers

- **Components** — Reusable document building blocks (data grids, rich text, info boxes, report headers, summaries, dividers).
- **Templates** — Ready-made financial documents: invoices, statements, financial reports, sales/HR documents, and 16 voucher classes (64 subtypes).
- **Tools** — Barcodes, QR codes, watermarks, encryption, digital signing, multi-format export, print, and PDF manipulation.
- **Architecture** — Fluent API engine, Clean Architecture layers, design tokens, i18n, MVC-on-React, and an optional AI/extensibility layer.
- **Live Generator** — A fully functional, client-side document generator that produces real PDFs (and PNG/JPEG/HTML/JSON/TXT) with real-time financial validation and ZATCA-compliant QR codes.

---

## Project structure

```
document_generator/
├── index.html              # Landing page with hero preview and feature tour
├── components.html         # Component gallery (Phase 2)
├── templates.html          # Templates & vouchers (Phases 3 & 4)
├── tools.html              # Tools & security (Phases 5–7)
├── architecture.html       # Engine & architecture (Phases 0, 1, 8)
├── generator.html          # Live document generator
├── assets/
│   ├── styles.css          # Shared styles, design tokens, responsive layout
│   └── app.js              # Shared UI logic (i18n toggle, navigation, mobile menu)
└── README.md               # This file
```

All pages are static HTML and share a common navigation, bilingual text system, and responsive layout.

---

## Key features

- **Arabic-first bilingual design** — Dynamic RTL/LTR switching, embedded Arabic fonts, numerals, and amount-in-words. Not a translation bolt-on; designed bilingually from the root.
- **Validate before render** — Totals, post-discount VAT, and accounting equation checks run first, using IEEE-754-safe integer math.
- **Reusable parts** — Every template is assembled from small, composable components, each with a preview and a PDF version.
- **Many outputs** — PDF, PDF/A, PNG, JPEG, HTML, text, SVG, and JSON — plus barcodes, watermarks, encryption, and digital signing.
- **Client-side only** — The live generator runs entirely in the browser; no data is sent to any server.

---

## Live generator capabilities

The `generator.html` page demonstrates the library end-to-end:

1. **Document types**
   - Tax Invoice (ZATCA-compliant)
   - Quotation
   - Account Statement
   - Operations Statement
   - Payment / Receipt Voucher
   - Payslip
   - Journal Entry

2. **Company identity** — Editable brand name, VAT, CR, city, and logo.

3. **Header & footer styles** — Multiple presets (classic, centered, banner, minimal, formal) and footer variants (QR, signatures, bank details, band, minimal).

4. **Financial validation** — Real-time checks for item completeness, discount range, VAT base compliance (ZATCA), and total balancing. Generation is blocked until validation passes.

5. **Export formats** — PDF, PDF/A, PNG, JPEG, SVG, HTML, text, and JSON.

6. **Templates** — Save, load, export, and import document templates as JSON.

---

## Architecture principles

- **Clean Architecture** — Dependencies point inward only:
  - `domain` — Entities, repository contracts, use cases (Model + Logic)
  - `data` — Repository implementations, datasources, mappers
  - `infrastructure` — PDF engine, export, storage, print, share, barcode (Adapters)
  - `presentation` — Components, pages, hooks/viewmodels (View + Controller)
  - `templates` — Ready-made compositions
- **MVC-on-React** — View has no logic; Controller (hooks + use cases) holds it; Model lives in domain.
- **Design tokens** — Single source of truth for colors, spacing, and typography; no hard-coded values.
- **i18n** — No hard-coded strings; all text flows through an i18n layer, and direction flips UI and document together.

See `architecture.html` for the full blueprint, folder structure, and final checklist.

---

## Tech stack

- **Frontend**: Static HTML5, CSS3, vanilla JavaScript
- **Fonts**: Amiri, IBM Plex Sans Arabic, IBM Plex Mono (Google Fonts)
- **PDF generation (live demo)**: jsPDF + html2canvas (client-side)
- **QR codes**: qrcode-generator (client-side, ZATCA TLV payload)
- **Planned library runtime**: React, TypeScript, `@react-pdf`, `pdf-lib`

---

## Getting started

This is a static site; no build step is required.

1. Clone or download the repository.
2. Open `index.html` in any modern browser, or serve the folder with a static file server:

   ```bash
   # Example with Python
   python -m http.server 8000

   # Example with Node.js (npx serve)
   npx serve .
   ```
3. Navigate through the pages or open `generator.html` to try the live document generator.

---

## Browser support

- Chrome / Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (responsive layout included)

---

## Roadmap (9 phases)

| Phase | Focus |
|-------|-------|
| 0 | Foundation: design tokens, i18n, app shell, component gallery |
| 1 | Engine: fluent API, auto pagination, smart page breaks, live preview |
| 2 | Components: DataGrid, RichText, InfoBox, ReportHeader, Summary, Divider |
| 3 | Templates: Invoices, statements, financial/sales/HR reports |
| 4 | Vouchers: 16 classes, 64 subtypes |
| 5 | Barcodes & QR codes |
| 6 | Watermarks, encryption, digital signing |
| 7 | Multi-export, print, PDF operations (merge/split) |
| 8 | Scale & intelligence: plugins, DI, events, caching, logging, AI assistant |

---

## License

© Genius Link Tech Solutions. All rights reserved.

---

## Contact

- **Website**: [Genius Link](https://geniuslink.com)
- **Location**: Riyadh, KSA
- **VAT**: 310045678000003

---

> **Note:** This repository hosts the **showcase/preview site**. The React library package itself is a separate artifact built on the architecture described here.
