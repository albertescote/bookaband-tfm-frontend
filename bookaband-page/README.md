# BookaBand – Public Website (`bookaband-page`)

This project contains the public-facing frontend of **BookaBand**, a web platform that connects event organizers with musicians and bands. It includes the main marketing page and all the customer-side booking flow.

## Overview

`bookaband-page` is built with **Next.js** using the **App Router**, supporting internationalization, SSR, and a modern UI powered by TailwindCSS and Radix. It focuses on providing an intuitive and engaging interface for potential clients looking to discover, filter, and book artists.

## Key Features

* 🌐 **Multilingual Interface** with dynamic routing based on locale (i18next)
* 🔍 **Artist Discovery Flow** with search filters
* 📄 **Marketing Pages** (About, Features, Mission, CTA)
* 🔐 **Protected Pages redirects to Auth Module** (sign-up/login via `/auth`)
* 📁 **Document Management** for handling contracts, riders, and legal documents with support for digital signature workflows
* 📅 **Datepickers and Calendar UI** for event browsing
* 💬 **Real-Time Integration Ready** (e.g., chat, notifications)
* 📱 **Fully Responsive Design** across devices

## Tech Stack

* **Next.js 15** – App Router, file-based routing, SSR, dynamic rendering
* **React 18**
* **TypeScript**
* **TailwindCSS** + `tailwind-merge`, `tailwindcss-animate`
* **Radix UI** – Accessible primitives (Dialog, Checkbox, Slider, etc.)
* **Framer Motion** – Smooth transitions and animations
* **Lucide & Heroicons** – Icon libraries
* **i18next + react-i18next** – Internationalization support
* **Axios** – HTTP requests
* **Date-fns + React Datepicker + React Calendar** – Calendar/date utilities
* **Socket.IO Client** – Real-time capabilities
* **Zxcvbn** – Password strength estimation
* **Cookies-next & React-cookie** – Cookie/session management
* **Sonner / React Hot Toast** – Notification system

## Project Structure

```
/public              # Static assets (images, icons, etc.)
/src
    /app
      /[lng]             # Dynamic locale routing
        /about           # Public pages
        /profile         # Protected page
        ...
    /api                 # API routes for server-side logic  
    /i8n                 # i18next configuration
    /components
    /hooks
    /lib
    /provders
    /service
```

## Prerequisites

* Node.js v22+
* `.env` file with necessary public environment variables
* Backend and Auth modules running (for redirects and API consumption)
* Google Maps API Key

## Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/bookaband-frontend.git
cd bookaband-frontend/bookaband-page
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on the provided `.env.example` and fill in the values.

4. Run the development server:

```bash
npm run dev
```
