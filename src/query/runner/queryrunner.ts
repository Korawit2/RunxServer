import { PrismaClient } from '@prisma/client'
import continents from '../../../JSON/countryByContinent.json'
import { calculateScore } from '../../function/calculate'
const db = new PrismaClient()

export const nationinfor = async (continent: string) =>{
    try {
        var country = []
        if (continent !== null) {
            for (let i = 0; i < continents.length; i++) {
                if (continents[i].continent == continent) {
                    country.push(continents[i].country)
                }
            }
        }
        const groupBy = await db.userRunX.groupBy({
            by: ['nationality'],
                _count: {
                    nationality: true,
                },
            orderBy: {
                    nationality: "asc"
            },
        })
        var continentOfuser = []
        if (continent) {
            for (let i = 0; i <  groupBy.length; i++) {
                for (let j = 0; j < continents.length; j++) {
                    if (groupBy[i].nationality === continents[j].country) {
                        if (continentOfuser.length === 0) {
                            const data = {
                                continent: continents[j].continent,
                                total: groupBy[i]._count.nationality
                            }
                            continentOfuser.push(data)
                            { continue; }
                        }
                        if (continentOfuser.some(e => e.continent === continents[j].continent)) {
                            const index = continentOfuser.findIndex(x => x.continent === continents[j].continent)
                            continentOfuser[index].total = continentOfuser[index].total + groupBy[i]._count.nationality
                            { continue; }
                        }
                        const data = {
                            continent: continents[j].continent,
                            total: groupBy[i]._count.nationality
                        }
                        continentOfuser.push(data)

                    }
                } 
                
            }
            
            const result = continentOfuser.map((item)=>{
                return {
                    continent: item.continent,
                    total: item.total
                }
            })
            return {
                result
            }
        }
        
        const result = groupBy.map((item)=>{
            return {
                country: item.nationality,
                total: item._count.nationality
            }
        })
        return {
            result
        }
    } catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    }
    
}

export const runnerDistances = async (allRaces: any, year: number) =>{
    try {
        const result = []
        if (allRaces.length > 0) {
            for (let i = 0; i < allRaces.length; i++) {
                if (allRaces[i].date.getFullYear() == year) {
                    if (result.length === 0) {
                        const data = {
                            Month: allRaces[i].date.getMonth(),
                            totalDistances: allRaces[i].distance
                        }
                        result.push(data)
                        { continue; }
                    }
                    if (result.some(e => e.Month === allRaces[i].date.getMonth())) {
                        const index = result.findIndex(x => x.Month === allRaces[i].date.getMonth())
                        result[index].totalDistances = result[index].totalDistances + allRaces[i].distance
                        { continue; }
                    }
                    const data = {
                        Month: allRaces[i].date.getMonth(),
                        totalDistances: allRaces[i].distance
                    }
                    result.push(data)
                }
            }
        }
        return {
            year: year,
            result: result
        }

    } catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    }
}


export const raceResult = async (id: string, method: any, limit: any) =>{
    try {
        const user: any = await db.userRunX.findUnique({
            where: {
                id: parseInt(id) 
            },
            select:{
                firstname_eng: true,
                lastname_eng: true,
                nationality: true
            }}
        )
        if (user.nationality != null) {
                const race: any = await db.races.findMany({
                    include:{
                        Race_result: {
                            where:{
                                firstname: user?.firstname_eng,
                                lastname: user?.lastname_eng,
                                nationality: user?.nationality
                            }
                        }
                    },
                    where:{
                        Race_result:{
                            some:{
                                firstname: user?.firstname_eng,
                                lastname: user?.lastname_eng,
                                nationality: user?.nationality
                            }
                        }
                    },
                    orderBy: {
                        date: method,
                    },
                    ...(limit != null && {
                        take: parseInt(limit)
                    })
                })
                
                if (race.length) {
                    var result: any = []
                    for (let i = 0; i < race.length; i++) {
                        const AllRaceresultId : any = await db.race_result.aggregate({
                            _count: {
                                Races_id: true,
                            },
                            where: {
                                Races_id: race[i].Race_result[0].Races_id
                            }
                        })
                        const score: any = await calculateScore(race[i].Race_result[0].rank)
                        const findPace = await pace(race[i].Race_result[0].time, race[i].distance)
                        const pace_Avg = await paceAvg(race[i].id) 
                        const resultWithScore = await detailasync(race[i], score, AllRaceresultId._count.Races_id, findPace, pace_Avg)
                        result.push(resultWithScore)   
                    }
                    return result
                }
                return {
                    message: "Race result is empty"
                }
        }
        return {
            message: "User must Edit nationality"
        }
    } catch (error) {
        console.log('error',error)
        return {
            message : "Error"
        }
    } 
}

export const pace = async (time: any, distance: any) =>{
    const array = time.split(":")
    var min: any = 0
    min = min + parseInt(array[0]) * 60 
    min = min + parseInt(array[1])
    min = min + parseInt(array[2]) / 60
    const pace = parseInt(min.toFixed(2)) / distance
    return pace.toFixed(2)
}

const detailasync =  async (race: any, score: number, allrace: number, pace: any, pace_Avg:any) =>{
    return {
        ResultId: race.Race_result[0].id,
        Races_id: race.id,
        logoImg: race.logo_img,
        date: race.date,
        name: race.name,
        distance: race.distance,
        pace: pace,
        pace_Avg: pace_Avg,
        rank: `${race.Race_result[0].rank}/${allrace}`,
        time: race.Race_result[0].time,
        claim_status: race.Race_result[0].claim_status,
        score : score.toFixed(0)
    }
}

export const paceAvg = async (id: any) =>{
    try {
        const data = await db.races.findMany({
            select:{
                distance:true,
                Race_result:{
                    where:{
                        Races_id:id
                    },
                    select:{
                        time:true
                    }
                }
            },
            where:{
                id: id
            }
        })
        if (data.length > 0) {
            var allPanc = []
            var avg = 0;
            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < data[i].Race_result.length; j++) {
                    const findPace = await pace(data[i].Race_result[j].time, data[i].distance )
                    allPanc.push(parseFloat(findPace))
                }
                let sum = 0
                for (let i = 0; i < allPanc.length; i++) {
                    sum += allPanc[i];
                }
                avg = sum / data[i].Race_result.length
            } 
            return avg.toFixed(2)
        }
    } catch (error) {
        console.log('error',error)
        return { status: "fail"}
    }
}