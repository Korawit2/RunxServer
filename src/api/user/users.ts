import { Elysia, t } from "elysia";
import { changepassword, getrankrunx, getUserByID, totalPoint  } from '../../query/user/queryusers';
import { checkemail } from '../../query/user/querysingup';
import  postmark  from "postmark"


export const appUsersPlugin = new Elysia()

.post("/users/changepassword", async ({body, set, profile}) =>{
    try {
        const useremail = await changepassword(body, profile)
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
        currentpassword: t.String(),
        password: t.String(),
        confirmpassword: t.String()
    })
})

export const resetpassword = new Elysia()

.post("/users/resetpassword", async ({body, set, profile}) =>{
    try {
        if (profile) {
            const useremail = await changepassword(body, profile)
            return useremail
        }
        return "Unauthorized"
    } catch (error) {
        set.status = 500
        return {
            message: 'error',
            error        
        }
    }
},{
    body: t.Object({
        password: t.String(),
        confirmpassword: t.String()
    })
})
.post("/users/resetpassword/sendemail", async ({body, set, jwt}) =>{
    try {
        const isEmailExit = await checkemail(body.email)
        if (isEmailExit.isuser) {
            // var client = new postmark.ServerClient(`${process.env.POSTMARK_TOKEN}`);
            // client.sendEmailWithTemplate({
            //     "From": "6322771930@g.siit.tu.ac.th",
            //     "To": "6322772953@g.siit.tu.ac.th", //body.email
            //     "TemplateAlias": "password-reset",
            //     "TemplateModel": {
            //     "product_url": "product_url_Value",
            //     "product_name": "Runx",
            //     "name": isEmailExit.query?.firstname_eng,
            //     "action_url": "https://www.youtube.com/watch?v=3iPQhw4e2mc",
            //     "operating_system": "macOs window",
            //     "browser_name": "chrome",
            //     "support_url": "https://www.youtube.com/watch?v=KTRv50n2jxA",
            //     "company_name": "Runx",
            //     "company_address": "สวรรค์ชั้น 7"
            //     }
            // });
            const token = await jwt.sign({
                email: body.email,
                role: "resetpassword"
            })
            return {
                message: 'Link reset password is sented to your email',
                Token: token
            }
        }
        return {
            message: 'email does not exist'
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

export const appUsers = new Elysia()

.get("/users/runx/rank", async ({query,set}) =>{
    try{
        const rank = await getrankrunx(query)
        return rank
    }
    catch (error) {
        set.status = 500
        return {
            message: 'error',
            error        
        }
    }
},{
    query: t.Object({
        min: t.Optional(t.String()),
        max: t.Optional(t.String()) 
    })
})

.get("/users/Profile/:id", async ({params}) => {
    
    const user: any = await getUserByID(params.id)
    const total_Point: any =  await totalPoint(user.id)
    const resultWithScore: any = {
        totalPoint: total_Point,
        user
        
    };
    return resultWithScore

},{
params: t.Object({
    id: t.String()
})
})




