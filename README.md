# BookaBand Frontend

This repository contains the three frontend projects for **BookaBand**, a web platform that simplifies the process of hiring musicians and bands for events. Each project handles a specific part of the user experience: the public site and client journey, the authentication module, and a private CRM-style interface for musicians.

## Repository Structure

* `bookaband-page`: Public-facing website and client portal for discovering and booking artists.
* `bookaband-auth`: Authentication module supporting email/password and Google sign-in.
* `bookaband-app`: Private dashboard for musicians to manage their bands, bookings, and contracts.

## Project Context

This project was developed as part of the Master’s Thesis for the *Master in Software Engineering and Computer Systems at UNIR (Universidad Internacional de La Rioja)*.

## Key Features

* **Role-based user interfaces**: tailored experiences for clients, artists, and authentication flow.
* **Booking and contract management**: full support for request, digital signature, and tracking of contracts.
* **Artist discovery interface**: advanced search with filters by artist name, location, and availability.
* **Secure login**: support for federated authentication (Google) and traditional login.
* **Musician CRM dashboard**: band, calendar, rider, and document management.
* **Responsive design**: optimized for desktop and mobile devices.

## Tech Stack

* **Next.js 15** – React framework for server-side rendering, routing, and hybrid static/dynamic pages.
* **React 18** – UI library for building reactive and component-based interfaces.
* **TypeScript** – Strongly typed superset of JavaScript for scalable and maintainable code.
* **TailwindCSS** – Utility-first CSS framework for rapid UI development.
* **Framer Motion** – Animations and motion effects for enhanced UX.
* **Radix UI** – Unstyled accessible UI primitives used for building custom components.
* **Headless UI** – Fully accessible UI components designed to integrate with TailwindCSS.
* **Lucide & Heroicons** – Icon libraries for consistent and modern visual design.
* **i18next + react-i18next** – Internationalization support for multi-language experiences.
* **Axios** – HTTP client for API communication.
* **Socket.IO Client** – Real-time communication (e.g., notifications or chat).
* **Zxcvbn** – Password strength estimation library.
* **Date-fns + React Datepicker + React Calendar** – Date utilities and components for event selection and scheduling.
* **Cookies-next + React Cookie** – Cookie-based session handling and SSR-friendly cookie access.
* **ESLint + Prettier** – Code quality and formatting tools with TailwindCSS plugin.
* **Sonner / React Hot Toast** – Toast and notification systems.

## Prerequisites

- Node.js (v22 or higher)
- Google Maps API Key
- Google OAuth Client Credentials

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/bookaband-frontend.git
cd bookaband-frontend
```

4. Start servers:

```bash
docker-compose up -d
```

