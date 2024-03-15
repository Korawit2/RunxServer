import { PrismaClient } from '@prisma/client'
import { calculateScore } from '../../function/calculate'
const db = new PrismaClient()
import * as interface_ from "../../interface";

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

export const getUserByemail = async (userid :string) =>{
    try {
        const queryUser = await db.userRunX.findUnique({
            where: {
                email: userid
                
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

export const raceResult = async (id: string, query: any) =>{
    try {
        const user: any = await db.userRunX.findUnique({
            where: {
                id: parseInt(id) 
            },
            select:{
                firstname_eng: true,
                lastname_eng: true,
                nationality: true
            }}
        )
        if (user.nationality != null) {
                const race: any = await db.races.findMany({
                    include:{
                        Race_result: {
                            where:{
                                firstname: user?.firstname_eng,
                                lastname: user?.lastname_eng,
                                nationality: user?.nationality
                            }
                        }
                    },
                    where:{
                        Race_result:{
                            some:{
                                firstname: user?.firstname_eng,
                                lastname: user?.lastname_eng,
                                nationality: user?.nationality
                            }
                        }
                    },
                    orderBy: {
                        date: query.sortBy,
                    },
                    ...(query.limit != null && {
                        take: parseInt(query.limit)
                    })
                })

                if (race.length) {
                    var result: any = []
                    for (let i = 0; i < race.length; i++) {
                        const AllRaceresultId : any = await db.race_result.aggregate({
                            _count: {
                                Races_id: true,
                            },
                            where: {
                                Races_id: race[i].Race_result[0].Races_id
                            }
                        })
                        const score: any = await calculateScore(race[i].Race_result[0].rank)
                        const resultWithScore = await detailasync(race[i], score, AllRaceresultId._count.Races_id)
                        result.push(resultWithScore)   
                    }
                    return result
                }
                return {
                    message: "Race result is empty"
                }
        }
        return {
            message: "User must Edit nationality"
        }
    } catch (error) {
        console.log('error',error)
        return {
            message : "Error"
        }
    } 
}


export const getAllUser = () =>{
    try {
        const query = db.userRunX.findMany()
        return query
    } catch (error) {
        console.log('error',error)
        return []
    } 
}

export const updateUserOption = async (userBody: any, userEmail: { email: string}) =>{
    try {   
        
        const updateUser = await db.userRunX.update({
            where: {
                email: userEmail.email
            },
            data: {
                ...userBody
            },
        }) 
        return { status: 'ok'}
    } catch (error) {
        console.log('error',error)
        return { status: "fail"}
    } 
}

export const updateUser = async (userBody: any,  userEmail: { email: string}) =>{
    try {   
        const updateUser: any = await db.userRunX.update({
            where: {
                email: userEmail.email
            },
            data: {
                birth_date: new Date(userBody.birth_date),
                gender: userBody.gender,
                id_passport: userBody.id_passport,
                nationality: userBody.nationality,
            },
        }) 
        return { status: 'ok'}
    } catch (error) {
        console.log('error',error)
        return { status: "fail"}
    } 
}


export const claimPoint = async (query: {resultId: any, runxId: any}, profile: {email: string}) =>{
    try {   
        const checkEmailAndId : any = await db.userRunX.aggregate({
            _count: {
                email: true,
            },
            where: {
                email: profile.email,
                id: parseInt(query.runxId) 
            }
        })
        if (checkEmailAndId._count.email > 0) {
            const checkresult = await db.race_result.findUnique({
                where:{
                    id: parseInt(query.resultId)
                }
            }) 
            const user = await db.userRunX.findUnique({
                where:{
                    id: parseInt(query.runxId)
                },
                select:{
                    firstname_eng:true,
                    lastname_eng:true,
                    nationality:true
                }
            }) 
            if (checkresult?.firstname === user?.firstname_eng && checkresult?.lastname === user?.lastname_eng
                && checkresult?.nationality === user?.nationality) {
                const claimed = await db.race_result.update({
                    where: {
                        id: parseInt(query.resultId)
                    },
                    data: {
                        runx_id: parseInt(query.runxId),
                        time_stamp: new Date(),
                        claim_status : true
                    }
                })
                return {
                    status: true,
                    claimed
                }
            }
            return {
                status: false
            }
        }
        return {
            status: false
        }
    } catch (error) {
        console.log('error',error)
        return { status: "fail"}
    } 
}


export const totalPoint = async (runxId: number, checkTotalPoint?: boolean) =>{
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




const detailasync =  async (race: any, score: number, allrace: number) =>{
    return {
        ResultId: race.Race_result[0].id,
        Races_id: race.id,
        logoImg: race.logo_img,
        date: race.date,
        name: race.name,
        distance: `${race.distance}KM`,
        rank: `${race.Race_result[0].rank}/${allrace}`,
        time: race.Race_result[0].time,
        claim_status: race.Race_result[0].claim_status,
        score : score.toFixed(0)
    }
}








