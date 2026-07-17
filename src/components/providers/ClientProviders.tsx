'use client';

import React from 'react';

import { FirebaseClientProvider, useUser } from '@/firebase';

import { Toaster } from '@/components/ui/toaster';
import { SparkAssistant } from '@/components/SparkAssistant';
import { RegistrationReminder } from '@/components/RegistrationReminder';
import { MissionNudge } from '@/components/MissionNudge';
import { FeedbackBox } from '@/components/FeedbackBox';
import { AuthGateDialog } from '@/components/AuthGateDialog';

import { LanguageProvider } from './LanguageProvider';
import { IdleLogoutProvider } from './IdleLogoutProvider';

import { Heart } from 'lucide-react';


/**
 * Allows the application UI to render immediately.
 * Firebase authentication synchronizes in the background.
 */
function IdentitySynchronizer({
  children
}: {
  children: React.ReactNode;
}) {

  const { loading } = useUser();


  return (
    <>
      {children}


      {loading && (

        <div
          className="
          fixed
          bottom-6
          left-1/2
          -translate-x-1/2
          z-50
          flex
          items-center
          gap-3
          rounded-full
          bg-white
          shadow-xl
          px-5
          py-3
          border
          "
        >

          <Heart
            className="
            w-5
            h-5
            text-primary
            fill-primary
            animate-heartbeat
            "
          />


          <span
            className="
            text-[10px]
            font-black
            uppercase
            tracking-widest
            text-primary
            "
          >
            Synchronizing Hearts
          </span>


        </div>

      )}

    </>
  );
}



/**
 * Main client provider wrapper
 */
export function ClientProviders({
  children
}: {
  children: React.ReactNode;
}) {


  return (

    <FirebaseClientProvider>


      <LanguageProvider>


        <IdentitySynchronizer>


          <IdleLogoutProvider>


            {children}


            <SparkAssistant />

            <AuthGateDialog />

            <FeedbackBox />

            <RegistrationReminder />

            <MissionNudge />

            <Toaster />


          </IdleLogoutProvider>


        </IdentitySynchronizer>


      </LanguageProvider>


    </FirebaseClientProvider>

  );

}