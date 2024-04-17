import { PrismaClient } from '@prisma/client'
import * as interface_ from "../../interface";
const db = new PrismaClient()

export const createEvent = async (events: any) =>{
    try {
        const title: string = events.name
        const query = await db.events.findUnique({
            where: {
                name: title
            }
        })
        if (query) {
            return false
        }
        const event = await db.events.create({
            data: {
                name: title,
                country: events.country,
                logo_img: events.logo_img,
                distance: events.distance,
                org_id: parseInt( events.org_id)
            }
        })
        return true
    } catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    } 
}

export const eventYear = async (id:any) =>{
    try{
        const events: any = await db.races.findUnique({
            where: {
                id: parseInt(id.id)
            }
        })

        return {
            race :events
        }
    }  catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    } 
}




export const eventFilter = async  (query:{ country?: string, distance?: string, year?: string, title?: string, org_id?: string }) =>{
    try {
        const filterQuery: interface_.ObjectSort = {};
        const racetFilter: interface_.ObjectSort = {};
        if (query.country) {
            filterQuery["country"] = query.country
        }
        if (query.org_id) {
            filterQuery["org_id"] = parseInt(query.org_id) 
        }
        if(query.distance) {
            filterQuery["distance"] = query.distance
        if (query.year) {
            if((query.year).trim() !== "") {
                racetFilter["date"] = {
                    contains:query.year,
                    mode: 'insensitive'
                }
            }
        }
        if(query.title) {
            if((query.title).trim() !== "") {
                filterQuery["name"] = {
                    contains:query.title,
                    mode: 'insensitive'
                }
            }
            
        }}
        const events = await db.events.findMany({
            where: {
                ...(Object.keys(racetFilter).length > 0 && {
                Races: {
                    some: {
                        ...racetFilter
                    }
                }}),
                ...(Object.keys(filterQuery).length > 0 && filterQuery)
                
            }
        })
        return events
    } catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    } 
}