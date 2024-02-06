import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()


export const getAllOrg = () =>{
    try {
        const query = db.organization.findMany()
        return query
    } catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    } 
}

export const createOrg = async (org: any) =>{
    try {
        const orgName: string = org.name
        const isOrgExit = await db.organization.findUnique({
            where: {
                name: org.name
            }
        })
        if (isOrgExit == null) {
            const users = await db.organization.create({
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