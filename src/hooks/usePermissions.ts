"use client";


import {useAuth} from "@/hooks/useAuth";

import {
hasPermission
}
from "@/security/permissionEngine";


import {
Permission
}
from "@/security/permissions";



export function usePermissions(){


const {user}=useAuth();



const role =
user?.role || "guest";



return {


canCreateSpark:

hasPermission(
role,
Permission.CREATE_SPARK
),


canSendMessage:

hasPermission(
role,
Permission.SEND_MESSAGE
),


canJoinCircle:

hasPermission(
role,
Permission.JOIN_CIRCLE
),


canDonate:

hasPermission(
role,
Permission.DONATE
),


canManageUsers:

hasPermission(
role,
Permission.MANAGE_USERS
)



};


}