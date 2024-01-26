import { Elysia, t } from "elysia";
import { PrismaClient } from '@prisma/client'
import { autoroutes } from "elysia-autoroutes";
import { getAllUser,  createUser, duplecateUser, checkUser, updateUser, updateUserOption, getUserByEmail, checkemail, createOrg
        ,getAllOrg, createEvent, createRace} from "./model";
import { jwt } from '@elysiajs/jwt'
import { cookie } from '@elysiajs/cookie'
import { cors } from "@elysiajs/cors";
import { isNotEmpty } from "elysia/dist/handler";
import { create } from "domain";
const prisma = new PrismaClient()

const app = new Elysia()



.use(cors({
  credentials: true,
}))

.derive(async ({jwt, cookie, headers}) => {
  const auth = headers.authorization
  if(auth) {
    const convert = auth.startsWith('Bearer ') ? auth.slice(7) : null
    const profile = await jwt.verify(convert!)
    return { profile }
  } else {
  return false
  }
  
})

.get("/", () => "server Runx is running ")

.guard({
  beforeHandle: ({set,profile}) =>{
    if (!profile) {
      set.status = 401
      return 'Unauthorized'
    }
  }
}, (app) =>
          app
            .get("/curentuser", ({profile}) => {
              getUserByEmail(profile)
              /// pull score 
            })

            .post("/edit/user/:id", async ({body, set, profile})=> {
              interface ObjectSort {
                [key: string]: string | number | object;
              }
              try {
                const userBody = body
                const Editdata: ObjectSort = {};
                var editOption: boolean = false
                if (userBody.firstname_eng) {
                  Editdata["firstname_eng"] = userBody.firstname_eng
                  editOption = true
                }
                if (userBody.lastname_eng) {
                  Editdata["lastname_eng"] = userBody.lastname_eng
                  editOption = true
                }
                if (userBody.email) {
                  Editdata["email"] = userBody.email
                  editOption = true
                }
                if (userBody.email) {
                  Editdata["user_img"] = userBody.user_img
                  editOption = true
                }
                if (editOption) {
                  const res = await updateUserOption(Editdata, profile)
                }
                const res = await updateUser(userBody, profile)
                  if (res.status == "ok") {
                    const user = await getIdUser(profile)
                    return {
                      message: "Edit successful",
                      user: user
                    }
                  }
              } catch (error) {
                set.status = 500
                return {
                    message: "Edit fail"     
                }
              }
              
            },{
              body: t.Object({
                firstname_eng: t.Optional(t.String()),
                lastname_eng: t.Optional(t.String()),
                firstname_thai: t.String(),
                lastname_thai: t.String(),
                birth_date: t.String(),
                gender: t.String(),
                id_passport: t.String(),
                nationality: t.String(),
                email: t.Optional(t.String()),
                user_img: t.Optional(t.String())
              })
            })
)
.get("/all", () => getAllUser())
/////////////////////////////////////////////////sing up//////////////////////////////
.post("/signup", async ({body, set}) => {
  const userBody: any = body
  const isEmailExit = await checkemail(userBody.email)
  if (!isEmailExit.isuser) {
    userBody.password = await Bun.password.hash(userBody.password, {
      algorithm: 'bcrypt',
      cost: 10,
    })
    const alreadyUser = await duplecateUser(userBody.email)
    if (!alreadyUser) {
      const res = await createUser({
        firstname: userBody.firstname,
        lastname: userBody.lastname,
        email: userBody.email,
        password: userBody.password,
        con_password: userBody.confirmpassword,
        policy_agreement: userBody.policy_agreement
      })
      if (res.status === 'error') {
        set.status = 400
        return {
          message: 'insert incomplete'
        }
      }
      return { message: 'ok'}
    }
    return { message: "This email already exit"}
  }
  return {
    message: 'Email is already exit'
  }
  
},{
  body: t.Object({
    firstname: t.String(),
    lastname: t.String(),
    email: t.String(),
    password: t.String(),
    confirmpassword: t.String(),
    policy_agreement: t.Boolean()
  }),
})
/////////////////////////////////////////////////sing in/////////////////////////////////////////////////

///////////////////////////////////////////////////login//////////////////////////////////////////////////////

.use(
  jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET as string
  })
)


.post("/login", async ({body, set, jwt, cookie, setCookie}) => {
  try {
    const userData: any = body
    const res = await checkUser({userData})
    if (!res.loggedIn) {
      set.status = 500
      return {
        status: false,
      }
    }
    const token = await jwt.sign({
      email: userData.email
    })

    return {
      status: true,
      token: token,
      userr: { "userid": res.query?.id,
                "firstname": res.query?.firstname_eng
      }
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
    email: t.String(),
    password: t.String(),
  })
})

//////////////////////////////////////////////////////login///////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////
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
  return prisma.events.findMany({
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
  return prisma.races.findMany()
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

// .delete("/del/:id", ({params}) => {
//   return prisma.userRunX.delete({
//     where: {id: Number(params.id)}
//   })
// })
//////////////////////////////////////////////////////////////////////////////
.listen(3000);


console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);


