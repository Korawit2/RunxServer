import { Elysia, t } from "elysia";
import { PrismaClient } from '@prisma/client'
import { autoroutes } from "elysia-autoroutes";
import { getAllUser,  createUser, duplecateUser, checkUser, updateUser, updateUserOption, getIdUser} from "./model";
import { jwt } from '@elysiajs/jwt'
import { cookie } from '@elysiajs/cookie'
import { cors } from "@elysiajs/cors";
import { isNotEmpty } from "elysia/dist/handler";
const prisma = new PrismaClient()

const app = new Elysia()

.get("/all", () => getAllUser())


/////////////////////////////////////////////////sing up//////////////////////////////
.post("/signup", async ({body, set}) => {
  const userBody: any = body
  const isEmailExit = prisma.userRunX.findUnique({
    where: {email: userBody.email}
  })
  if (!isEmailExit) {
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
.use(cookie())

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
    setCookie('authToken', await jwt.sign({
      email: userData.email
    }), {
      httpOnly: true,
      maxAge: 7 * 86400,
    })

    return {
      status: true,
      token: cookie.authToken,
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

.post("/edit/user/:id", async ({body, set, params})=> {
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
    if (editOption) {
      const res = await updateUserOption(Editdata, parseInt(params.id))
    }
    const res = await updateUser(userBody, parseInt(params.id))
      if (res.status == "ok") {
        const user = await getIdUser(parseInt(params.id))
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
    email: t.Optional(t.String())
  })
})





.listen(3000);


console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);


