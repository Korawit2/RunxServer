import { Elysia, t } from "elysia";
import { PrismaClient } from '@prisma/client'
import { raceResult } from "../../query/user/guarduserQuery";
import { createRace, queryRunner} from '../../query/races/racesQuery';
import { eventYear } from '../../query/org_Events/event_query'


const db = new PrismaClient()
export const appRacesPlugin = new Elysia()
    .post("/races", async ({body ,query, set, params})=>{
        try {
        const race = body
        const res = await createRace(race, query)
        if (res.status) {
            return { 
            message: "insert race complete",
            data: body
            }
        }
        return { 
            message: "insert race fail",
            data: body
        }
        }  catch (error) {
        set.status = 500
        return {
            message: 'error',
            error        
        }
        }
    },{
        body: t.Object({
            name: t.String(),
            date: t.String(),
            state: t.String(),
            start_time: t.String(),
            distance: t.Number()
        }),
        query: t.Object({
            org: t.String(),
            event: t.String()

        })
    })

export const getraces = new Elysia()
    .get("/races/:id", async ({params}) => {
        const raceYear = await eventYear(params)
        return raceYear
    },{
        params: t.Object({
            id: t. String()
        })
    })
    
    .get("/races/result/runner", async ({query, set}) =>{
        try {
            const runner = await queryRunner(query)
            return runner
        }  catch (error) {
            set.status = 500
            return {
                message: 'error',
                error        
            }
        }
    },{
        query: t.Object({
            raceId: t.Optional(t.String()),
            name: t.Optional(t.String()),
            gender: t.Optional(t.String()),
        })
    })

    .get("/races/result/", async ({query ,set}) => {
        try {
                try {
                    var methodSort = "desc"
                    if (query.method) {
                        methodSort = query.method
                    }
                    const result = await raceResult(query.id, methodSort, query.limit)
                    return result
                } catch (error) {
                    set.status = 500
                    return {
                        message: "fail"     
                    }
                }
        } catch (error) {
            console.log('error',error)
            return {
                message: 'error',
                error        
            }
        } 
        
    },{
        query: t.Object({
            id: t.String(),
            limit: t.Optional(t.String()),
            method: t.Optional(t.String()),
            
        }),
    })
