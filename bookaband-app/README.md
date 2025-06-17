# BookaBand – Musician Dashboard (`bookaband-app`)

This project contains the private dashboard frontend of **BookaBand**, designed specifically for musicians and bands to manage their profiles, bookings, documents, and more. It functions as a CRM-style interface where artists can centralize their operations.

## Overview

`bookaband-app` is built with **Next.js** using the **App Router**, offering dynamic and server-rendered routes, multilingual support, and a modular UI architecture powered by TailwindCSS and Radix UI. It integrates with the Auth and Backend modules for access control, data fetching, and contract handling.

## Key Features

- 🎛️ **CRM-Style Dashboard** for musicians and band managers
- 📁 **Document Management** including contracts, riders, and media assets
- 📆 **Booking Calendar** with filtering and status tracking
- 📊 **Analytics & Charts** using Recharts
- 🧑‍🤝‍🧑 **Band Member and Role Management**
- 🔒 **Protected Routes** with session validation and auth redirection
- 🌐 **Multilingual Interface** via i18next
- 💬 **Real-Time Integration Ready** (e.g., notifications or messaging)
- 📱 **Fully Responsive Design** across all screen sizes

## Tech Stack

- **Next.js 15** – App Router, dynamic routing, SSR
- **React 18**
- **TypeScript**
- **TailwindCSS** + `tailwind-merge`, `tailwindcss-animate`
- **Radix UI** – UI primitives (`Dialog`, `Select`, `Checkbox`, `Progress`, `Switch`)
- **Framer Motion** – Motion effects and page transitions
- **Lucide & Heroicons** – Iconography
- **i18next + react-i18next** – Internationalization framework
- **Axios** – HTTP requests for backend APIs
- **Recharts** – Charting library for dashboard analytics
- **Cookies-next & React-cookie** – Session and auth cookie handling
- **Zxcvbn** – Password strength validation
- **Date-fns + React Datepicker + React Calendar** – Event and date utilities
- **Socket.IO Client** – WebSocket communication support
- **React Hot Toast / Sonner** – Notification and feedback system

## Project Structure

```
/public                # Static files and assets
/src
    /app
        /[lng]
            /dashboard       # Core musician interface
            /bookings        # Booking and schedule views
            /bands           # Band and member management
            ...
        /api                 # API routes for server-side logic
        /i18n                # i18next config and namespaces
    /components
    /hooks
    /lib
    /providers
    /service
```

## Prerequisites

- Node.js v22+
- `.env` file with required environment variables
- Backend and Auth modules running
- Google Maps API Key (for event mapping or location inputs)

## Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/bookaband-frontend.git
cd bookaband-frontend/bookaband-app
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example` and fill in the values.

4. Run the development server:

```bash
npm run dev
```
