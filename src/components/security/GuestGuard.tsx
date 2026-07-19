"use client";


import {usePermissions}
from "@/hooks/usePermissions";


import JoinMissionDialog
from "@/components/dialogs/JoinMissionDialog";



export default function GuestGuard({

children,

permission

}){


const permissions =
usePermissions();



const allowed =
permissions[permission];



if(!allowed){

return (

<JoinMissionDialog/>

)

}



return children;


}