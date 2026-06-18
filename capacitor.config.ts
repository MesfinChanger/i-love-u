
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.spark.dating',
  appName: 'Spark',
  webDir: 'out',
  server: {
    // Firebase automatically provides free domains for testing:
    // https://<your-project-id>.web.app
    // Replace 'spark-dating' with your actual Firebase Project ID found in the console.
    url: 'https://spark-dating.web.app',
    allowNavigation: [
      'spark-dating.firebaseapp.com',
      'spark-dating.web.app'
    ],
    cleartext: true
  }
};

export default config;
