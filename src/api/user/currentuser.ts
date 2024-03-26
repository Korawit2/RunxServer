
import { Elysia, t } from "elysia";
import { totalPoint, getUserByemail, updateUserOption, updateUser, claimPoint } from '../../query/user/querycurrentuser';
import * as interface_ from "../../interface";

export const currentusersPlugin = new Elysia()
.get("/currentusers", async ({profile}) => {
    
    const user: any = await getUserByemail(profile.email)
    const total_Point: any =  await totalPoint(user.id)
    const resultWithScore: any = {
        totalPoint: total_Point,
        user
        
    };
    return resultWithScore

})
.post("currentusers", async ({body, set, profile})=> {
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
            const user: any = await getUserByemail(profile.email)
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
    .post("/currentusers/claim/score", async ({query, set, profile}) =>{
        try {
            const claim: any = await claimPoint(query, profile)
            if (claim) {
                if (claim.status) {
                    return {
                        runx_id: query.runxId,
                        Races_id: query.resultId,
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
    },{
        query: t.Object({
            resultId: t.String(),
            runxId: t.String()
        })
    })
