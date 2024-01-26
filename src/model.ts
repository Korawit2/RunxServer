
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
export const checkemail = async (email: string) =>{
    try {
        
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
export const updateUser = async (userBody: any, userEmail: string) =>{
    try {   
        const updateUser = await prisma.userRunX.update({
            where: {
                email: userEmail
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
export const updateUserOption = async (userBody: any, userEmail: string) =>{
    try {   
        
        const updateUser = await prisma.userRunX.update({
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
////////////////////////////////////////////updateUser////////////////////////////////////////////////

export const createOrg = async (org: any) =>{
    try {
        const orgName: string = org.name
        const isOrgExit = await prisma.organization.findUnique({
            where: {
                name: org.name
            }
        })
        if (isOrgExit == null) {
            const users = await prisma.organization.create({
                data: {
                    name: org.name
                }
            })
            return { status: 'ok'}
        }
        return { status: 'org exit'}
        
    } catch (error) {
        console.log('error',error)
        return { status: "fail"}
    } 
}

export const getAllOrg = () =>{
    try {
        const query = prisma.organization.findMany()
        return query
    } catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    } 
}

export const createEvent = async (events: any) =>{
    try {
        const title: string = events.name
        const query = await prisma.events.findUnique({
            where: {
                name: title
            }
        })
        if (query) {
            return false
        }
        const users = await prisma.events.create({
            data: {
                name: title,
                location: events.location
            
            }
        })
        return true
    } catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    } 
}


export const createRace = async (race: any, params: any) =>{
    try {
        const title: string = race.name
        const query = await prisma.races.findUnique({
            where: {
                name: title
            }
        })
        if (query) {
            return false
        }
        const users = await prisma.races.create({
            data: {
                org_id: parseInt(params.org) ,
                event_id: parseInt(params.event) ,
                name: race.name,
                date: new Date(race.date),
                start_time: race.start_time,
                max_point: race.max_point,
                distance: race.distance

            
            }
        })
        return true
    } catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    } 
}
