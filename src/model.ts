
import { Elysia, t } from "elysia";
import { PrismaClient } from '@prisma/client'

interface ObjectSort {
    [key: string]: string | number | object;
}

const prisma = new PrismaClient()

export const getAllUser = () =>{
    try {
        const query = prisma.userRunX.findMany()
        return query
    } catch (error) {
        console.log('error',error)
        return []
    } 
}

export const getIdUser = async (id :number) =>{
    try {
        const query = await prisma.userRunX.findUnique({
            where: {id: Number(id)}
        })
        return query
        
    } catch (error) {
        console.log('error',error)
        return []
    } 
}
/////////////////////////////////////////////////////////////////////////////////////////////////

export const checkUser = async (user: any) =>{
    try {
        const email: string = user.userData.email
        
        const query = await prisma.userRunX.findUnique({
            where: {
                email: email
            }
        })
        const passUser: any = query?.password
        if (!passUser) {
            throw new Error('User not found')            
        }
        const isMatch = await Bun.password.verify(user.userData.password, passUser);
        if (!isMatch) {
            return {message :'login fail'}           
        }
        return {
            loggedIn: true,
            query
        }
    } catch (error) {
        console.log('error',error)
        return {
            loggedIn: false
        }
    } 
}
/////////////////////////////////////////////////////////////////////////////////////////////////
export const checkemail = async (user: any) =>{
    try {
        const email: string = user.email
        
        const query = await prisma.userRunX.findUnique({
            where: {
                email: email
            }
        })
        if (query != null) {
            return {
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

export const editPassword = async (body: any) =>{
    try {
        const updateUser = await prisma.userRunX.update({
            where: {
                email: body.email
            },
            data: {
                password: body.password
            },
        })
        return {
            status: true
        } 
    } catch (error) {
        console.log('error',error)
        return {
            status: false
        }
    } 

}



///////////////////////////////////////////////////singup///////////////////////////////////////////////////
export const duplecateUser = async (email: any) =>{
    try {
        const query = await prisma.userRunX.findUnique({
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
        const users = await prisma.userRunX.create({
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
///////////////////////////////////////////////////singup///////////////////////////////////////////////////


//////////////////////////////////////////updateUser//////////////////////////////////////////////
export const updateUser = async (userBody: any, userId: number) =>{
    try {   
        const updateUser = await prisma.userRunX.update({
            where: {
                id: userId
            },
            data: {
                firstname_thai: userBody.firstname_thai,
                lastname_thai: userBody.lastname_thai,
                birth_date: userBody.birth_date,
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
export const updateUserOption = async (userBody: any, userId: number) =>{
    try {   
        
        const updateUser = await prisma.userRunX.update({
            where: {
                id: userId
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
////////////////////////////////////////////updateUser////////////////////////////////////////////////

