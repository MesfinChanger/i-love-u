import { headers } from "next/headers";
import { stripe } from "@/lib/stripe-server";
import { adminDb } from "@/lib/firebase-admin";
import Stripe from "stripe";

/**
 * Universal Stripe Webhook Collector
 *
 * Security Protocol:
 *
 * - Stripe signature verification
 * - Firebase Admin null protection
 * - Idempotent event processing
 * - Wallet transaction ledger
 * - Order recording
 * - Audit trail
 */


export async function POST(
  req: Request
) {

  const body =
    await req.text();


  const headerList =
    await headers();


  const signature =
    headerList.get(
      "stripe-signature"
    );


  if (!signature) {

    console.error(
      "[Stripe Shield] Missing signature"
    );

    return new Response(
      "Missing stripe signature",
      {
        status: 400,
      }
    );
  }



  let event: Stripe.Event;



  try {

    event =
      stripe.webhooks.constructEvent(
        body,
        signature,
        process.env
          .STRIPE_WEBHOOK_SECRET ?? ""
      );


  } catch (error: any) {


    console.error(
      "[Stripe Shield] Signature verification failed:",
      error.message
    );


    return new Response(
      "Webhook verification failed",
      {
        status: 400,
      }
    );

  }




  /**
   * Only process completed checkout sessions
   */

  if (
    event.type !==
    "checkout.session.completed"
  ) {

    return new Response(
      "ignored",
      {
        status: 200,
      }
    );

  }




  const session =
    event.data.object as Stripe.Checkout.Session;




  const userId =
    session.metadata?.userId;



  if (!userId) {


    console.warn(
      "[Stripe Shield] Missing userId metadata:",
      session.id
    );


    return new Response(
      "missing user",
      {
        status: 200,
      }
    );

  }




  /**
   * Firebase Admin safety check
   */

  if (!adminDb) {


    console.error(
      "[Firebase Shield] Admin database unavailable"
    );


    return new Response(
      "Database unavailable",
      {
        status: 500,
      }
    );

  }





  try {


    /**
     * Stripe idempotency protection
     *
     * Stripe may resend events.
     * We must not create duplicate transactions.
     */


    const eventRef =
      adminDb
        .collection(
          "stripeEvents"
        )
        .doc(
          event.id
        );



    const existingEvent =
      await eventRef.get();



    if (
      existingEvent.exists
    ) {


      console.log(
        "[Stripe Shield] Duplicate event ignored:",
        event.id
      );


      return new Response(
        "already processed",
        {
          status: 200,
        }
      );

    }




    await eventRef.set({

      eventId:
        event.id,

      eventType:
        event.type,

      createdAt:
        new Date(),

    });







    const amount =
      session.amount_total
        ? session.amount_total / 100
        : 0;




    const transactionType =
      session.metadata?.type
      ??
      "unknown";






    /**
     * Wallet transaction ledger
     */


    await adminDb

      .collection(
        "wallets"
      )

      .doc(
        userId
      )

      .collection(
        "transactions"
      )

      .add({

        stripeSessionId:
          session.id,


        stripeEventId:
          event.id,


        userId,


        type:
          transactionType,


        amount,


        currency:
          session.currency
            ?.toUpperCase()
          ??
          "USD",


        status:
          "completed",


        description:
          session.metadata
            ?.productName
          ??
          `${transactionType} transaction`,


        metadata:
          session.metadata
          ??
          {},


        createdAt:
          new Date(),

      });








    /**
     * Gift purchase order record
     */


    if (
      transactionType ===
      "gift_purchase"
    ) {


      await adminDb

        .collection(
          "orders"
        )

        .add({

          buyerId:
            userId,


          sellerId:
            session.metadata
              ?.sellerId
            ??
            "unknown",



          products: [

            {

              productId:
                session.metadata
                  ?.productId
                ??
                "gift",


              name:
                session.metadata
                  ?.productName
                ??
                "Spark Gift",


              price:
                amount,


              quantity:
                1,

            }

          ],



          total:
            amount,



          paymentStatus:
            "paid",



          shippingStatus:
            "pending",



          createdAt:
            new Date(),

        });

    }





    console.log(
      "[Stripe Shield] Transaction recorded:",
      {
        userId,
        sessionId: session.id,
      }
    );



  } catch (error) {


    console.error(
      "[Stripe Shield] Database processing failed:",
      error
    );


    /**
     * Return 200.
     *
     * Stripe retries failed webhooks.
     * The error is already logged.
     */


  }




  return new Response(
    "ok",
    {
      status: 200,
    }
  );

}