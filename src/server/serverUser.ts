import { Elysia, t } from "elysia";
import { appUsersPlugin, } from '../api/user/users'
import { currentusersPlugin } from '../api/user/currentuser'
import { appuploadImg } from "../api/user/uploadimg"

export const appUser = new Elysia()
    .guard({
    beforeHandle: ({set,profile}) =>{
        if (!profile) {
        set.status = 401
        return 'Unauthorized'
        }
        else if (profile.role != "user") {
            return 'Unauthorized'
        } 
    }
    }, (app) =>
                app
                .use(appuploadImg)
                .use(currentusersPlugin)
                .use(appUsersPlugin)
    )