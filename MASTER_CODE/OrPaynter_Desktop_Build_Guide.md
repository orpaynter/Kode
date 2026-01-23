# OrPaynter Desktop Application - Build Guide

## Overview
This guide provides complete instructions for building the OrPaynter desktop application locally using the Tauri framework to create the final OrPaynter.exe executable.

## Prerequisites

### 1. Install Rust and Cargo
```bash
# Install Rust (includes Cargo)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Verify installation
rustc --version
cargo --version
```

### 2. Install Node.js and pnpm
```bash
# Install Node.js (version 18 or higher)
# Download from: https://nodejs.org/

# Install pnpm
npm install -g pnpm

# Verify installation
node --version
pnpm --version
```

### 3. Install Tauri CLI
```bash
# Install Tauri CLI
cargo install tauri-cli

# Or via npm
npm install -g @tauri-apps/cli

# Verify installation
tauri --version
```

### 4. Windows-specific Requirements (for .exe builds)
- **Microsoft Visual Studio C++ Build Tools** or **Visual Studio Community**
- **Windows 10 SDK**

## Building OrPaynter Desktop Application

### Step 1: Navigate to Project Directory
```bash
cd orpaynter-desktop
```

### Step 2: Install Dependencies
```bash
pnpm install
```

### Step 3: Set Environment Variables
Create a `.env` file in the project root with your API keys:
```bash
# .env file
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Step 4: Build the Desktop Application
```bash
# Build for production
pnpm run tauri:build

# Or build for specific target
pnpm run tauri:bundle
```

### Step 5: Locate the Built Application
After successful build, find your executable:
- **Windows**: `src-tauri/target/release/OrPaynter.exe`
- **macOS**: `src-tauri/target/release/bundle/macos/OrPaynter.app`
- **Linux**: `src-tauri/target/release/bundle/appimage/OrPaynter.AppImage`

## Alternative: Development Mode
For testing during development:
```bash
# Run in development mode
pnpm run tauri:dev
```

## Troubleshooting

### Common Issues:

1. **Rust Compilation Errors**
   ```bash
   # Update Rust toolchain
   rustup update
   ```

2. **Missing System Dependencies (Linux)**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install libwebkit2gtk-4.0-dev build-essential curl wget libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev
   
   # Fedora
   sudo dnf install webkit2gtk3-devel openssl-devel curl wget libappindicator-gtk3-devel librsvg2-devel
   ```

3. **Permission Issues**
   ```bash
   # Fix permissions if needed
   chmod -R 755 src-tauri
   ```

## Build Optimization

### For Smaller Bundle Size:
```bash
# Build with release optimizations
RUST_LOG=none pnpm run tauri:build
```

### For Performance:
- Ensure all animations are optimized
- Use production API endpoints
- Enable release mode optimizations

## Security Configuration

The application includes:
- CSP (Content Security Policy) for web security
- Secure API communication with Supabase and OpenAI
- Local file system access controls
- System tray integration

## Distribution

After building:
1. Test the executable thoroughly
2. Sign the application for Windows (optional but recommended)
3. Create installer packages using tools like:
   - **Windows**: NSIS, Inno Setup, or Windows Installer
   - **macOS**: Create DMG or use Mac App Store
   - **Linux**: Create AppImage, Snap, or Flatpak

## Performance Targets

The built application should meet:
- **Cold Start**: <3 seconds to usable interface
- **Memory Usage**: <200MB baseline footprint
- **CPU Usage**: <5% idle CPU usage
- **Bundle Size**: Optimized using Tauri's built-in optimizations

## Final Notes

- The web version is already successfully deployed at: https://3q71sqnu9nce.space.minimax.io
- All core features are implemented and tested
- The desktop version provides native system integration
- All source code is ready for local building

For any build issues, refer to the official Tauri documentation: https://tauri.app/v1/guides/building/