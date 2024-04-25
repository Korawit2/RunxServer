import { PrismaClient } from '@prisma/client'
import { checkemail } from '../../query/user/querysingup';
import { calculateScore } from '../../function/calculate'
import { time } from 'console';
const db = new PrismaClient()



export const changepassword = async (user: any, email:any) =>{
    try {
        
        if (user.password === user.confirmpassword) {
            const isEmailExit = await checkemail(email.email)
            if (isEmailExit.isuser) {
                if ( email.role === "user" ) {
                    const passUser: any = isEmailExit.query?.password
                    const isMatch = await Bun.password.verify(user.currentpassword, passUser);
                    if (!isMatch) {
                        return {
                            message: "currentpassword is not match"
                        }
                    }
                }

            }
            if (email.role === "user" || email.role === "resetpassword") {
                user.password = await Bun.password.hash(user.password, {
                    algorithm: 'bcrypt',
                    cost: 10,
                })
                
                const updateUser: any = await db.userRunX.update({
                    where: {
                        email: email.email
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

export const getrankrunx = async (query: any) =>{
    try {
        var minY: any
        var maxY: any
        if (query !== null) {
            const date = new Date();
            minY = date.getFullYear() - parseInt(query.min) 
            maxY = date.getFullYear() - parseInt(query.max) 
        }
        const user = await db.userRunX.findMany({
            select:{
                id:true,
                firstname_eng:true,
                lastname_eng:true,
                gender:true,
                nationality: true,
                birth_date: true,
                user_img: true
            },
            where:{
                ...(Object.keys(query).length > 0 && {
                    birth_date: {
                        lte: new Date(`${minY}`),
                        gte: new Date(`${maxY}`)
                    }
                }),
                
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
            var time_rece: any = []
            if (userrace.length > 0) {
                for (let i = 0; i < userrace.length; i++) {
                    const score: any = await calculateScore(userrace[i].rank)
                    totalscore = totalscore + score
                    time_rece.push(userrace[i].time)
                }
            }
            const resultWithScore = await RaceResults(user[i], totalscore, time_rece.sort())
            rankuser.push(resultWithScore)
        }
        rankuser.sort((a, b) => {
            return a.totalscore - b.totalscore;
        });

        rankuser.reverse();
        const dataConvert = rankuser.map((item,i) => {
        return {
            id: item.id,
            rank: i + 1,
            name: item.name,
            totalscore: item.totalscore,
            gender: item.gender,
            age: item.age,
            nationality: item.nationality,
            user_img: item.user_img,
            time: item.time
        }
    })
        return dataConvert
    }  
    catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    } 
}

const RaceResults = async (user: any, totalscore: number, race: any) =>{
    var age : any = null
    if (user.birth_date !== null) {
        const date = new Date();
        const dateY = date.getFullYear();
        const d = user.birth_date.getFullYear()
        age = dateY - d
    }
    return{
        id: user.id,
        name: user.firstname_eng +" "+ user.lastname_eng,
        totalscore: totalscore,
        gender: user.gender,
        age: age,
        nationality: user.nationality,
        user_img: user.user_img,
        time: race
        
    }
}

export const getUserByID = async (userid :string) =>{
    try {
        const queryUser = await db.userRunX.findUnique({
            where: {
                id: parseInt(userid)
                
            },
            select:{
                id: true,
                firstname_eng: true,
                lastname_eng: true,
                birth_date: true,
                gender: true,
                email: true,
                id_passport: true,
                nationality: true,
                user_img: true,
            }
        })
        return queryUser
        
        
    } catch (error) {
        console.log('error',error)
        return []
    } 
}

export const totalPoint = async (runxId: number) =>{
    try {   
        var totalPoint: number = 0
        const reacesResult = await db.race_result.findMany({
            where: {
                runx_id: runxId
            },
            select: {
                Races_id: true,
                rank: true
            }
        })
        if (Object.keys(reacesResult).length != 0) {
            
            for (let i = 0; i < reacesResult.length; i++) {
                const score = await calculateScore(reacesResult[i].rank)
                totalPoint = totalPoint + score
            }
            const final_total_point  = totalPoint.toFixed(0)
            return final_total_point
        }
        return totalPoint
    } catch (error) {
        console.log('error',error)
        return { status: "fail"}
    } 
}