# User Management & Book Search Portal

A lightweight, responsive full-stack web application that combines a user registration system with a real-time book discovery tool. Built with a decoupled architecture, it features a Vanilla JavaScript frontend and a Node.js REST API backed by SQLite.

## Features

* **User Management System:** Full CRUD (Create, Read, Update, Delete) capabilities via a REST API.
* **Dynamic Form Validation:** Real-time frontend validation with conditional UI rendering (e.g., expanding custom skill fields).
* **Asynchronous Book Search:** Live integration with the Open Library API to fetch and display book data, complete with loading states and error handling.
* **Responsive Design:** Mobile-first UI built rapidly using Tailwind CSS.

## Architecture & Design

The application follows a standard **Client-Server Architecture** with clear separation of concerns.

### Frontend (Presentation Layer)
* **Technology:** HTML5, Vanilla JavaScript, Tailwind CSS (via CDN).
* **Design Pattern:** Single-Page Application (SPA) feel using asynchronous `fetch` requests to prevent page reloads.
* **State Management:** Handled natively in the DOM. UI elements (loading indicators, error messages, hidden fields) are toggled via CSS utility classes based on API response states.

### Backend (Application Layer)
* **Technology:** Node.js, Express.js.
* **API Design:** RESTful principles. Routes are strictly mapped to standard HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`) with appropriate HTTP status codes (200, 201, 400, 404, 500) returned.
* **Middleware:** `cors` for Cross-Origin Resource Sharing, `express.json()` for parsing incoming request bodies, and `express.static()` to serve the frontend assets.

### Database (Data Layer)
* **Technology:** SQLite3.
* **Design:** A file-based relational database (`users.db`) created dynamically on the first run. Chosen for its zero-configuration setup and suitability for lightweight or embedded applications.

## Prerequisites

To run this project locally, ensure you have the following installed:
* Node.js (v18 or higher recommended)
* npm (Node Package Manager)
* C/C++ Build Tools (e.g., `base-devel`, `gcc`, `python` on Linux) required for compiling SQLite native bindings.

## Installation & Setup

1. **Clone the repository** (or create the project directory):
   ```bash
   git clone <repository-url>
   cd user-backend