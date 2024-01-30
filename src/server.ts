import { Elysia, t } from "elysia";
import { PrismaClient } from '@prisma/client'
import {  createOrg, getAllOrg, createEvent, createRace} from "./model";
import { cors } from "@elysiajs/cors";
import { swagger } from '@elysiajs/swagger'
import { appPlugin } from './api/user/user'
import { appUserDuardPlugin } from './api/user/guardUser'
import { appUpload } from './api/races/upload'
import { appOrgPlugin } from './api/org_Events/Organization'
import { appEventPlugin } from './api/org_Events/Events'
import { appRacesPlugin } from './api/races/races'

const db = new PrismaClient()
const app = new Elysia()



.use(cors({
  credentials: true,
}))

.derive(async ({jwt,  headers}) => {
  const auth = headers.authorization
  if(auth) {
    //const convert = auth.startsWith('Bearer ') ? auth.slice(7) : null
    const profile = await jwt.verify(auth!)
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
  }
}, (app) =>
          app
          .use(appUserDuardPlugin)
)

.use(appPlugin)
.use(appUpload)
.use(appOrgPlugin)
.use(appEventPlugin)
.use(appRacesPlugin)

.post("/raceresult/:raceid/:userid",({body, set, parames}) =>{
  try {
    const raceBody = body 

  } catch{

  }
},{
  body: t.Object({
    rank: t.Number(),
    points_gained: t.Number(),
    time: t.String(),
    firstname: t.String(),
    lastname: t.String(),
    gender: t.String(),
    age_group: t.String(),
    nationality: t.String()
  })
})

.listen(3000);
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);


