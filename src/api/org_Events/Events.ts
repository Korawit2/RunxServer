import { Elysia, t } from "elysia";
import { PrismaClient } from '@prisma/client'

import {createEvent, eventFilter, eventYear} from '../../query/org_Events/event_query';

const db = new PrismaClient()


export const appEventPlugin = new Elysia()
    .post("/events", async ({body, set})=> {
        try {
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
            country: t.String()
        })
    })
export const appgetEventPlugin = new Elysia()
    .post("/events/:id", ({params}) => {
        const Id = params.id
        return db.events.findUnique({
        include: {
            Races: true
        },
        where: {
            id: parseInt(Id)
        }
    })
    })

export const appgetfillterEventPlugin = new Elysia()
    .post("/events/filter", async ({body, set})=>{
        try {
            const event = await eventFilter(body)
            set.status = 200
            return {
                //status: 200,
                data: event
            }
        } catch (error){
            set.status = 400
            return {
                message: 'error',
                error        
            }
        }
        
        },{
            body: t.Object({
                country: t.Optional(t.String()),
                distance: t.Optional(t.String()),
                year:t.Optional(t.String()),
                title: t.Optional(t.String()),
            })
        })
    .get("/eventAtYear/:eventId/:raceId", async ({params, set}) => {
        try {
            const event = await eventYear(params)
            return event
        }  catch (error){
            set.status = 400
            return {
                message: 'error',
                error        
            }
        }
    })