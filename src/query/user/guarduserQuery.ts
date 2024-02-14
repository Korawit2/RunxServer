import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()
import * as interface_ from "../../interface";

export const getUserByEmail = async (profile :string) =>{
    try {
        const queryUser = await db.userRunX.findUnique({
            where: {
                email: profile
            }
        })
        if (queryUser?.nationality) {
            var reacesResult = await db.race_result.findMany({
                where: {
                    firstname: queryUser?.firstname_eng,
                    lastname: queryUser?.lastname_eng,
                    nationality: queryUser?.nationality
                }
            })
            if (Object.keys(reacesResult).length != 0) {
                var result: any = []
                for (let i = 0; i < reacesResult.length; i++) {
                    const count = await db.race_result.findMany({
                        where: {
                            Races_id: reacesResult[i].Races_id
                        },
                    })
                    if (reacesResult[i].rank <= 500) {
                        var score: number = 1000/Math.log2(reacesResult[i].rank + 1)
                        const resultWithScore = {
                            detail: reacesResult[i],
                            score: score.toFixed(0),
                        };
                        result.push(resultWithScore)
                    }
                    if ( 500 < reacesResult[i].rank && reacesResult[i].rank <= 1000 ) {
                        const resultWithScore = {
                            detail: reacesResult[i],
                            score: 100,
                        };
                        result.push(resultWithScore)
                        
                    }
                    if (reacesResult[i].rank > 1000) {
                        const resultWithScore = {
                            detail: reacesResult[i],
                            score: 50,
                        };
                        result.push(resultWithScore)
                        
                    }
                }
                return {
                    queryUser,
                    reacesResult: result,
                }
            } else {
                return {
                    user: queryUser,
                    reacesResult: "You have no races result",
                }
            }
        }
        return {
            user: queryUser,
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

export const updateUserOption = async (userBody: any, userEmail: string) =>{
    try {   
        
        const updateUser = await db.userRunX.update({
            where: {
                email: userEmail
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

export const updateUser = async (userBody: any, userEmail: string) =>{
    try {   
        const updateUser: any = await db.userRunX.update({
            where: {
                email: userEmail.email
            },
            data: {
                firstname_thai: userBody.firstname_thai,
                lastname_thai: userBody.lastname_thai,
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


export const claimPoint = async (params: {resultId: any, runxId: any}) =>{
    try {   
        const claimed = db.race_result.update({
            where: {
                id: parseInt(params.resultId)
            },
            data: {
                runx_id: parseInt( params.runxId),
                time_stamp: new Date(),
                claim_status : true
            },
        })
        return claimed
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
                if (reacesResult[i].rank <= 500) {
                    var score: number = 1000/Math.log2(reacesResult[i].rank + 1)
                    totalPoint = totalPoint + score
                    
                }
                if (500 < reacesResult[i].rank && reacesResult[i].rank <= 1000) {
                    totalPoint = totalPoint + 100
                    
                }
                if (reacesResult[i].rank > 1000) {
                    totalPoint = totalPoint + 50
                    
                }

            }
            const final_total_point  = totalPoint.toFixed(0)
            return final_total_point
        }
    } catch (error) {
        console.log('error',error)
        return { status: "fail"}
    } 
}




