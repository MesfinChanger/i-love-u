
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.spark.dating',
  appName: 'Spark',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    allowNavigation: ['spark-dating.firebaseapp.com']
  }
};

export default config;
