'use client';

import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '../provider';


export function useUser() {

  const auth = useAuth();

  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);



  useEffect(() => {


    if (!auth) {

      console.warn(
        "Firebase auth not initialized"
      );

      setLoading(false);

      return;

    }



    const unsubscribe =
      onAuthStateChanged(
        auth,

        (firebaseUser)=>{

          setUser(firebaseUser);

          setLoading(false);

        },


        (error)=>{

          console.error(
            "Auth error:",
            error
          );

          setLoading(false);

        }

      );



    // Safety timer
    const timer = setTimeout(()=>{

      setLoading(false);

    },5000);



    return ()=>{

      unsubscribe();

      clearTimeout(timer);

    };


  },[auth]);



  return {
    user,
    loading
  };

}