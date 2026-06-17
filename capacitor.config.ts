import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.spark.dating',
  appName: 'Spark',
  webDir: 'out',
  server: {
    // Replace this with your actual hosted URL once deployed to Firebase App Hosting
    url: 'https://spark-dating.web.app',
    allowNavigation: ['spark-dating.firebaseapp.com'],
    cleartext: true
  }
};

export default config;