import { PrismaClient } from '@prisma/client'
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
                    //console.log(event)
                    if ( parseInt(reacesResult[i].rank)  <= 500) {
                        var score: number = 1000/Math.log2(parseInt(reacesResult[i].rank)  + 1)
                        reacesResult[i].rank = `${reacesResult[i].rank}/${AllRaceresultId._count.Races_id}`
                        const resultWithScore = await detailasync(reacesResult[i], event, score)
                        result.push(resultWithScore)
                    }
                    if ( 500 < parseInt(reacesResult[i].rank)  && parseInt(reacesResult[i].rank)  <= 1000 ) {
                        reacesResult[i].rank = `${reacesResult[i].rank}/${AllRaceresultId._count.Races_id}`
                        const resultWithScore = await detailasync(reacesResult[i], event, 100)
                        result.push(resultWithScore)
                        
                    }
                    if (parseInt(reacesResult[i].rank)  > 1000) {
                        reacesResult[i].rank = `${reacesResult[i].rank}/${AllRaceresultId._count.Races_id}`
                        const resultWithScore = await detailasync(reacesResult[i], event, 50)
                        result.push(resultWithScore)
                        result.push(resultWithScore)
                        
                    }
                }
                return {
                    queryUser,
                    reacesResult: result,
                }
            } else {
                return {
                    queryUser,
                    reacesResult: "You have no races result",
                }
            }
        }
        return {
            queryUser,
            reacesResult: "user must edit nationality",
        }
        
    } catch (error) {
        console.log('error',error)
        return []
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


export const claimPoint = async (params: {resultId: any, runxId: any}, profile: {email: string}) =>{
    try {   
        console.log(params)
        const checkEmailAndId : any = await db.userRunX.aggregate({
            _count: {
                email: true,
            },
            where: {
                email: profile.email,
                id: parseInt(params.runxId) 
            }
        })
        console.log(checkEmailAndId)
        if (checkEmailAndId._count.email > 0) {
            const query = db.userRunX.findMany()
            // const claimed = db.race_result.update({
            //     where: {
            //         id: parseInt(params.resultId)
            //     },
            //     data: {
            //         runx_id: parseInt(params.runxId),
            //         time_stamp: new Date(),
            //         claim_status : true
            //     },
            // })
            console.log(query)
            return {
                status: true,
               // claimed
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
                if (parseInt(reacesResult[i].rank)  <= 500) {
                    var score: number = 1000/Math.log2(parseInt(reacesResult[i].rank)  + 1)
                    totalPoint = totalPoint + score
                    
                }
                if (500 < parseInt(reacesResult[i].rank)  && parseInt(reacesResult[i].rank)  <= 1000) {
                    totalPoint = totalPoint + 100
                    
                }
                if (parseInt(reacesResult[i].rank)  > 1000) {
                    totalPoint = totalPoint + 50
                    
                }

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


const detailasync =  async (race: any, event: any, score: number) =>{
    console.log()
    return {
        ResultId: race.id,
        Races_id: race.Races_id,
        date: event[0].date,
        name: event[0].name,
        distance: `${event[0].distance}KM`,
        rank: race.rank,
        time: race.time,
        claim_status: race.claim_status,
        score : score.toFixed(0)
        
    }
}





