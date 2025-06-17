# BookaBand – Authentication Module (`bookaband-auth`)

This project contains the authentication system of **BookaBand**, handling user registration, login, and session management. It supports multiple authentication strategies and is shared across all frontend surfaces: public site, client portal, and musician dashboard.

## Overview

`bookaband-auth` is built with **Next.js** using the **App Router** and **NextAuth.js**, providing a secure and extensible authentication layer. It is designed to be embedded in redirects from other modules (`/sign-in`, `/sign-up`, etc.) and manages user sessions and provider login.

## Key Features

- 🔐 **Authentication Flow** with support for username/password and OAuth (Google)
- 📧 **Email Verification & Session Management**
- 🧭 **Redirect-based Routing** for protected areas (client and musician)
- 🌐 **Multilingual Support** using i18next
- 🧩 **NextAuth Adapter Ready** for backend integration (Prisma)
- ⚠️ **Error and Feedback Handling** with toasts and edge-case screens
- 📱 **Responsive UI** for mobile and desktop

## Tech Stack

* **Next.js 15** – React framework with App Router and built-in SSR
* **React 18** – Modern frontend library for declarative UI
* **TypeScript** – Static typing for maintainable code
* **TailwindCSS** – Utility-first CSS framework for design system and responsiveness
* **tailwind-merge** + **tailwindcss-animate** – For class merging and animation support
* **Radix UI** – Low-level, accessible primitives (`Dialog`, `Label`)
* **Lucide React** + **React Icons** – Icon libraries used for branding and form cues
* **Axios** – HTTP client for backend/auth API calls
* **Zxcvbn** – Password strength estimation for secure UX
* **React Cookie** – Utilities for handling cookies and session state
* **i18next** + **react-i18next** + **i18next-browser-languagedetector** – Full-featured internationalization and locale detection
* **Framer Motion** – Component animation and transitions
* **React Hot Toast** – Simple toast system for feedback and notifications
* **Sharp** – High-performance image processing library (used internally or by Next.js)

## Project Structure

```
/public                    # Static assets
/src
    /app
        /[lng]
            /login         # Login page
            /sign-up       # Registration page
            ...
        /federation        # Federation routes for google authentication
        /i8n               # i18next configuration
    /components
    /lib
    /service
```

## Prerequisites

- Node.js v22+
- `.env` file with NextAuth and OAuth credentials
- Backend service ready with session and user APIs
- Google OAuth Client ID and Secret

## Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/bookaband-frontend.git
cd bookaband-frontend/bookaband-auth
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
