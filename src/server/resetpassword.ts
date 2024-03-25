import { Elysia, t } from "elysia";
import { resetpassword } from '../api/user/users'

export const resetpasswords = new Elysia()
    .guard({
    beforeHandle: ({set,profile}) =>{
        if (!profile) {
        set.status = 401
        return 'Unauthorized'
        }
        else if (profile.role != "resetpassword") {
            return 'Unauthorized'
        } 
    }
    }, (app) =>
                app
                .use(resetpassword)
                
                
    )