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
            org_id: t.String(),
            name: t.String(),
            country: t.String(),
            logo_img: t.String(),
            distance: t.String()
        })
    })
export const appgetEventPlugin = new Elysia()
    .get("/events/:id", ({params}) => {
        const Id = params.id
        return db.events.findUnique({
        include: {
            Races: true
        },
        where: {
            id: parseInt(Id)
        }
        })
    },{
        params: t.Object({
            id: t.String()
        })
    })

export const appgetfillterEventPlugin = new Elysia()
    .get("/events/filter", async ({query, set})=>{
        try {
            const event = await eventFilter(query)
            set.status = 200
            return {
                data: event
            }
        } catch (error){
            set.status = 400
            return {
                message: 'error'      
            }
        }
        },{
            query: t.Object({
                org_id: t.Optional(t.String()),
                country: t.Optional(t.String()),
                distance: t.Optional(t.String()),
                year:t.Optional(t.String()),
                title: t.Optional(t.String()),
                min: t.Optional(t.String()),
                max:t.Optional(t.String()),
            })
        })