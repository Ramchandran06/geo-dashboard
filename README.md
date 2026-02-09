# React Geo Data Dashboard

A high-performance React dashboard built with Vite to visualize 5,000+ spatial data records using a synchronized Data Table and Interactive Map.

## 🚀 Key Features

- **Large Dataset Handling:** Efficiently renders 5,000 rows of data without UI lag.
- **Map-Table Synchronization:**
  - Clicking a table row centers the map on the corresponding marker.
  - Clicking a map marker highlights the respective row in the table.
- **Data Filtering:** Real-time client-side filtering by Project Name or Status.
- **Pagination:** Optimized data display using Material UI Pagination.

## 🛠️ Technical Decisions & Decisions Explained

- **Vite:** Chosen for its extremely fast development environment and optimized build process.
- **Leaflet (react-leaflet):** Selected for its lightweight nature and ease of integration for marker plotting compared to heavier map libraries.
- **Material UI (MUI):** Used for professional UI components like the Data Table, Pagination, and Search bar to ensure a clean user interface.
- **Performance Optimization:**
  - Instead of rendering all 5,000 markers at once (which would slow down the browser), I used **Pagination** and **useMemo**.
  - **useMemo** ensures that filtering logic only runs when the search query changes, preventing unnecessary re-renders.
- **Component Separation:** Logical separation of UI (MUI) and Data Logic (React Hooks) for better maintainability.

## 💻 Tech Stack

- **Frontend:** React.js (Functional Components + Hooks)
- **Maps:** Leaflet & React-Leaflet
- **UI Components:** Material UI (MUI)
- **State Management:** Local State (useState, useMemo)

## 🛠️ How to run the project

1. Clone the repository:
   ```bash
   git clone [Your Repository URL]
   ```
