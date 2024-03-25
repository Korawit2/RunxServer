import { Elysia, t } from "elysia";
import { nationinfor, runnerDistances } from '../../query/user/userquery';
import { raceResult } from "../../query/user/guarduserQuery";

export const appRunnerPlugin = new Elysia()

.get("/runner/graph", async ({query ,set}) =>{
    try{
        var continent: any = false
        if (query.continent) {
            continent = true
        }
        const infomation = await nationinfor(continent)
        return infomation
    }
    catch (error) {
        set.status = 500
        return {
            message: 'error',
            error        
        }
    }
},{
    query: t.Object({
        continent: t.Optional(t.String())
    })
})

.get("/runners/distances", async ({query, set}) => {
    try{
        const userId = query.id
        const allRaces = await raceResult(userId, "desc", null)
        const result = await runnerDistances(allRaces, parseInt(query.year))
        return result

    } catch (error) {
        set.status = 500
        console.log('error',error)
        return {
            message: 'error',
            error        
        }
    }
},{
    query: t.Object({
        id: t.String(),
        year: t.String()
    })
})