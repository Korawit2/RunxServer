import { Elysia, t } from "elysia";
import { PrismaClient } from '@prisma/client'
import { jwt } from '@elysiajs/jwt'
import {checkemail,  duplecateUser, createUser, checkUser } from '../../model';


const db = new PrismaClient()


export const appPlugin = new Elysia()
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
        userr: { 
            "userid": res.query?.id,
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