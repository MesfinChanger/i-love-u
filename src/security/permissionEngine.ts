import {UserRole} from "./roles";

import {Permission} from "./permissions";


export const rolePermissions = {


guest:[

Permission.VIEW_PUBLIC_CONTENT,

Permission.VIEW_PROFILE

],


member:[

Permission.VIEW_PUBLIC_CONTENT,

Permission.VIEW_PROFILE,

Permission.CREATE_SPARK,

Permission.JOIN_CIRCLE,

Permission.SEND_MESSAGE

],


verified:[

Permission.VIEW_PUBLIC_CONTENT,

Permission.VIEW_PROFILE,

Permission.CREATE_SPARK,

Permission.JOIN_CIRCLE,

Permission.SEND_MESSAGE,

Permission.CREATE_PRODUCT,

Permission.DONATE

],



moderator:[

Permission.MODERATE_CONTENT,

Permission.VIEW_SECURITY

],



admin:[

"*"

]


};
export function hasPermission(

    role:string,
    
    permission:Permission
    
    ){
    
    const permissions =
    rolePermissions[role];
    
    
    if(!permissions)
    return false;
    
    
    if(
    permissions.includes("*")
    )
    return true;
    
    
    
    return permissions.includes(permission);
    
    }