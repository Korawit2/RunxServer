import { Elysia, t } from "elysia";
import { PrismaClient } from '@prisma/client'
import { getraces } from "./api/races/races";
import { cors } from "@elysiajs/cors";
import { swagger } from '@elysiajs/swagger'
import { appgetEventPlugin, appgetfillterEventPlugin } from './api/org_Events/Events'
import { appUser } from "./server/serverUser";
import { appAdmin } from "./server/serverAdmin";
import { resetpassword } from "./api/user/users";
import { appUsers } from "./api/user/users";
import { appRunnerPlugin } from "./api/runner/runners"
import { appSingupPlugin } from './api/user/singup'
import { appLoginPlugin } from './api/user/login'


const app = new Elysia()
  
  .use(cors({
    credentials: true,
  }))
  .derive(async ({jwt,  headers}) => {
    const auth = headers.authorization ///////authorization
    if(auth) {
      const convert = auth.startsWith('Bearer ') ? auth.slice(7) : null
      const profile = await jwt.verify(convert!) //jwt.verify(convert!)
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
  .use(resetpassword)
  .use(appSingupPlugin)
  .use(appLoginPlugin)
  .use(appUsers)
  .use(appRunnerPlugin)
  .use(getraces)
  .use(appgetEventPlugin)
  .use(appgetfillterEventPlugin)
  
  .listen(3000);
  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );

  //       Object.keys(reacesResult).length


