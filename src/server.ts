import { Elysia, t } from "elysia";
import { PrismaClient } from '@prisma/client'
import { appuploadImg } from "./api/user/uploadimg";
import { cors } from "@elysiajs/cors";
import { swagger } from '@elysiajs/swagger'
import { appPlugin } from './api/user/user'
import { appgetEventPlugin, appgetfillterEventPlugin } from './api/org_Events/Events'
import { appUser } from "./server/serverUser";
import { appAdmin } from "./server/serverAdmin";




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
      //console.log(profile)
      return { profile }
    } else {
    return false
    }
  })
  .get("/", () => "server Runx is running ")
  .use(swagger())
  
  .use(appUser)
  .use(appAdmin)

  .use(appgetEventPlugin)
  .use(appPlugin)
  .use(appgetfillterEventPlugin)
  .use(appuploadImg)
  .listen(3000);
  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );

  //console.log(Object.keys(reacesResult).length)


