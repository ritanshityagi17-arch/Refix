# REFIX — Fix It First 🌱
> *Don't Trash It. Fix It First.*  
> A circular decision platform and interactive lifecycle assessment engine that helps individuals and communities repair, reuse, and responsibly replace everyday objects.

---

## 📖 About REFIX

REFIX empowers users to make sustainable, economically sound decisions for unwanted, damaged, or aged objects across **all material categories**—from consumer electronics, solid state drives, and small appliances to clothing, footwear, furniture, books, bicycles, cookware, and plastics.

By evaluating structural condition, repair feasibility, spare part availability, and lifecycle economics, REFIX generates transparent, rule-based recommendations:

1. **🔧 Repair** — Restore original functionality using basic tools, adhesives, or modular spare parts. Favorable when repair cost is under 50% of buying new.
2. **🔄 Reuse & Repurpose** — Give durable materials a creative second life (upcycling, sharing, donating) when primary function is impaired or unneeded.
3. **🛑 Replace Responsibly** — Certified recycling and upgrade to modular, repairable items when structural failure or toxic safety hazards (e.g. peeling PTFE cookware, cracked EPS safety foam) veto DIY fixes.

---

## 🚀 Key Features & Recent Improvements

### 1. Global Shared Currency Switcher
- **Unified Currency Engine**: Seamlessly switch between **USD ($)**, **EUR (€)**, **GBP (£)**, and **INR (₹)** across the entire application.
- **Consistent Monetary Synchronization**: Automatically recalculates and updates form input costs (`#originalCost`, `#repairCost`), the Live Draggable Card, recommendation cost comparison bars, community savings metrics, hero counters, presets, and the Community Impact Simulator.
- **Verified Benchmark Reference**: Employs transparent Q4 2024 central bank exchange benchmarks (`1 USD = 0.92 EUR | 0.79 GBP | 83.50 INR`) with honest disclaimers rather than pretending to maintain live latency-heavy APIs.

### 2. Universal Scope Section (Enhanced & Interactive)
- **Beyond Appliances**: Categorizes 7 core material domains:
  - 📱 **Electronics & SSDs** (Solid State Drives, laptops, smartphones, kitchen blenders, audio equipment)
  - 🪑 **Furniture & Woodwork** (solid oak chairs, tables, desks, dressers)
  - 👕 **Textiles & Footwear** (cotton shirts, denim, leather boots, backpacks)
  - 🍳 **Cookware & Glass** (cast iron, stainless steel, ceramics, PTFE safety vetoes)
  - 🚲 **Bicycles & Mechanics** (commuter bikes, skateboards, drills, hand tools)
  - 🔨 **Hardware & Fixtures** (faucets, locks, hinges, brass fittings)
  - 🧴 **Plastics & Books** (hardcover books, storage bins, suitcases, PET containers)
- **Selectable Scope Items & Solid State Drive (SSD)**: Every category card features interactive subcategory pills (including **Solid State Drive (SSD)**). Clicking any chip or the "Assess Object" button visibly highlights the card (`.is-selected`), pre-populates the assessment form, synchronizes the Draggable Card, and immediately updates the circularity verdict.
- **Fluid Category Switching**: Users can switch from one category to another without page reloads.

### 3. DIY Creative Repurposing Ideas Studio
- **10 Core Material Streams**: Features 18+ rich, practical DIY projects covering clothing, footwear, books, paper, wood, electronics, plastics, glass, metals, toys, and bicycles.
- **Dynamic Contextual Suggestion**: Automatically highlights matching DIY projects when an item is evaluated or configured in the engine.
- **Real-Time Category Filters & Instant Search**: Filter by material stream or search by keywords (e.g. "t-shirt", "SSD", "drawer", "denim", "glass").
- **Actionable DIY Cards & Guide Modal**:
  - Step-by-step instructions (with checkable steps)
  - Materials and tools checklist
  - Difficulty level (`Beginner`, `Intermediate`, `Advanced`) and estimated completion time
  - Environmental carbon metrics (\(\text{kg CO}_2\text{e}\)) and money saved in active currency
  - **Safety Callout Notes**: Essential precautions (e.g. wearing gloves when filing glass/metal rims, never opening high-voltage capacitors or microwave transformers, avoiding food contact with chemical plastic containers).
  - One-click "Evaluate in Engine" action.

### 4. Redesigned Minimal Brand Logo
- **Modern Sustainability Emblem**: An inline SVG vector emblem combining an infinite circular renewal loop with an integrated organic leaf and precision repair tool contour in an emerald-to-cyan gradient (`#10b981` to `#06b6d4`), paired with clean modern typography: **REFIX — Fix It First**.
- **Dark & Light Adaptability**: High contrast strokes and soft squircle container ensure clarity across desktop navbars, mobile drawers, printable certificates, and footers.

### 5. Balanced Section & Navbar Distribution
- **Evenly Spaced Navigation**: Utilizes modern flexbox distribution (`justify-content: space-evenly; gap: clamp(...)`) preventing crowded links across desktop and tablet viewports.
- **Consistent Section Spacing**: Harmonized section paddings, container max-widths (`1260px`), and fluid grids with zero horizontal scrolling.

### 6. Spatial Drag-and-Drop Decision Engine
- **Spatial Evaluation**: Drag any item card or preset into any designated **Action Zone** (`REPAIR`, `REUSE`, `REPURPOSE`, `RECYCLE`, `REPLACE`) or Framework card.
- **Touch & Click Fallback**: Mobile users can simply tap a card and tap an Action Zone to execute calculations.

### 7. Visual Damage Scanner & Inspection HUD
- **Camera & Image Upload**: Capture a photo directly through your webcam or upload image files (`.jpg`, `.png`, `.webp`).
- **Inspection Verification**: Localizes surface defects, fractures, joint wear, and material strain, attaching a verified photo badge to the final assessment certificate.

---

## 💻 Tech Stack

- **HTML5**: Semantic, accessible markup with native Drag-and-Drop and webcam API support.
- **CSS3**: Modern custom properties, fluid responsive layouts (`clamp()`), glassmorphic overlays, and zero horizontal scroll.
- **JavaScript (ES6+)**: Modular client-side architecture (`data.js`, `engine.js`, `app.js`) with zero npm dependencies, build tools, or frameworks.

---
