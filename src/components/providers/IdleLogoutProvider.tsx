'use client';

import React, {
  useEffect,
  useRef,
  useCallback
} from 'react';

import {
  useUser,
  useAuth,
  useFirestore,
  useDoc
} from '@/firebase';

import { signOut } from 'firebase/auth';
import { doc } from 'firebase/firestore';

import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { useToast } from '@/hooks/use-toast';



/**
 * High-Security Idle Timeout Monitor.
 *
 * Features:
 * - Automatic logout after inactivity
 * - Browser close logout
 * - User configurable timeout from Firestore
 */
export function IdleLogoutProvider({
  children
}: {
  children: React.ReactNode;
}) {


  const { user } = useUser();

  const auth = useAuth();

  const db = useFirestore();

  const { toast } = useToast();


  const timerRef = useRef<NodeJS.Timeout | null>(null);



  const userRef = useMemoFirebase(() => {

    if (!db || !user) return null;

    return doc(
      db,
      "users",
      user.uid
    );

  }, [db, user]);



  const { data: profile } = useDoc(userRef);



  // Default security timeout:
  // 10 minutes

  const timeoutInSeconds =
    profile?.idleTimeout || 600;





  const handleLogout = useCallback(async () => {


    if (!auth || !user) return;


    try {


      await signOut(auth);


      toast({

        title: "Session Expired",

        description:
          "You were signed out for your security. ❤️",

      });



    } catch(error) {


      console.error(
        "Idle logout error:",
        error
      );


    }


  }, [
    auth,
    user,
    toast
  ]);







  const resetTimer = useCallback(() => {


    if (timerRef.current) {

      clearTimeout(timerRef.current);

    }



    if (user) {


      timerRef.current =
        setTimeout(
          handleLogout,
          timeoutInSeconds * 1000
        );


    }


  }, [
    user,
    timeoutInSeconds,
    handleLogout
  ]);








  useEffect(() => {


    if (!user) {


      if (timerRef.current) {

        clearTimeout(timerRef.current);

      }


      return;


    }




    const events = [

      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart"

    ];





    const handleActivity = () => {

      resetTimer();

    };





    const handleUnload = () => {


      if (auth) {


        signOut(auth)
          .catch(error => {

            console.error(
              "Unload logout error:",
              error
            );

          });


      }


    };






    events.forEach(event => {


      window.addEventListener(
        event,
        handleActivity
      );


    });





    window.addEventListener(
      "beforeunload",
      handleUnload
    );





    // Start timer immediately

    resetTimer();







    return () => {



      events.forEach(event => {


        window.removeEventListener(
          event,
          handleActivity
        );


      });





      window.removeEventListener(
        "beforeunload",
        handleUnload
      );





      if (timerRef.current) {


        clearTimeout(timerRef.current);


      }


    };



  }, [
    user,
    auth,
    resetTimer
  ]);






  return <>{children}</>;

}