import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()


export const checkUser = async (user: any) =>{
    try {
        const email: string = user.userData.email
        const queryuser = await db.userRunX.findUnique({
            where: {
                email: email
            }
        })
        
        if (queryuser) { ///// check user///////
            const passUser: any = queryuser?.password
            const isMatch = await Bun.password.verify(user.userData.password, passUser);
            if (!isMatch) {
                return {message :'login fail'}           
            }
            
            return {
                id: queryuser.id,
                loggedIn: true,
                role: "user"
            } 
        }
        return {
            loggedIn: false
        } 
    } catch (error) {
        throw new Error('fail')
    } 
}

export const checkAdmin = async (admin: any) =>{
    try {
        const email: string = admin.userData.email
        const queryadmin = await db.admin.findUnique({
            where: {
                email: email
            }
        })
        if (queryadmin) { ////// check admin/////
            const passUser: any = queryadmin?.password
            const isMatch = await Bun.password.verify(admin.userData.password, passUser);
            if (!isMatch) {
                return {message :'login fail'}           
            }
            
            return {
                loggedIn: true,
                role: "admin"
            } 
        }
        return {
            loggedIn: false
        } 
    }  catch (error) {
        throw new Error('fail')
    }
}