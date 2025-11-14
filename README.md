<div align="center">
  <h1>Duty Pilot – Frontend</h1>
  <p>React + TypeScript SPA (Vite + Ant Design) with multi-list management, duty statuses, theming, and RTL tests.</p>
</div>

## Table of Contents

1. [Overview](#overview)
2. [UI Highlights](#ui-highlights)
3. [Folder Structure](#folder-structure)
4. [Prerequisites](#prerequisites)
5. [Environment Variables](#environment-variables)
6. [Setup & Usage](#setup--usage)
7. [Testing & Linting](#testing--linting)
8. [Available Scripts](#available-scripts)
9. [Screenshots](#screenshots)
10. [Troubleshooting](#troubleshooting)

---

## Overview

This repository contains the frontend for Duty Pilot. It consumes the backend REST API, renders multiple themed to-do lists, lets users toggle duty status tags (Pending → In Progress → Done), delete items, and switch between light/dark themes with immediate visual feedback.

The app was built to satisfy the assessment requirements:
- React + TypeScript (strict) with Hooks and Context API.
- SPA (Vite) – no Next.js or server rendering.
- Ant Design component library for UI consistency.
- Form validation on every duty/list input.
- React Testing Library + Jest for critical components/hooks.

---

## UI Highlights

- **Sidebar List Manager**: create, rename, delete, and switch between themed to-do lists.
- **Duty Status Tags**: Ant Design `Tag` cycles status on click, with optimistic updates and visual cues (line-through, opacity).
- **Dark / Light Theme Switcher**: header toggle to switch between default and Dracula-inspired palette.
- **Responsive Layout**: Ant Design `Layout` + CSS variables for consistent look across screen sizes.
- **Global Contexts**: `ActiveListContext` and `ThemeContext` provide state across the SPA without Redux/useReducer.

---

## Folder Structure

```
src
├── components/   # DutyList, DutyItem, Sidebar, ListManager, DutyForm, etc.
├── contexts/     # ActiveListProvider, ThemeProvider
├── hooks/        # useDuties, useLists plus tests
├── services/     # Axios client + duty/list services
├── types/        # DTOs shared across the UI
├── utils/        # validation helper + unit tests
└── assets/styles # global styles & theme variables (if applicable)
```

---

## Prerequisites

| OS               | Requirements                                                                                              |
| ---------------- | --------------------------------------------------------------------------------------------------------- |
| **Windows 10+**  | [Node.js 20+](https://nodejs.org/en/download/), npm 10+, [Git](https://git-scm.com/downloads)             |
| **macOS 13+**    | Node 20+ (`brew install node`), npm 10+, Git                                                              |
| **Ubuntu 22.04** | `sudo apt install -y nodejs npm git`                                                                      |

> Ensure the backend API is running (default `http://localhost:3001/api`).

---

## Environment Variables

Create `front/.env` with:

| Variable       | Description                  | Default                     |
| -------------- | ---------------------------- | --------------------------- |
| `VITE_API_URL` | Base URL for the backend API | `http://localhost:3001/api` |

---

## Setup & Usage

1. **Clone & install**
   ```bash
   git clone <FRONTEND_REPO_URL>
   cd front
   npm install
   cp .env.example .env   # create and set VITE_API_URL if needed
   ```
2. **Run in development**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173`. The UI will automatically hit `VITE_API_URL` for data.
3. **Build for production**
   ```bash
   npm run build
   npm run preview   # optional sanity check
   ```

---

## Testing & Linting

| Command        | Description                                 |
| -------------- | ------------------------------------------- |
| `npm run test` | Jest + React Testing Library (hooks/components).
| `npm run lint` | ESLint (strict TypeScript config).          |

> `src/hooks/useDuties.test.ts` and `src/components/DutyList/DutyList.test.tsx` cover the newest features (status tags, list filtering, loading states).

---

## Available Scripts

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run test`
- `npm run lint`

---

## Screenshots

<img width="1912" height="915" alt="Captura de tela 2025-11-14 183551" src="https://github.com/user-attachments/assets/ec2c475a-4557-4c92-85cb-f2f784b77b5f" />

<img width="1908" height="940" alt="Captura de tela 2025-11-14 183712" src="https://github.com/user-attachments/assets/b8cbf888-a03e-4b69-aaeb-83bacd5f09ca" />

<img width="1912" height="944" alt="Captura de tela 2025-11-14 183724" src="https://github.com/user-attachments/assets/153e0689-98e5-49c0-b26c-0d7bf830dc2c" />

<img width="1904" height="621" alt="image" src="https://github.com/user-attachments/assets/c8d8cd3c-c8e9-4c0e-9ebb-f114fcb92140" />



---

## Troubleshooting

- **API requests failing** → Ensure the backend is running and `VITE_API_URL` matches the API base.
- **CORS errors** → Update the backend `CORS_ORIGIN` to match the frontend origin.
- **Ant Design styles missing** → Confirm `main.tsx` wraps the app with `AntApp` and the CSS imports are intact.
- **Tests timing out** → Run `npm run test -- --runInBand` or set `CI=1` on Windows for stability.
- **Theme variables not updating** → Clear browser cache or disable extensions injecting CSS.

---

Need backend instructions instead? See the backend repository README—this document is scoped to the frontend only.
