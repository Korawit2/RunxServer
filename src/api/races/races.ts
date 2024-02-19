import { Elysia, t } from "elysia";
import { PrismaClient } from '@prisma/client'

import {createRace, queryRunner} from '../../query/races/racesQuery';
import { eventYear } from '../../query/org_Events/event_query'
const db = new PrismaClient()


export const appRacesPlugin = new Elysia()
    .post("/race", async ({body ,query, set, params})=>{
        try {
        const race = body
        const res = await createRace(race, query)
        if (res) {
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
            race: t.String(),
            org: t.String(),
            event: t.String()

        })
    })

export const getraces = new Elysia()
    .get("/race", async ({query}) => {
        const raceYear = await eventYear(query)
        return raceYear
    },{
        query: t.Object({
            raceId: t. String()
        })
    })
    
    .get("/runner", async ({query, set}) =>{
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
            raceId: t.String(),
            name: t.Optional(t.String()),
            gender: t.Optional(t.String()),
        })
    })
