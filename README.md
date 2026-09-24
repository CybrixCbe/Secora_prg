# SECORA - Cybersecurity Reconnaissance & AI Security Assistant Platform

SECORA is a modern, high-precision cybersecurity reconnaissance workstation and AI security analysis platform built for security researchers, penetration testers, and security engineers.

---

## 🚀 Key Features

- **Reconnaissance Engine**: Fast multi-threaded network & protocol scanners (TCP Ports, DNS Resolution, SSL/TLS, HTTP Headers, Technology Fingerprinting, Robots & Sitemaps).
- **AI Security Intelligence**: Context-aware security advisories powered by Cloud Qwen 2.5 LLM with dynamic 24h conversation management and scan findings telemetry.
- **Interactive 3D Geospatial Globe**: Interactive Three.js/WebGL global attack surface visualization.
- **Authentication & Security**: Email auth, OTP reset, and Google OAuth 2.0 Single Sign-On (SSO).
- **Export & Reports**: Structured PDF, CSV, TXT, and JSON report generation.

---

## 🛠️ Tech Stack

- **Backend**: Python 3, Flask, SQLite, Gunicorn
- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS v4, Three.js, Lucide Icons
- **AI Integration**: Qwen 2.5 Cloud API (OpenAI-compatible)

---

## 📦 Local Installation & Setup

1. **Clone & Setup Environment**:
   ```bash
   git clone https://github.com/CybrixCbe/secora.git
   cd secora
   python -m venv venv
   # On Windows: .\venv\Scripts\activate
   # On Linux/macOS: source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Build Frontend**:
   ```bash
   cd frontend
   npm install
   npm run build
   cd ..
   ```

3. **Run Application**:
   ```bash
   python app.py
   ```
   Open `http://localhost:5000` in your browser.

---

## 🌐 Deploy to Render

SECORA is pre-configured with `render-build.sh` for easy one-click deployment on Render:
- **Build Command**: `./render-build.sh`
- **Start Command**: `gunicorn app:app`
