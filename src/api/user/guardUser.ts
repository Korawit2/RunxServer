import { Elysia, t } from "elysia";
import { PrismaClient } from '@prisma/client'
import {getUserByEmail,  getAllUser, updateUserOption, updateUser, claimPoint, totalPoint} from '../../query/user/guarduserQuery';
import * as interface_ from "../../interface";



const db = new PrismaClient()
export const appUserguardPlugin = new Elysia()

.get("/all", () => getAllUser())

.get("/curentuser", async ({profile}) => {
    if (profile.role == "user") {
        const user: any = await getUserByEmail(profile.email)
        const total_Point: any =  await totalPoint(user.queryUser.id)
        const resultWithScore: any = {
            totalPoint: total_Point,
            user
            
        };
        return resultWithScore
    }
})

.post("/edit/user/", async ({body, set, profile})=> {
    try {
        const userBody = body;
        console.log(userBody)
        const Editdata: interface_.ObjectSort = {};
        var editOption: boolean = false
        if (userBody.firstname_eng) {
            Editdata["firstname_eng"] = userBody.firstname_eng
            editOption = true
        }
        if (userBody.lastname_eng) {
            Editdata["lastname_eng"] = userBody.lastname_eng
            editOption = true
        }
        if (userBody.email) {
            Editdata["email"] = userBody.email
            editOption = true
        }
        if (userBody.email) {
            Editdata["user_img"] = userBody.user_img
            editOption = true
        }
        if (editOption) {
            const res = await updateUserOption(Editdata, profile)
        }
        const res = await updateUser(userBody, profile)
        if (res.status == "ok") {
            const user: any = await getUserByEmail(profile.email)
            return {
                message: "Edit successful",
                user: user.user
            }
            }
        } catch (error) {
        set.status = 500
        return {
            message: "Edit fail"     
        }
        }
    },{
        body: t.Object({
        firstname_eng: t.Optional(t.String()),
        lastname_eng: t.Optional(t.String()),
        firstname_thai: t.String(),
        lastname_thai: t.String(),
        birth_date: t.String(),
        gender: t.String(),
        id_passport: t.String(),
        nationality: t.String(),
        email: t.Optional(t.String()),
        user_img: t.Optional(t.String())
        })
    })

.post("/claim/:resultId/:runxId", async ({params, set}) =>{
    try {
        const claim: any = await claimPoint(params)
        if (claim) {
            return {
                runx_id: claim.runx_id,
                Races_id: claim.id,
                message: "claim successful"
            }
        }
        return {
            message: "claim fail"
        }
        
    } catch  (error) {
        set.status = 500
        return {
            message: "claim fail"     
        }}
})
