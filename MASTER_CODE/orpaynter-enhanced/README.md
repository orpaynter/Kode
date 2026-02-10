# OrPaynter Enhanced

**OrPaynter Enhanced** is a next-generation roofing platform that integrates advanced **AI Orchestration**, **Offline-First** capabilities, and **Cross-Platform** support. It is designed to manage complex AI overlays for business logic while ensuring robust performance across diverse hardware and network conditions.

## 🚀 Key Features

*   **AI Orchestrator Dashboard**: A centralized control plane for multi-model traffic splitting, A/B testing, and real-time performance monitoring.
*   **Offline-First Architecture**: Integrated **PowerSync** to ensure seamless data synchronization and full functionality even without internet connectivity.
*   **Hardware-Aware Backend**: Intelligent backend (Python/Flask) that automatically detects and optimizes for **CUDA (NVIDIA)**, **MPS (Apple Silicon)**, or CPU execution.
*   **Cross-Platform & Mobile**: Fully configured as a **Progressive Web App (PWA)** and wrapped with **Capacitor** for native iOS and Android deployment.
*   **Production-Ready Deployment**: Includes a complete **Docker** orchestration suite with **Nginx** reverse proxy for secure, scalable hosting.
*   **Commercial-Grade Distribution**: Built-in licensing and secure software distribution workflows.

## 🛠️ Tech Stack

*   **Frontend**: React, TypeScript, Vite, Tailwind CSS, Framer Motion
*   **Backend**: Python, Flask, Gunicorn
*   **Database & Sync**: Supabase, PowerSync (SQLite)
*   **Infrastructure**: Docker, Docker Compose, Nginx
*   **Mobile**: Capacitor, PWA

## 📦 Installation & Deployment

### Prerequisites
*   Node.js (v18+)
*   Python (3.9+)
*   Docker & Docker Compose

### Quick Start (Development)

1.  **Install Dependencies**:
    ```bash
    npm install
    cd backend && pip install -r requirements.txt && cd ..
    ```

2.  **Run Locally**:
    ```bash
    npm run dev
    # In a separate terminal:
    npm run server
    ```

### Production Deployment

We provide automated scripts for one-click production builds:

*   **Windows**:
    ```powershell
    .\deploy.bat
    ```
*   **Linux/macOS**:
    ```bash
    ./deploy.sh
    ```

For manual Docker deployment:
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

## 📂 Documentation

*   [**Deployment Guide**](./docs/Deployment_Guide.md): Detailed steps for server setup and environment configuration.
*   [**Project Showcase**](./docs/OrPaynter_Project_Showcase.md): High-level overview of the system's value proposition.
*   [**Architecture Visualization**](./docs/presentation/index.html): Interactive HTML presentation of the system architecture.
*   [**AI Overlay Demo**](http://localhost:5173/demo_host_app.html): Live simulation of the AI Overlay injection into a legacy CRM.

## 📱 Mobile Support

The application is PWA-ready. To build for mobile:

```bash
npm run build
npx cap sync
npx cap open android  # or ios
```

---
*Built for the OrPaynter Ecosystem.*
