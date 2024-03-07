import { Elysia, t } from "elysia";
import { PrismaClient } from '@prisma/client'
import { jwt } from '@elysiajs/jwt'
import { checkemail,  duplecateUser, createUser, checkUser, checkAdmin,changepassword, getrankrunx} from '../../query/user/userquery';
import  postmark  from "postmark"


const db = new PrismaClient()


export const appPlugin = new Elysia()
.post("/users/signup", async ({body, set}) => {
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

.post("/users/login", async ({body, set, jwt}) => {
    try {
        const userData: any = body
        const res: any = await checkUser({userData})
        if (!res.loggedIn) {
            set.status = 500
            return {
            status: false,
            }
        }
        const token = await jwt.sign({
            email: userData.email,
            role: res.role
        })
        return {
            status: true,
            token: token,
            //role: res.role
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

.post("/admins/login", async ({body, set, jwt}) => {
        try {
            const userData: any = body
            const res: any = await checkAdmin({userData})
            if (!res.loggedIn) {
                set.status = 500
                return {
                    status: false,
                }
            }
            const token = await jwt.sign({
                email: userData.email,
                role: res.role
            })
            return {
                status: true,
                token: token,
                //role: res.role
            }
            
        } catch (error) {
            set.status = 500
            return {
                message: 'error',
                error        
        }
    }},{
        body: t.Object({
            email: t.String(),
            password: t.String(),
        })
    })

.post("/users/resetpassword/sendemail", async ({body, set}) =>{
    try {
        const isEmailExit = await checkemail(body.email)
        if (isEmailExit.isuser) {
            var client = new postmark.ServerClient(`${process.env.POSTMARK_TOKEN}`);
            client.sendEmailWithTemplate({
                "From": "6322771930@g.siit.tu.ac.th",
                "To": "6322772953@g.siit.tu.ac.th", //body.email
                "TemplateAlias": "password-reset",
                "TemplateModel": {
                "product_url": "product_url_Value",
                "product_name": "Runx",
                "name": isEmailExit.query?.firstname_eng,
                "action_url": "https://www.youtube.com/watch?v=3iPQhw4e2mc",
                "operating_system": "macOs window",
                "browser_name": "chrome",
                "support_url": "https://www.youtube.com/watch?v=KTRv50n2jxA",
                "company_name": "Runx",
                "company_address": "สวรรค์ชั้น 7"
                }
            });
            return {
                message: 'Link reset password is sented to your email'
            }
        }
        return {
            message: 'email does ont exit'
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
        email: t.String()
    })
})

.post("/users/changepassword", async ({body, set}) =>{
    try {
        const useremail = await changepassword(body)
        return useremail
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
        confirmpassword: t.String()
    })
})

.get("/users/runx/rank", async ({set}) =>{
    try{
        const rank = await getrankrunx()
        return rank
    }
    catch (error) {
        set.status = 500
        return {
            message: 'error',
            error        
        }
    }
})

