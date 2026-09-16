# LensLedger – Camera Rental Management Desktop App

> **Gear In. Stories Out.**

LensLedger is a Windows native desktop application designed for camera and cinema equipment rental businesses. Built with Electron, React, TypeScript, Tailwind CSS, and SQLite for high performance, local data persistence, and offline capability.

---

## ✨ Features (10 Complete Modules)

1. **Dashboard Overview**:
   - 6 KPI metric cards (Active Rentals, Today's Returns, Overdue, Today's Revenue, New Customers, Pending Payments).
   - 7-day interactive revenue trend chart and top equipment revenue ranking.
   - Quick Actions (New Rental, Add Customer, Receive Return, Record Payment).
   - Needs Attention alerts & Today's Rentals management.

2. **New Rental Booking Wizard (Multi-Step Flow)**:
   - Dedicated navigation item in the sidebar.
   - Step 1 & 2: Customer selection with instant lookup, Aadhaar details, rental history + equipment inventory multi-selection with live stock availability and quantity adjustment.
   - Step 3 (Schedule & Timing): Duration presets (`1 Day`, `2 Days`, `Weekend`, `1 Week`), pickup and return date/time pickers.
   - Step 4 (Pricing & Payment): Daily subtotal calculation, refundable security deposit, advance payment, and payment modes (UPI, Cash, Card, Bank Transfer).
   - Step 5 (Review & Confirm): Summary verification, KYC compliance check, and SQLite booking creation.

3. **Rentals Management**:
   - Status tabs: All (42), Active (18), Due Today (4), Overdue (3), Returned (312), Reserved (5).
   - Search, multi-select, quick return processing, and payment recording.

4. **Customers Directory**:
   - Master-detail split layout with customer profiles.
   - Masked Aadhaar security toggle (`••••` / unmask) and editable SQLite notes.

5. **Inventory & Equipment**:
   - Filter by category pills (Cameras, Lenses, Gimbals, Audio, Lighting, Accessories).
   - Detailed gear inspector with maintenance history and utilization metrics.

6. **Payments & Cashflow**:
   - Track transactions by status (Paid, Pending, Partial, Deposit, Refund).
   - Payment inspector panel with one-click UTR reference copying and printable receipt view.

7. **Analytics & Reports**:
   - 30-day interactive revenue trend bar chart.
   - Equipment revenue rankings, category utilization bars, top customers by revenue, and payment mode split donut chart.

8. **Messages & Automated Reminders**:
   - Reusable templates (Booking Confirmation, Due Reminder, Overdue Notice, Payment Reminder, Promotion).
   - Multi-channel support (WhatsApp & SMS) with live chat bubble simulation.

9. **Documents & KYC**:
   - Filter documents by category (Identity Proofs, Receipts, Agreements, Damage Photos).
   - Authentic Indian Aadhaar Card facsimile with Ashoka Lion Capital emblem, Tricolor header, and secure QR code.

10. **Settings & Configuration**:
    - Business profile, employee directory, granular 7-module role-based permissions checklist.
    - Rental pricing & late fee calculation rules, payment mode switches, automated notification triggers, document security, and SQLite database backup engine.

---

## 🛠️ Tech Stack

- **Desktop Framework**: Electron (`electron@44.4.0`)
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`), Lucide Icons
- **Database**: SQLite via `@libsql/client` (stored locally in `rentalservice.db`)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/rateshrake/rentalservice.git
cd rentalservice

# Install dependencies
npm install
```

### Development
```bash
# Run desktop app in development mode
npm run dev

# Or run web interface only
npm run dev:web
```

### Production Build & Packaging
```bash
# Compile TypeScript and bundle frontend
npm run build
```

---

## 📄 License
ISC License.
