import { Elysia, t } from "elysia";
import { PrismaClient } from '@prisma/client'

import {createRace} from '../../query/races/racesQuery';

const db = new PrismaClient()


export const appRacesPlugin = new Elysia()
    .post("/race/:org/:event", async ({body, set, params})=>{
        try {
        const race = body
        const res = await createRace(race, params)
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
        })
    })

export const getraces = new Elysia()
    .get("/races", () => {
        return db.races.findMany()
    })
