import { Elysia, t } from "elysia";
import { PrismaClient } from '@prisma/client'
import { uploadURI } from "./model";
import { cors } from "@elysiajs/cors";
import { swagger } from '@elysiajs/swagger'
import { appPlugin } from './api/user/user'
import { appUserguardPlugin } from './api/user/guardUser'
import { appUpload } from './api/races/upload'
import { appPostOrgPlugin, appgetOrgPlugin } from './api/org_Events/Organization'
import { appEventPlugin, appgetEventPlugin, appgetfillterEventPlugin } from './api/org_Events/Events'
import { appRacesPlugin, getraces } from './api/races/races'



const db = new PrismaClient()
const app = new Elysia()
  
  .use(cors({
    credentials: true,
  }))
  .derive(async ({jwt,  headers}) => {
    const auth = headers.authorization
    if(auth) {
      //const convert = auth.startsWith('Bearer ') ? auth.slice(7) : null
      const profile = await jwt.verify(auth!) //jwt.verify(convert!)
      console.log(profile)
      return { profile }
    } else {
    return false
    }
  })
  .get("/", () => "server Runx is running ")
  .use(swagger())
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
              .use(appgetEventPlugin)
    )
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
            .use(appPostOrgPlugin)
            .use(appEventPlugin)
            .use(appRacesPlugin)
            .use(getraces)
            .use(appgetOrgPlugin)
            .use(appgetEventPlugin)
  )
  .use(appPlugin)
  .use(appgetfillterEventPlugin)
  .get("/uploadImg", async ({set}) =>{
    try {
      const extFile = "jpg";
      const filename = crypto.randomUUID();
      const bucket = 's.dev.runx.run'
      const params = {filename, bucket,  extFile}
      const uploadUri = await uploadURI(params)
      const downloadUri = `https://storage.googleapis.com/${bucket}/images/users/profile/${filename}.${extFile}`
      return {
        uploadUri: uploadUri,
        downloadUri: downloadUri
      }
    } catch (error) {
        set.status = 500
        return {
            message: "Edit fail"     
        }
    }
  })
  .listen(3000);
  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );


