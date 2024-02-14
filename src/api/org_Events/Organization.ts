import { Elysia, t } from "elysia";
import { PrismaClient } from '@prisma/client'

import {getAllOrg, createOrg} from '../../query/org_Events/org_query';

const db = new PrismaClient()


export const appPostOrgPlugin = new Elysia()

    .post("/org", async ({body, set})=> {
    const orgBody = body
    try {
        const res = await createOrg(orgBody)
        if (res.status == "ok") {
        return {
            message: "insert complete",
            orgBody
        }
        }
        return {
        message: "insert fail",
        orgBody
        }
        
    } catch (error) {
        set.status = 500
        return {
            message: 'error',
            error        
        }
    }
    },{
    body: t.Object({
        name: t.String()
    })
    })

    export const appgetOrgPlugin = new Elysia()
    .get("/org", () => getAllOrg())
