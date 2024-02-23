import { PrismaClient } from '@prisma/client'
import { calculateScore } from '../../function/calculate'
import * as interface_ from "../../interface";
const db = new PrismaClient()

export const createRace = async (race: any, query: any) =>{
    try {
        const title: string = race.name
        const queryname = await db.races.findUnique({
            where: {
                name: title
            }
        })
        if (query) {
            return false
        }
        const users = await db.races.create({
            data: {
                org_id: parseInt(query.org) ,
                event_id: parseInt(query.event) ,
                name: race.name,
                date: race.date,
                state: race.state,
                start_time: race.start_time,
                distance: race.distance
            }
        })
        return true
    } catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    } 
}

export async function uploadDataToRaces(db: PrismaClient, raceId: string, dataRace_result: interface_.ExcelUploadRuner[]) {
    try{
        const dataConvert =  dataRace_result.map((item,i) => {
            var name = item.Name.split(" ")
            const firstname: string = name[0]
            const lastname: string = name[1]
            return {
                Races_id: parseID(raceId),
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
        if (updateData.count !== 0) {
            return {
                status: true
            };
        }
        return {
            status: false
        };;
    
        function parseID(id: string) {
            return Number.parseInt(id, 10);
        }
    } catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    }
    

}

export const queryRunner = async (query: any) =>{
    try {
        var runner: any = []
        const filterQuery: interface_.ObjectSort = {};

        if(query.name) {
            filterQuery["OR"] = 
            [
                { firstname: { contains: query.name },},
                { lastname: { contains: query.name } },
            ]
        }
        if(query.raceId) {
            filterQuery["Races_id"] = parseInt(query.raceId) 
        }
        if(query.gender) {
            filterQuery["gender"] = query.gender
        }
        const queryRunner: any = await db.race_result.findMany({
            where: {
                ...filterQuery
            },
            select:{
                rank: true,
                firstname: true,
                lastname: true,
                time: true,
                gender: true
            },
            orderBy: {
                rank: 'asc',
            },
        })
        for (let i = 0; i < queryRunner.length; i++) {
            const score: any = await calculateScore(queryRunner[i].rank)
            const makeRunner = await formRunner(queryRunner[i], score)
            runner.push(makeRunner)
            
        }
        return runner
    } catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    } 
}

const formRunner =  async ( query: any, score: number, ) =>{
    return {
        rank: query.rank,
        firstname: query.firstname,
        lastname: query.lastname,
        score: score,
        time: query.time,
        gender: query.gender
        
    }
}