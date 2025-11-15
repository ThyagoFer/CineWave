import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cinewave.app',
  appName: 'CineWave',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    iosScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1a0a2e',
      showSpinner: false
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1a0a2e'
    }
  }
};

export default config;
