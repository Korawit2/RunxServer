import { Elysia, t } from "elysia";
import { PrismaClient } from '@prisma/client'
import {  createOrg, getAllOrg, createEvent, createRace} from "./model";
import { cors } from "@elysiajs/cors";
import { swagger } from '@elysiajs/swagger'
import { appPlugin } from './api/user/user'
import { appUserDuardPlugin } from './api/user/guardUser'
import { appUpload } from './api/races/upload'

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


.get("/org", () => getAllOrg())

.post("/org", async ({body, set})=> {
  const orgBody = body
  try {
    const res = await createOrg(orgBody)
    if (res.status == "ok") {
      return {
        message: "insert complete",
        orgBody
      }
    }
    return {
      message: "insert fail",
      orgBody
    }
    
  } catch (error) {
    set.status = 500
    return {
        message: 'error',
        error        
    }
  }
},{
  body: t.Object({
    name: t.String()
  })
})

.get("/events", () => {
  return db.events.findMany({
    include: {
      Races: true,
    },
}
  )
})
.post("/events", async ({body, set})=> {
  const eventBody = body
  try {
    const eventBody = body
    const res = await createEvent(body)
    if (!res) {
      return { message: "insert fail"}
    }
    return { message: "insert complete "}
  } catch (error) {
    set.status = 500
    return {
        message: 'error',
        error        
    }
  }
},{
  body: t.Object({
    name: t.String(),
    location: t.String()
  })
})

.get("/races", () => {
  return db.race_result.findMany()
})
.post("/race/:org/:event", async ({body, set, params})=>{
  try {
    const race = body
    const res = await createRace(race, params)
    if (res) {
      return { 
        message: "insert race complete",
        data: body
      }
    }
    return { 
      message: "insert race fail",
      data: body
    }
  }  catch (error) {
    set.status = 500
    return {
        message: 'error',
        error        
    }
  }
},{
  body: t.Object({
    name: t.String(),
    date: t.String(),
    start_time: t.String(),
    max_point: t.Number(),
    distance: t.Number()
  })
})

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


