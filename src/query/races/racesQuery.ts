import { PrismaClient } from '@prisma/client'
import * as interface_ from "../../interface";
const db = new PrismaClient()

export const createRace = async (race: any, params: any) =>{
    try {
        const title: string = race.name
        const query = await db.races.findUnique({
            where: {
                name: title
            }
        })
        if (query) {
            return false
        }
        const users = await db.races.create({
            data: {
                org_id: parseInt(params.org) ,
                event_id: parseInt(params.event) ,
                name: race.name,
                date: race.date,
                start_time: race.start_time
            }
        })
        return true
    } catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    } 
}

export async function uploadDataToRaces(db: PrismaClient, raceId: string, categoryId: string, dataRace_result: interface_.ExcelUploadRuner[]) {
    const dataConvert =  dataRace_result.map((item,i) => {
        var name = item.Name.split(" ")
        const firstname: string = name[0]
        const lastname: string = name[1]
        return {
            Races_id: parseID(raceId),
            categoryId: parseID(categoryId),
            rank: item.Rank,
            time: item.Gun_Time,
            firstname: firstname,
            lastname: lastname,
            gender: item.Gender,
            age_group: item.Age_Group,
            nationality: item.Nationality
        }
    })

    const updateData = await db.race_result.createMany({
        data: dataConvert
    })

    return updateData;

    function parseID(id: string) {
        return Number.parseInt(id, 10);
    }

}