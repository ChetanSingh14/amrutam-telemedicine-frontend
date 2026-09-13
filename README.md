# 🌿 Amrutam Telemedicine Web Application (Frontend)

A modern, responsive, and feature-rich Telemedicine frontend web application built with **React 18**, **TypeScript**, **Vite**, **Axios**, and **Socket.IO**. Designed for seamless virtual healthcare delivery connecting Patients, Doctors, and Administrators with high-concurrency session security.

---

## ✨ Features Overview

### 🔒 Strong Session Security & Single-Session Enforcement
- **Session Token Isolation**: Uses `sessionStorage` for tab-isolated authentication tokens, preventing token leakage across browser sessions.
- **Cross-Tab Single-Session Enforcement (`BroadcastChannel`)**: Automatically detects concurrent logins across open browser tabs. If a user logs into their account in another tab/device, older tabs execute an **immediate force logout** with alert notifications.
- **Real-Time WebSockets (`socket.io-client`)**: Listens to server-emitted `CONCURRENT_LOGIN` and `FORCE_LOGOUT` events to revoke compromised or invalid sessions instantly.
- **Automatic 401 Interceptor**: Intercepts `401 Unauthorized` API responses to clear session tokens and trigger global session expiration notifications.

### 👤 Role-Based Authentication & Dynamic Routing
- Multi-role access supporting **Patient**, **Doctor**, and **Admin** accounts.
- **Centralized Route Registry (`ROUTE_REGISTRY`)**: Modular page management where adding a new page automatically handles role permissions and navigation bar buttons.

### 🔍 Doctor Search & Discovery (`Patient`)
- Search doctors by name, symptom, or keyword.
- Filter doctors by **Specialization** (Ayurveda, General Physician, Dermatology, Pediatrics, etc.).
- Interactive doctor cards showing qualifications, experience, fees, verification badges, and real-time availability.

### 📅 Consultation Booking System (`Patient`)
- Interactive slot booking modal displaying real-time doctor availability.
- **Idempotent Booking Protection**: Prevents duplicate slot bookings by attaching unique `x-idempotency-key` headers to API requests.
- Optional medical symptom/notes attachment upon booking confirmation.

### 📋 Patient Dashboard (`My Bookings`)
- View scheduled, in-progress, completed, and cancelled consultation history.
- Direct access to virtual consultation video meeting links.
- View and download digital prescriptions issued by attending doctors.

### 🩺 Doctor Portal (`Doctor`)
- Profile customization: Specialization, qualifications, experience, consultation fees, and bio.
- **Availability Slot Management**: Create available time slots for patient appointments.
- Manage upcoming patient consultations and view patient profiles/notes.
- **Digital Prescription Generator**: Add diagnoses, prescribe multi-item medications (dosage, duration, frequency), and issue signed digital prescriptions directly to patients.

### ⚙️ Admin Dashboard (`Admin`)
- **System Analytics Overview**: Monitor total registered users, verified doctors, booked consultations, and total platform revenue.
- **Doctor Verification Panel**: Review and toggle doctor verification status.
- **System Audit Logs**: Real-time logging of user actions, roles, endpoints accessed, and timestamps for compliance monitoring.

---

## 🛠️ Tech Stack & Architecture

| Layer / Library | Technology |
| :--- | :--- |
| **Framework** | [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 6](https://vitejs.dev/) |
| **Realtime Gateway** | [Socket.IO Client](https://socket.io/) |
| **HTTP Client** | [Axios](https://axios-http.com/) |
| **Styling** | Modern Vanilla CSS / Glassmorphism Design System |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **State & Context** | `AuthContext` (Session & WebSockets) + `ToastContext` (Notifications) |

---

## 📁 Directory Structure

```
src/
├── components/            # Reusable UI widgets & modals ONLY
│   ├── AuthModal.tsx      # Login & Signup modal with AuthContext integration
│   ├── BookingModal.tsx   # Idempotent slot booking modal
│   └── Navbar.tsx         # Global navigation bar dynamically generated from ROUTE_REGISTRY
├── pages/                 # Full Page Views
│   ├── DoctorSearchPage.tsx     # Doctor discovery & filtering page view
│   ├── PatientBookingsPage.tsx  # Patient booking history & prescription viewer page view
│   ├── DoctorPortalPage.tsx     # Doctor clinical studio & prescription generator page view
│   └── AdminDashboardPage.tsx   # Executive analytics & audit logs page view
├── routes/                # Central Navigation & Route Registry
│   ├── navigation.config.ts    # Centralized route definitions (ID, Label, Icon, Component, Allowed Roles)
│   └── AppRoutes.tsx           # Dynamic page renderer with role-based access enforcement
├── services/              # Encapsulated API Services & Realtime WebSockets
│   ├── admin.service.ts        # Analytics & audit log endpoints
│   ├── auth.service.ts         # Session token management (sessionStorage)
│   ├── booking.service.ts      # Consultation booking & cancellation endpoints
│   ├── doctor.service.ts       # Doctor search & availability management
│   ├── prescription.service.ts # Prescription creation & retrieval
│   └── socket.service.ts       # Real-time WebSocket manager for force logout
├── context/               # Application Context Providers
│   ├── AuthContext.tsx         # Single-session cross-tab BroadcastChannel & WebSocket listener
│   └── ToastContext.tsx        # Toast feedback notifications
├── types.ts               # TypeScript interfaces for API models
├── api.ts                 # Shared Axios client instance re-export
├── App.tsx                # App Shell managing layout & routing via AppRoutes
├── index.css              # Custom CSS design system (Variables, Glassmorphism, Layouts)
└── main.tsx               # Application entrypoint with AuthProvider & ToastProvider
```

---

## 🚀 How to Add a New Page to the Application

Adding a new page requires only **2 steps**:

1. **Create your Page Component** in `src/pages/MyNewPage.tsx`:
   ```tsx
   import React from 'react';

   export const MyNewPage: React.FC = () => {
     return <div>My New Page Content</div>;
   };
   ```

2. **Register it** in `src/routes/navigation.config.ts`:
   ```typescript
   import { MyNewPage } from '../pages/MyNewPage';
   import { Sparkles } from 'lucide-react';

   export const ROUTE_REGISTRY: RouteDefinition[] = [
     // ...existing routes
     {
       id: 'my-new-page',
       label: 'New Feature',
       component: MyNewPage,
       icon: Sparkles,
       allowedRoles: ['PATIENT'], // optional: restrict role access
       showInNavbar: true,       // automatically renders tab in Navbar!
     },
   ];
   ```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **Amrutam Telemedicine Backend API** running locally (default: `http://localhost:3001/api/v1`)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ChetanSingh14/amrutam-telemedicine-frontend.git
   cd amrutam-telemedicine-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory (optional if using defaults):
   ```env
   VITE_API_BASE_URL=http://localhost:3001/api/v1
   VITE_SOCKET_URL=http://localhost:3001
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

---

## 📜 Available Scripts

- `npm run dev` - Starts the Vite development server with Hot Module Replacement (HMR).
- `npm run build` - Runs TypeScript type checks (`tsc`) and compiles production assets into `dist/`.
- `npm run preview` - Locally previews the production build.

---

## 🔌 API & Socket Integration

The frontend connects to the Amrutam Telemedicine Backend API & WebSocket Gateway:
- **HTTP Client**: Calls are encapsulated in `src/services/` and automatically attach Bearer session tokens.
- **WebSocket Gateway**: Connected via `socket.service.ts` for instant concurrent login revocation and force logout notifications.

---

## 🛡️ License

This project is open source and available under the [MIT License](LICENSE).
