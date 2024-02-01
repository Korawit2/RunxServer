import { Elysia, t } from "elysia";
import { PrismaClient } from '@prisma/client'

import {createEvent} from '../../model';

const db = new PrismaClient()


export const appEventPlugin = new Elysia()

    .get("/events", () => {
        return db.events.findMany({
        include: {
            Races: true,
        },
    }
        )
    })
    .post("/events", async ({body, set})=> {
        const eventBody = body
        try {
        const eventBody = body
        const res = await createEvent(body)
        if (!res) {
            return { message: "insert fail"}
        }
        return { message: "insert complete "}
        } catch (error) {
        set.status = 500
        return {
            message: 'error',
            error        
        }
        }
    },{
        body: t.Object({
            name: t.String(),
            location: t.String()
        })
    })
    export const appgetEventPlugin = new Elysia()

    .get("/events", () => {
        return db.events.findMany({
        include: {
            Races: true,
        },
    }
        )
    })