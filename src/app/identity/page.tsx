"use client";

import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  User
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";

import {
  auth,
  db
} from "@/lib/firebase";


export default function IdentityHubPage() {


  const [user, setUser] = useState<User | null>(null);

  const [identity, setIdentity] = useState<any>(null);

  const [loading, setLoading] = useState(true);



  useEffect(() => {


    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (currentUser) => {


          try {


            if (!currentUser) {

              setLoading(false);

              return;

            }


            setUser(currentUser);



            const identityRef =
              doc(
                db,
                "users",
                currentUser.uid
              );


            const snapshot =
              await getDoc(identityRef);



            if (snapshot.exists()) {


              setIdentity(
                snapshot.data()
              );


            } else {


              const newIdentity = {


                uid:
                currentUser.uid,


                name:
                currentUser.displayName ||
                "New User",


                email:
                currentUser.email || "",


                photoURL:
                currentUser.photoURL || "",


                language:
                "English",


                country:
                "",


                skills:
                [],


                interests:
                [],


                createdAt:
                serverTimestamp()


              };



              await setDoc(
                identityRef,
                newIdentity
              );


              setIdentity(
                newIdentity
              );


            }



          }

          catch(error) {


            console.error(
              "Identity synchronization error:",
              error
            );


          }

          finally {


            setLoading(false);


          }


        }

      );



    return () =>
      unsubscribe();


  }, []);



  if (loading) {


    return (

      <main className="p-6">


        <h1 className="text-3xl font-bold">

          👤 Identity Hub

        </h1>


        <p className="text-lg mt-4">

          Synchronizing Identity...

        </p>


      </main>

    );

  }



  if (!user) {


    return (

      <main className="p-6">


        <h1 className="text-3xl font-bold">

          👤 Identity Hub

        </h1>


        <p className="mt-4">

          Please sign in to continue.

        </p>


      </main>

    );


  }



  return (

    <main className="p-6 space-y-6 pb-24">



      <h1 className="text-4xl font-bold">

        👤 Identity Hub

      </h1>



      <p className="text-gray-600 font-medium italic">

        Your personal, social, learning,
        professional and impact identity.

      </p>




      {/* Personal Identity */}

      <section className="rounded-2xl border p-5 bg-white shadow-sm">


        <h2 className="text-2xl font-semibold">

          🪪 Personal Identity

        </h2>


        <div className="mt-3 space-y-2">


          <p>

          <span className="font-bold uppercase text-[10px] text-slate-400">Name:</span>
          {" "}
          {identity?.name}

          </p>


          <p>

          <span className="font-bold uppercase text-[10px] text-slate-400">Email:</span>
          {" "}
          {identity?.email}

          </p>


          <p>

          <span className="font-bold uppercase text-[10px] text-slate-400">Language:</span>
          {" "}
          {identity?.language}

          </p>


        </div>


      </section>




      {/* Social Identity */}

      <section className="rounded-2xl border p-5 bg-white shadow-sm">


        <h2 className="text-2xl font-semibold">

          ❤️ Social Identity

        </h2>


        <ul className="mt-3 space-y-2 font-medium">

          <li>
          ❤️ Spark Preferences
          </li>

          <li>
          🤝 Circle Memberships
          </li>

          <li>
          💬 Connections
          </li>


        </ul>


      </section>




      {/* Learning Identity */}

      <section className="rounded-2xl border p-5 bg-white shadow-sm">


        <h2 className="text-2xl font-semibold">

          🎓 Learning Identity

        </h2>


        <ul className="mt-3 space-y-2 font-medium">

          <li>
          📚 Courses
          </li>

          <li>
          🏆 Certificates
          </li>

          <li>
          🧠 Skills
          </li>


        </ul>


      </section>




      {/* Professional Identity */}

      <section className="rounded-2xl border p-5 bg-white shadow-sm">


        <h2 className="text-2xl font-semibold">

          💼 Professional Identity

        </h2>


        <ul className="mt-3 space-y-2 font-medium">

          <li>
          🚀 Projects
          </li>

          <li>
          📁 Portfolio
          </li>

          <li>
          💼 Career
          </li>


        </ul>


      </section>





      {/* Impact Identity */}

      <section className="rounded-2xl border p-5 bg-white shadow-sm">


        <h2 className="text-2xl font-semibold">

          🌱 Impact Identity

        </h2>


        <ul className="mt-3 space-y-2 font-medium">

          <li>
          🤲 Volunteer Activities
          </li>

          <li>
          🌍 Community Contributions
          </li>

          <li>
          ⭐ Impact Score
          </li>


        </ul>


      </section>





      {/* Security */}

      <section className="rounded-2xl border p-5 bg-white shadow-sm">


        <h2 className="text-2xl font-semibold">

          🔐 Security Center

        </h2>


        <ul className="mt-3 space-y-2 font-medium">

          <li>
          Device Sessions
          </li>

          <li>
          Privacy Settings
          </li>

          <li>
          Account Protection
          </li>


        </ul>


      </section>



    </main>

  );


}