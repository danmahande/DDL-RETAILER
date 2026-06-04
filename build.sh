#!/bin/bash
# Build script for DDL Retailer App
# Usage: 
#   ./build.sh web     - Build for web deployment
#   ./build.sh mobile  - Build static export for Capacitor (Android/iOS)

set -e

if [ "$1" = "mobile" ]; then
  echo "📱 Building for mobile (Capacitor static export)..."
  
  # Temporarily move API routes out (they don't work with static export)
  if [ -d "src/app/api" ]; then
    mv src/app/api src/app/_api_backup
    echo "  ℹ️  API routes temporarily excluded (native app uses localStorage)"
  fi
  
  # Build static export
  npx next build
  
  # Restore API routes
  if [ -d "src/app/_api_backup" ]; then
    mv src/app/_api_backup src/app/api
    echo "  ✅ API routes restored"
  fi
  
  # Sync with Capacitor
  npx cap sync
  echo "  ✅ Capacitor sync complete"
  echo ""
  echo "Run the following to open in Android Studio:"
  echo "  npx cap open android"
  echo ""
  echo "Or run directly on a connected device:"
  echo "  npx cap run android"

elif [ "$1" = "web" ]; then
  echo "🌐 Building for web deployment..."
  # For web, we use the standard Next.js build (not static export)
  # Temporarily switch config
  if [ -f "next.config.ts" ]; then
    mv next.config.ts next.config.ts.bak
  fi
  
  cat > next.config.web.ts << 'EOF'
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "standalone",
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: false,
};
export default nextConfig;
EOF
  mv next.config.web.ts next.config.ts
  npx next build
  
  # Restore original config
  rm next.config.ts
  if [ -f "next.config.ts.bak" ]; then
    mv next.config.ts.bak next.config.ts
  fi
  echo "  ✅ Web build complete"

else
  echo "Usage: ./build.sh [web|mobile]"
  echo ""
  echo "  mobile  - Build static export + sync with Capacitor for Android/iOS"
  echo "  web     - Build for web server deployment"
  echo ""
  echo "For development, just run: npm run dev"
fi
