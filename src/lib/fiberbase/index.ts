import {
    getAuth,
    setPersistence,
    browserSessionPersistence
  } from "firebase/auth";
  
  const auth = getAuth(app);
  
  setPersistence(auth, browserSessionPersistence)
    .catch(console.error);
  
  export { auth };