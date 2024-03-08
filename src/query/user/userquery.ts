import { PrismaClient } from '@prisma/client'
import  postmark  from "postmark"
import { calculateScore } from '../../function/calculate'
const db = new PrismaClient()


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

export const checkemail = async (email: string) =>{
    try {
        
        const query = await db.userRunX.findUnique({
            where: {
                email: email
            },
            select:{
                firstname_eng:true
            }
        })
        if (query != null) {
            return {
                query,
                isuser: true
            }
        }
        return {
            isuser: false
        }
    } catch (error) {
        console.log('error',error)
        return {
            isuser: false
        }
    } 
}

export const duplecateUser = async (email: any) =>{
    try {
        const query = await db.userRunX.findUnique({
            where: {
                email: email
            }
        })
        return query
        
    } catch (error) {
        return "error"
    } 
}

export const createUser = async (user: any) =>{
    try {
        const users = await db.userRunX.create({
            data: {
                firstname_eng: user.firstname,
                lastname_eng: user.lastname,
                email: user.email,
                password: user.password,
                policy: user.policy_agreement
            }
        })
        return { status: 'ok'}
    } catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    } 
}

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

export const changepassword = async (user: any, email:any) =>{
    try {
        if (user.password === user.confirmpassword) {
            const isEmailExit = await checkemail(email)
            if (isEmailExit.isuser) {
                user.password = await Bun.password.hash(user.password, {
                    algorithm: 'bcrypt',
                    cost: 10,
                })
                const updateUser: any = await db.userRunX.update({
                    where: {
                        email: email
                    },
                    data: {
                        password: user.password
                    },
                }) 
                // var client = new postmark.ServerClient(`${process.env.POSTMARK_TOKEN}`);
                // client.sendEmailWithTemplate({
                //     "From": "6322771930@g.siit.tu.ac.th",
                //     "To": "6322772953@g.siit.tu.ac.th",
                //     "TemplateAlias": "password-reset-1",
                //     "TemplateModel": {
                //     "product_name": "Runx",
                //     "name": isEmailExit.query?.firstname_eng,
                //     "action_url": "https://www.youtube.com/watch?v=btNmeVPdsT8",
                //     "company_name": "Runx",
                //     "company_address": "สวรรค์ชั้น 7",
                //     }
                // });
                return {
                    message: "change password complete"
                }
            }
        }
        return {
            message: "confirmpassword not same"
        }

        
    } catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    } 
}

export const getrankrunx = async () =>{
    try {
        const user = await db.userRunX.findMany({
            select:{
                id:true,
                firstname_eng:true,
                lastname_eng:true,
                gender:true,
            }
        })
        var rankuser = []
        for (let i = 0; i < user.length; i++) {
            const userrace = await db.race_result.findMany({
                where:{
                    runx_id: user[i].id
                }
            })
            var totalscore: number = 0
            if (userrace.length > 0) {
                for (let i = 0; i < userrace.length; i++) {
                    const score: any = await calculateScore(userrace[i].rank)
                    totalscore = totalscore + score
                }
            }
            const resultWithScore = await RaceResults(user[i], totalscore)
            rankuser.push(resultWithScore)
            
            
        }
        rankuser.sort((a, b) => {
            return a.totalscore - b.totalscore;
        });
        rankuser.reverse();
        return rankuser
    }  
    catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    } 
}

const RaceResults = async (user: any, totalscore: number ) =>{
    return{
        name: user.firstname_eng +" "+ user.lastname_eng,
        totalscore: totalscore,
        gender: user.gender
    }
}
