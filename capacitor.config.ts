import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ddlplatform.retailer',
  appName: 'DDL Retailer',
  webDir: 'out',
  server: {
    // For local dev with live reload on device
    // url: 'http://YOUR_LOCAL_IP:3000',
    // cleartext: true,
    androidScheme: 'https',
  },
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#1B2A4A',
    },
    Network: {
      // Network status monitoring
    },
    Geolocation: {
      // For neighborhood detection
    },
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
    allowMixedContent: false,
  },
  ios: {
    contentInset: 'automatic',
  },
};

export default config;
