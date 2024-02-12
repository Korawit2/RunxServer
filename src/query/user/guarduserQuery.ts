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
                for (let i = 0; i < reacesResult.length; i++) {
                    const count = await db.race_result.findMany({
                        where: {
                            Races_id: reacesResult[i].Races_id
                        },
                    })
                    const range: number = count.length/3
                    range.toFixed(0)
                    if (reacesResult[0].rank < range) {
                        const resultWithScore: any = {
                            detail: reacesResult,
                            score: 3,
                        };
                        return {
                            user: queryUser,
                            reacesResult: resultWithScore,
                        }
                    }
                    const range2 : number =  count.length - range
                    range2.toFixed(0)
                    if (range <= reacesResult[0].rank && reacesResult[0].rank <= range2) {
                        const resultWithScore: any = {
                            detail: reacesResult,
                            score: 2,
                        };
                        return {
                            user: queryUser,
                            reacesResult: resultWithScore,
                        }
                    }
                    if (reacesResult[0].rank >= range2 && reacesResult[0].rank <= count.length) {
                        const resultWithScore: any = {
                            detail: reacesResult,
                            score: 1,
                        };
                        return {
                            user: queryUser,
                            reacesResult: resultWithScore,
                        }
                    }
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
        const updateUser = await db.userRunX.update({
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
                time_stamp: new Date()
            },
        })
        return claimed
    } catch (error) {
        console.log('error',error)
        return { status: "fail"}
    } 
}

