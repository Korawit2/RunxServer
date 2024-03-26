import { Elysia, t } from "elysia";
import { checkUser, checkAdmin } from '../../query/user/querylogin';
import { jwt } from '@elysiajs/jwt'

export const appLoginPlugin = new Elysia()

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
            id: res.id,
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