import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()


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
                return {
                    user: queryUser,
                    reacesResult: reacesResult,
                    
                }
            }
        }
        
        //console.log(Object.keys(reacesResult).length)
        
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