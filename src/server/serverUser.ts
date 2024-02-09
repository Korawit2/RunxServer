import { Elysia, t } from "elysia";
import { appUserguardPlugin } from '../api/user/guardUser'
import { getraces } from '../api/races/races'
import { appgetOrgPlugin } from '../api/org_Events/Organization'
import { appgetEventPlugin } from '../api/org_Events/Events'


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
                .use(appUserguardPlugin)
                .use(getraces)
                .use(appgetOrgPlugin)
                
    )