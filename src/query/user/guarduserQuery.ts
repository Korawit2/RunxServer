import { PrismaClient } from '@prisma/client'
import { calculateScore } from '../../function/calculate'
const db = new PrismaClient()
import * as interface_ from "../../interface";

export const getUserByEmail = async (profile :string) =>{
    try {
        const queryUser = await db.userRunX.findUnique({
            where: {
                email: profile
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

export const raceResult = async (profile: string) =>{
    try {
        const queryUser = await db.userRunX.findUnique({
            where: {
                email: profile
            },
            select:{
                firstname_eng: true,
                lastname_eng: true,
                nationality: true,
                
            }
        })
        if (queryUser?.nationality) {
            var reacesResult = await db.race_result.findMany({
                where: {
                    firstname: queryUser?.firstname_eng,
                    lastname: queryUser?.lastname_eng,
                    nationality: queryUser?.nationality
                },
                select: {
                    id: true,
                    Races_id: true,
                    rank: true,
                    time: true,
                    claim_status: true
                }
            })
            if (Object.keys(reacesResult).length != 0) {
                var result: any = []
                for (let i = 0; i < reacesResult.length; i++) {
                    const AllRaceresultId : any = await db.race_result.aggregate({
                        _count: {
                            Races_id: true,
                        },
                        where: {
                            Races_id: reacesResult[i].Races_id
                        }
                    })
                    
                    const event: any = await db.races.findMany({
                        where: {
                            Race_result: {
                                some:{
                                    Races_id: reacesResult[i].Races_id
                                }
                            }
                        },
                        select:{
                            date: true,
                            name: true,
                            distance: true
                        }
                    })
                    const score: any = await calculateScore(reacesResult[i].rank)
                    const resultWithScore = await detailasync(reacesResult[i], event, score, AllRaceresultId._count.Races_id)
                    result.push(resultWithScore)
                }
                return {
                    
                    reacesResult: result,
                }
            } else {
                return {
                    reacesResult: "You have no races result",
                }
            }
        }
        return {
            reacesResult: "user must edit nationality",
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
            const claimed = await db.race_result.update({
                where: {
                    id: parseInt(query.resultId)
                },
                data: {
                    runx_id: parseInt(query.runxId),
                    time_stamp: new Date(),
                    claim_status : true
                },
            })
            
            return {
                status: true,
                claimed
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

export const getrace = async (email: string) =>{
    try {
        const user: any = await db.userRunX.findUnique({
            where: {
                email: email
            },
            select:{
                firstname_eng: true,
                lastname_eng: true,
                nationality: true
            }}
        )
        if (user.nationality != null) {
            const result: any = await db.race_result.findFirst({
                where:{
                    firstname: user?.firstname_eng,
                    lastname: user?.lastname_eng,
                    nationality: user?.nationality
                },
                select:{
                    Races_id: true,
                    time: true,
                    rank: true
                }
            })
            if (result) {
                const latestrace: any = await db.races.findMany({
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
                        date: 'desc',
                    },
                    select:{
                        date:true,
                        name: true,
                        distance:true,
                    },
                    take: 1
                })
                const AllRaceresultId : any = await db.race_result.aggregate({
                    _count: {
                        Races_id: true,
                    },
                    where: {
                        Races_id: result.Races_id
                    }
                })
                const score = await calculateScore(result.rank)
                const date = await getdate(latestrace[0].date)
                const resulted = await LatestRaceResults(latestrace, result,  AllRaceresultId._count.Races_id, score, date)
                return resulted
            }
            return {
                message: "You have no race result"
            }
        }
        return {
            message: "You have to edit Nationality"
        }
    } catch (error) {
        console.log('error',error)
        return { status: "fail"}
    } 
}


const LatestRaceResults = async (latestrace: any, result: any, allrace: number,  score:any , date: any) =>{
    return{
        date: date,
        name: latestrace[0].name,
        distance: `${latestrace[0].distance}KM`,
        point: score,
        time: result.time,
        rank: `${result.rank}/${allrace}`
    }
}


const detailasync =  async (race: any, event: any, score: number, allrace: number) =>{
    return {
        ResultId: race.id,
        Races_id: race.Races_id,
        date: event[0].date,
        name: event[0].name,
        distance: `${event[0].distance}KM`,
        rank: `${race.rank}/${allrace}`,
        time: race.time,
        claim_status: race.claim_status,
        score : score.toFixed(0)
        
    }
}

const getdate = async (date: any) =>{
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const d = new Date(date);
    let year = d.getFullYear();
    let month = months[d.getMonth()];
    let day = d.getDate();
    return `${day} ${month} ${year}`
}







