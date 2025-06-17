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

* **Next.js 15** – React framework for hybrid static & server-side rendering with App Router
* **React 18** – Declarative, component-based UI library
* **TypeScript** – Strongly typed JavaScript for scalable frontend development
* **TailwindCSS** – Utility-first CSS framework for design system and layout
* **tailwind-merge** + **tailwindcss-animate** – For merging conflicting utility classes and adding animations
* **Radix UI** – Unstyled and accessible UI primitives (`Dialog`, `Checkbox`, `Slider`, `Label`)
* **Headless UI** – Accessible component primitives used with Tailwind
* **Lucide React** + **Heroicons** + **React Icons** – Icon libraries for UI visual elements
* **Axios** – HTTP client for API communication
* **Socket.IO Client** – Real-time communication layer (chat, notifications)
* **Date-fns** + **React Datepicker** – Date handling and selection
* **React Cookie** – Cookie utilities for session and auth token handling
* **i18next** + **react-i18next** + **i18next-browser-languagedetector** – Full-featured internationalization
* **Sonner** + **React Hot Toast** – Lightweight notification and toast system
* **Sharp** – High-performance image processing (used internally by Next.js or for image optimization)
* **Emoji Picker React** – Emoji selection UI component
* **clsx** + **class-variance-authority** – Conditional and structured class name management

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
