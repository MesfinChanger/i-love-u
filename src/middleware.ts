import { NextRequest, NextResponse } from "next/server";


const protectedRoutes = [

  "/dashboard",

  "/wallet",

  "/messages",

  "/profile/edit",

  "/donate",

  "/checkout",

  "/admin",

  "/moderator"

];


const authRoutes = [

  "/login",

  "/signup"

];



export function middleware(
  request: NextRequest
) {


  const { pathname } = request.nextUrl;



  const session =
    request.cookies.get(
      "firebase-auth-token"
    );



  const isProtected =
    protectedRoutes.some(
      (route)=>
        pathname.startsWith(route)
    );



  const isAuthPage =
    authRoutes.some(
      (route)=>
        pathname.startsWith(route)
    );



  /*
     Protected Pages

     Guest users cannot enter
  */

  if(
    isProtected &&
    !session
  ){

    const url =
      request.nextUrl.clone();


    url.pathname="/join";


    url.searchParams.set(
      "return",
      pathname
    );


    return NextResponse.redirect(url);

  }



  /*
     Logged users don't need login page
  */


  if(
    isAuthPage &&
    session
  ){

    return NextResponse.redirect(
      new URL(
        "/dashboard",
        request.url
      )
    );

  }



  return NextResponse.next();

}



export const config={


matcher:[

"/dashboard/:path*",

"/wallet/:path*",

"/messages/:path*",

"/profile/:path*",

"/donate/:path*",

"/checkout/:path*",

"/admin/:path*",

"/moderator/:path*"

]


};