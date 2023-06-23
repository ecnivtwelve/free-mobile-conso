import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vincelinise.freemobile',
  appName: 'Free Mobile',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    url: 'http://192.168.1.22:5173/'
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    },
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: false,
    }
  }
};

export default config;
