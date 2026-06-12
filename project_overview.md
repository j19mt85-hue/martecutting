# 🪚 Smart რასკროი (Smart Cutting) - Project Overview

## 🌟 Introduction
**Smart რასკროი** is a modern, responsive, and robust 2D panel cutting optimization platform built entirely in React and TypeScript. Aimed at industrial furniture workshops, the software generates optimal cutting layouts (cut trees) for wood and MDF sheets minimizing waste, reducing edge-banding material loss, and integrating seamlessly into existing workshop workflows.

Built as a highly resilient single-page application (SPA), the system relies heavily on client-side and simulated worker-based optimizations.

## 🛠 Tech Stack
* **Vite**: Ultra-fast build tool and development proxy.
* **React 18**: View and component layer with standard hooks.
* **TypeScript**: End-to-end type safety, validating models for parts, sheets, and engine inputs.
* **Tailwind CSS v4**: Utility-level styling optimized for high-density dashboard layouts, rendering a custom, dark "slate" high-contrast theme appropriate for heavy-duty operational environments.
* **Zustand**: Client-side data management, featuring `persist` middleware caching project states dynamically inside LocalStorage.
* **motion (framer-motion)**: High-performance orchestrator for micro-interactions, modal fly-ins, state spinners, and complex element mounting.
* **lucide-react**: Clean, consistent SVG icon set.
* **jspdf & qrcode**: Native generation of printable Label/Barcode outputs and vector-based PDFs scaling infinitely across thermal print interfaces.

## 🏗 Architecture & Core Domains

### 1. The Global Store (`useAppStore.ts`)
The unified source of truth managed by Zustand tracks operations in a relational structure.
* **`parts` & `modules`**: User-defined panels mapped to a broader functional object (like "Cabinet 1"). Contains properties describing cut dimensions, grain orientations, edgebanding rules, and nested module identities.
* **`sheets` & `remnants`**: Tracks standard raw materials entering the workspace and offsets from leftover usable "remnant" components.
* **`materials` & `edgebands`**: Configuration lists of raw definitions. 

### 2. Nesting Layout Engine (`src/engine/`)
The system incorporates an inline simulated engine modeling the classic NP-Hard bin-packing problem typical for architectural guillotines. 
* By resolving items directly into fractional ratios against an active physical bin size (e.g. 2800x2070mm), it places components across `x` and `y` axes efficiently. 
* It's fully capable of isolating logic for edge padding constraints and grain limitations via deterministic heuristics. 
* *Integration Note:* The real AI logic relies on a mock "calculating..." interval simulated to convey background Worker processing delays smoothly out of the main thread lifecycle. 

### 3. Visualizations (`src/components/Workspace.tsx`)
A dedicated 2D canvas area that mirrors physical workshop reality:
* Maps each resolved placement item scaled proportionately against the host bin.
* Implements dynamic CSS layout scaling, hovering feedback metrics per panel, and dynamic shadow rendering against the "dark-glass" backdrop to give the environment depth.

### 4. Import / Export Lifecycle
* Project state can securely serialize itself into JSON blobs enabling **Save / Load Project** mechanisms locally, eliminating risks concerning network drops typical to workshop domains.
* **CNC Compatibility**: Capable of outputting raw `.DXF` entity strings defining polygonal layers (`POLYLINE`) of Bin outer boundaries vs enclosed nested targets, which CNC CAM software tools directly ingest without further CAD adaptations. 
* **Automated PDF Labeller**: Traverses resulting coordinates rendering isolated "Thermal Dimension Labels" equipped with distinct visual identifiers and inline 2D Quick Response (QR) codes.

## 🔥 Key Feature Upgrades

1. **POS (Point of Sale) Interactivity**: Integrating the workshop directly to financial outcomes. Calculations process dynamically matching material coverage totals, estimated border trims (edgebands), and baseline operator servicing costs translating immediately to an invocable "Terminal" Modal concluding financial transactions (Cash/Card).
2. **Cutting 2.0 / 3.0 & Data Import Integration**: Seamless pipeline imports via `.CSV` logic capable of parsing architectural lengths (`Length, Width, Qty, Label`), removing the requirement for operators to type parts manually. Likewise, exports back into `.CSV` compatible with industry-standard Cutting 2/3 tools have been baked into the Workspace. 
3. **Data Analytics & ML Cost Estimator**: Features real-time utilization modeling integrated via `recharts`. A new *Analytics* tab projects optimal mathematical utilizations before the CPU actually renders placements, visualizing waste reduction trends across rolling cycles.
4. **Client Quote Generation**: Added standalone capability enabling workshop administrators to generate unauthenticated pricing approximations for clients with single-click clipboard functionalities. 
5. **Mobile Layout Expansion**: A seamless side-rail drawer translation on narrow orientations giving mobile/tablet end-users identical configuration access securely via a Hamburger menu toggle without disrupting canvas viewports.
6. **Pinnable Tab Management**: Modules, Parts, Sheets, Remnants, Materials, Edgebands, and Analytics interact under an animated rail, prioritizing fluid operational speed over multi-layered settings screens. 
7. **Public Order Tracking**: Introduced public-facing `/track` and `/quote` routes for end-clients. Customers can securely visualize their active orders via dynamically generated tracking codes (e.g. `QR29S`), rendering their respective material summaries, service statuses (Pending, Cutting, Ready), and cut-part tabular sheets via transparent online portfolios.

## 🗺 Current State and Next Steps
The application currently models data within dynamic offline schemas via LocalStorage, but is primed for the next major production step:
* **Cloud Infrastructure (Supabase + Cloudflare)**: Migrating the application state strictly via `Cloudflare` edge-infrastructure mapped onto strong `Supabase` relational tables. This activates authentic `Multi-Tenant` organizational scopes.
* **Custom Domain Identity**: Planning structural preparations for mapping to a custom purchased domain, enabling production-ready client experiences.
* **Real-time Auth & Connectivity**: Replacing sandbox simulations for QR tracking links with live backend polling APIs.
