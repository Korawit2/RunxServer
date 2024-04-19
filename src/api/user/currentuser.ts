
import { Elysia, t } from "elysia";
import { totalPoint, getUserByemail, updateUser, claimPoint } from '../../query/user/querycurrentuser';
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
.post("/currentusers", async ({body, set, profile})=> {
    try {
        const userBody = body;
        if (userBody.birth_date  &&  userBody.birth_date !== "") {
            userBody.birth_date = new Date(userBody.birth_date)
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
        birth_date: t.Optional(t.String()),
        gender: t.Optional(t.String()),
        id_passport: t.Optional(t.String()),
        nationality: t.Optional(t.String()),
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
