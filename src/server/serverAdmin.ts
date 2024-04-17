import { Elysia, t } from "elysia";
import { appUpload } from '../api/races/upload'
import { appPostOrgPlugin, appgetOrgPlugin } from '../api/org_Events/Organization'
import { appEventPlugin } from '../api/org_Events/Events'
import { appRacesPlugin, getraces } from '../api/races/races'
import { appuploadImg } from "../api/user/uploadimg";

export const appAdmin = new Elysia()
.guard({
    beforeHandle: ({set,profile}) =>{
        if (!profile) {
            set.status = 401
            return 'Unauthorized'
        }
        else if (profile.role != "admin") {
            return 'Unauthorized'
        } 
    }
    }, (app) =>
                app
                .use(appUpload)
                .use(appuploadImg)
                .use(appPostOrgPlugin)
                .use(appEventPlugin)
                .use(appRacesPlugin)
                .use(appgetOrgPlugin)
    )