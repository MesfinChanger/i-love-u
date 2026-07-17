'use client';

import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '../provider';


export function useUser() {

  const auth = useAuth();
  console.log("I LOVE U Auth State:", auth);

  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);



  useEffect(() => {


    if (!auth) {

      setUser(null);

      setLoading(false);

      return;

    }



    const unsubscribe =
      onAuthStateChanged(

        auth,

        (firebaseUser) => {

          setUser(firebaseUser);

          setLoading(false);

        },


        (error) => {

          console.warn(
            "I Love U Auth Observer:",
            error
          );

          setUser(null);

          setLoading(false);

        }

      );



    return () => unsubscribe();


  }, [auth]);



  return {
    user,
    loading
  };

}
