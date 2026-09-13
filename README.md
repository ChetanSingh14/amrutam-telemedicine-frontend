# 🌿 Amrutam Telemedicine Web Application (Frontend)

A modern, responsive, and feature-rich Telemedicine frontend web application built with **React 18**, **TypeScript**, **Vite**, and **Axios**. Designed for seamless virtual healthcare delivery connecting Patients, Doctors, and Administrators.

---

## ✨ Features Overview

### 👤 Role-Based Authentication & Navigation
- Multi-role access supporting **Patient**, **Doctor**, and **Admin** accounts.
- JWT-based authentication flow with automated header injection via Axios interceptors.
- Responsive, intuitive navigation bar with dynamic tabs tailored to active user role.

### 🔍 Doctor Search & Discovery (`Patient`)
- Search doctors by name or keyword.
- Filter doctors by **Specialization**, **Minimum Rating**, and **Maximum Consultation Fee**.
- Interactive doctor cards showing qualifications, experience, fees, verification badges, and real-time available slots.

### 📅 Consultation Booking System (`Patient`)
- Interactive slot booking modal displaying real-time doctor availability.
- **Idempotent Booking Protection**: Prevents duplicate slot bookings by attaching unique `x-idempotency-key` headers to API requests.
- Optional medical symptom/notes attachment upon booking confirmation.

### 📋 Patient Dashboard (`My Bookings`)
- View scheduled, in-progress, completed, and cancelled consultation history.
- Direct access to virtual consultation meeting links.
- View and download digital prescriptions issued by attending doctors.
- One-click appointment cancellation.

### 🩺 Doctor Portal (`Doctor`)
- Profile customization: Specialization, qualifications, experience, consultation fees, and bio.
- **Availability Slot Management**: Create available time slots for patient appointments.
- Manage upcoming patient consultations and view patient profiles/notes.
- **Digital Prescription Generator**: Add diagnoses, prescribe multi-item medications (dosage, duration, frequency), and issue digital prescriptions directly to patients.

### ⚙️ Admin Dashboard (`Admin`)
- **System Analytics Overview**: Monitor total registered users, verified doctors, booked consultations, and total platform revenue.
- **Doctor Verification Panel**: Review and toggle doctor verification status.
- **System Audit Logs**: Real-time logging of user actions, roles, endpoints accessed, and timestamps for compliance and security monitoring.

---

## 🛠️ Tech Stack & Architecture

| Layer / Library | Technology |
| :--- | :--- |
| **Framework** | [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 6](https://vitejs.dev/) |
| **Styling** | Modern Vanilla CSS / Glassmorphism Design System |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **HTTP Client** | [Axios](https://axios-http.com/) |
| **State & Context** | React Hooks & `ToastContext` for global notifications |

---

## 📁 Directory Structure

```
src/
├── components/          # Reusable UI components & Page views
│   ├── AdminDashboard.tsx   # Platform metrics, doctor verification & audit logs
│   ├── AuthModal.tsx        # Login & Signup modal with role switcher
│   ├── BookingModal.tsx     # Slot selection & idempotent consultation booking
│   ├── DoctorPortal.tsx     # Availability slot creation, consultation & prescription management
│   ├── DoctorSearch.tsx     # Doctor discovery feed with multi-criteria filtering
│   ├── Navbar.tsx           # Global navigation & authentication controls
│   └── PatientBookings.tsx  # Patient booking history & prescription viewer
├── config/              # API & Client configurations
│   └── api.config.ts        # Axios client setup with JWT request interceptors
├── context/             # Global Application Contexts
│   └── ToastContext.tsx     # Global toast notification system
├── services/            # API integration layer
│   ├── admin.service.ts     # Analytics & verification endpoints
│   ├── auth.service.ts      # Authentication & user profile endpoints
│   ├── booking.service.ts   # Consultation booking & cancellation endpoints
│   ├── doctor.service.ts    # Doctor search & availability management
│   └── prescription.service.ts # Prescription creation & retrieval
├── types.ts             # TypeScript interfaces for API models
├── api.ts               # Shared Axios utility instance
├── App.tsx              # Main application router & state controller
├── index.css            # Custom CSS design system (Variables, Glassmorphism, Layouts)
└── main.tsx             # Application entrypoint
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

## 🔌 API Integration

The frontend connects to the Amrutam Telemedicine Backend API. Requests are automatically authenticated via Bearer tokens stored in `localStorage` under `amrutam_token`.

Key endpoints integrated:
- `POST /auth/register` & `POST /auth/login`
- `GET /doctors` (Search & Filter)
- `POST /doctors/availability/me` (Add slot)
- `POST /bookings` (Book consultation with `x-idempotency-key`)
- `GET /bookings/my-bookings`
- `POST /prescriptions` (Issue prescription)
- `GET /admin/analytics` & `GET /admin/audit-logs`

---

## 🛡️ License

This project is open source and available under the [MIT License](LICENSE).
