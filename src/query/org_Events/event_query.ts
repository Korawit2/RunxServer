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
        const users = await db.events.create({
            data: {
                name: title,
                country: events.location
            
            }
        })
        return true
    } catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    } 
}

export const eventFilter = async  (filter:{ country?: string, distance?: string, year: string, title: string }) =>{
    try {
        const filterQuery: interface_.ObjectSort = {};
        if (filter.country) {
            filterQuery["country"] = filter.country
        }
        if (filter.distance) {
            filterQuery["distance"] = filter.distance
        }
        if (filter.year) {
            filterQuery["year"] = filter.year
        }
        if(filter.title) {
            if((filter.title).trim() !== "") {
                filterQuery["name"] = {
                    contains:filter.title,
                    mode: 'insensitive'
                }
            }
            
        }
        const eventsData = await db.events.findMany({
            where: {
                ...filterQuery
            }
        });
        return eventsData
    } catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    } 
}