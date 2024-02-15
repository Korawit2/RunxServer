import { Elysia, t } from "elysia";
import { PrismaClient } from '@prisma/client'
import {getUserByEmail,  getAllUser, updateUserOption, updateUser, claimPoint, totalPoint} from '../../query/user/guarduserQuery';
import * as interface_ from "../../interface";



const db = new PrismaClient()
export const appUserguardPlugin = new Elysia()

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
        if (userBody.user_img) {
            Editdata["user_img"] = userBody.user_img
            editOption = true
        }
        if (userBody.firstname_thai) {
            Editdata["firstname_thai"] = userBody.firstname_thai
            editOption = true
        }
        if (userBody.lastname_thai) {
            Editdata["lastname_thai"] = userBody.lastname_thai
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
        firstname_thai: t.Optional(t.String()),
        lastname_thai: t.Optional(t.String()),
        birth_date: t.String(),
        gender: t.String(),
        id_passport: t.String(),
        nationality: t.String(),
        email: t.Optional(t.String()),
        user_img: t.Optional(t.String())
        })
    })

.post("/claim/:resultId/:runxId", async ({params, set, profile}) =>{
    try {
        const claim: any = await claimPoint(params, profile)
        if (claim) {
            if (claim.status) {
                return {
                    runx_id: params.runxId,
                    Races_id: params.resultId,
                    message: "claim successful"
                }
            }
            return "you have no right to claim this point"
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
