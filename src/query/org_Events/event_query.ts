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

export const eventFilter = async  (filter:{ country?: string, distance?: string, year?: string, title?: string }) =>{
    try {
        const filterQuery: interface_.ObjectSort = {};
        const racetFilter: interface_.ObjectSort = {};
        if (filter.country) {
            filterQuery["country"] = filter.country
        }

        if(filter.distance) {
            const lteAndgte = filter.distance.split("-");
            racetFilter["distance"] = {
                ...lteAndgte.length > 1 ? { gte: parseInt(lteAndgte[0]), lte: parseInt(lteAndgte[1])} : { equals: parseInt(lteAndgte[0]) }
            }
        }

        if (filter.year) {
            if((filter.year).trim() !== "") {
                racetFilter["date"] = {
                    contains:filter.year,
                    mode: 'insensitive'
                }
            }
        }
        if(filter.title) {
            if((filter.title).trim() !== "") {
                filterQuery["name"] = {
                    contains:filter.title,
                    mode: 'insensitive'
                }
            }
            
        }
        // console.log("filterQuery", filterQuery)
        // console.log("racetFilter", racetFilter)
        if (Object.keys(filterQuery).length == 0 &&  Object.keys(racetFilter).length == 0) {
            const events = await db.events.findMany()
            return events
        }
        if (Object.keys(filterQuery).length > 0 &&  Object.keys(racetFilter).length > 0) {
            const events = await db.events.findMany({
                where: {
                    Races: {
                        some: {
                            ...racetFilter
                        }
                    },
                    ...filterQuery
                    
                }
            })
            return events
        }
        if (Object.keys(filterQuery).length >= 0 &&  Object.keys(racetFilter).length > 0) {
            const events = await db.events.findMany({
                where: {
                    Races: {
                        some: {
                            ...racetFilter
                        }
                    },
                }
            })
            return events
        }
        if (Object.keys(filterQuery).length > 0 &&  Object.keys(racetFilter).length >= 0) {
            const events = await db.events.findMany({
                where: {
                    ...filterQuery
                }
            })
            return events
        }
        ////////////////////////////////////////////////////////////////////////////
        // const events = await db.events.findMany({
        //     where: {
        //         Races: {
        //             some: {
        //                 ...racetFilter
        //             }
        //         },
        //         ...eventFilter
        //     }
        // })
        // return events

        ////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////////
        // var categoryData : any
        // if (Object.keys(categoryFilter).length > 0) {
        //     categoryData = await db.category.findMany({
        //         where: {
        //             ...categoryFilter
        //         },
        //         select: {
        //             races_Id: true
        //         }
        //     });  
        //     //console.log(categoryData)
        //     const raceDataObject: number[] = [];
        //     for (let i = 0; i < categoryData.length; i++) {
        //         const element = categoryData[i];
        //         //console.log(element)
        //         const raceData = await db.races.findMany({
        //             where:{
        //                 id: element.races_Id,
        //                 ...racetFilter
        //             },
        //             select: {
        //                 event_id: true
        //             }

        //     })
        //         if (Object.keys(raceData).length > 0) {
        //             if (raceDataObject.indexOf(raceData[0].event_id) == -1) {
        //                 raceDataObject.push(raceData[0].event_id)
        //             }  
                    
        //         }
        //     //console.log(raceData)
        //     }
        // //console.log(categoryData)
        //     //console.log(raceDataObject)
        //     const eventsData: any = []
        //     for (let i = 0; i < raceDataObject.length; i++) {
        //         const element = raceDataObject[i];
        //         const eventDataquery = await db.events.findMany({
        //             where:{
        //                 id: element,
        //                 ...filterQuery
        //             },
        //         })
        //         if (Object.keys(eventDataquery).length > 0) {
        //             eventsData.push(eventDataquery)
        //         }
        //     }
        //     return eventsData
        // }
        // if (Object.keys(racetFilter).length > 0) {
        //     const racseData = await db.races.findMany({
        //         where:{
        //             ...racetFilter
        //         },
        //         select: {
        //             event_id: true
        //         }})
        //         //console.log(racseData)
            
        //     //console.log(racseData)
        //     const eventsData: any = []
        //     for (let i = 0; i < racseData.length; i++) {
        //         const element = racseData[i];
        //         const eventDataquery = await db.events.findMany({
        //             where:{
        //                 id: element.event_id,
        //                 ...filterQuery
        //             },
        //         })
        //         if (Object.keys(eventDataquery).length > 0) {
        //             eventsData.push(eventDataquery)
        //         }
        //     }
        //     return eventsData
        // }
        // const eventDataquery = await db.events.findMany({
        //     where:{
        //         ...filterQuery
        //     },
        // })
        // return eventDataquery
        ///////////////////////////////////////////////////////////////////////////////////////
    } catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    } 
}