
import { Elysia, t } from "elysia";
import { PrismaClient } from '@prisma/client'
import * as interface_ from "./interface";
import { Storage } from '@google-cloud/storage'


const db = new PrismaClient()

export const getAllUser = () =>{
    try {
        const query = db.userRunX.findMany()
        return query
    } catch (error) {
        console.log('error',error)
        return []
    } 
}

export const getUserByEmail = async (profile :string) =>{
    try {
        const queryUser = await db.userRunX.findUnique({
            where: {
                email: profile
            }
        })
        if (queryUser?.nationality) {
            var reacesResult = await db.race_result.findMany({
                where: {
                    firstname: queryUser?.firstname_eng,
                    lastname: queryUser?.lastname_eng,
                    nationality: queryUser?.nationality
                }
            })
            if (Object.keys(reacesResult).length != 0) {
                return {
                    user: queryUser,
                    reacesResult: reacesResult,
                    
                }
            }
        }
        
        //console.log(Object.keys(reacesResult).length)
        
        return {
            user: queryUser,
            reacesResult: "user must edit nationality",
        }
        
    } catch (error) {
        console.log('error',error)
        return []
    } 
}
/////////////////////////////////////////////////////////////////////////////////////////////////
export const checkAdmin = async (admin: any) =>{
    try {
        const email: string = admin.userData.email
        const queryadmin = await db.admin.findUnique({
            where: {
                email: email
            }
        })
        if (queryadmin) { ////// check admin/////
            const passUser: any = queryadmin?.password
            const isMatch = await Bun.password.verify(admin.userData.password, passUser);
            if (!isMatch) {
                return {message :'login fail'}           
            }
            
            return {
                loggedIn: true,
                role: "admin"
            } 
        }
        return {
            loggedIn: false
        } 
    }  catch (error) {
        throw new Error('fail')
    }
}
export const checkUser = async (user: any) =>{
    try {
        const email: string = user.userData.email
        const queryuser = await db.userRunX.findUnique({
            where: {
                email: email
            }
        })
        
        if (queryuser) { ///// check user///////
            const passUser: any = queryuser?.password
            const isMatch = await Bun.password.verify(user.userData.password, passUser);
            if (!isMatch) {
                return {message :'login fail'}           
            }
            
            return {
                loggedIn: true,
                role: "user"
            } 
        }
        return {
            loggedIn: false
        } 
    } catch (error) {
        throw new Error('fail')
    } 
}




/////////////////////////////////////////////////////////////////////////////////////////////////
export const checkemail = async (email: string) =>{
    try {
        
        const query = await db.userRunX.findUnique({
            where: {
                email: email
            }
        })
        if (query != null) {
            return {
                isuser: true
            }
        }
        return {
            isuser: false
        }
    } catch (error) {
        console.log('error',error)
        return {
            isuser: false
        }
    } 
}

export const editPassword = async (body: any) =>{
    try {
        const updateUser = await db.userRunX.update({
            where: {
                email: body.email
            },
            data: {
                password: body.password
            },
        })
        return {
            status: true
        } 
    } catch (error) {
        console.log('error',error)
        return {
            status: false
        }
    } 

}



///////////////////////////////////////////////////singup///////////////////////////////////////////////////
export const duplecateUser = async (email: any) =>{
    try {
        const query = await db.userRunX.findUnique({
            where: {
                email: email
            }
        })
        return query
        
    } catch (error) {
        return "error"
    } 
}

export const createUser = async (user: any) =>{
    try {
        const users = await db.userRunX.create({
            data: {
                firstname_eng: user.firstname,
                lastname_eng: user.lastname,
                email: user.email,
                password: user.password,
                policy: user.policy_agreement
            }
        })
        return { status: 'ok'}
    } catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    } 
}
///////////////////////////////////////////////////singup///////////////////////////////////////////////////


//////////////////////////////////////////updateUser//////////////////////////////////////////////
export const updateUser = async (userBody: any, userEmail: string) =>{
    try {   
        const updateUser = await db.userRunX.update({
            where: {
                email: userEmail.email
            },
            data: {
                firstname_thai: userBody.firstname_thai,
                lastname_thai: userBody.lastname_thai,
                birth_date: new Date(userBody.birth_date),
                gender: userBody.gender,
                id_passport: userBody.id_passport,
                nationality: userBody.nationality,
            },
        }) 
        return { status: 'ok'}
    } catch (error) {
        console.log('error',error)
        return { status: "fail"}
    } 
}
export const updateUserOption = async (userBody: any, userEmail: string) =>{
    try {   
        
        const updateUser = await db.userRunX.update({
            where: {
                email: userEmail
            },
            data: {
                ...userBody
            },
        }) 
        return { status: 'ok'}
    } catch (error) {
        console.log('error',error)
        return { status: "fail"}
    } 
}
////////////////////////////////////////////updateUser////////////////////////////////////////////////

export const createOrg = async (org: any) =>{
    try {
        const orgName: string = org.name
        const isOrgExit = await db.organization.findUnique({
            where: {
                name: org.name
            }
        })
        if (isOrgExit == null) {
            const users = await db.organization.create({
                data: {
                    name: org.name
                }
            })
            return { status: 'ok'}
        }
        return { status: 'org exit'}
        
    } catch (error) {
        console.log('error',error)
        return { status: "fail"}
    } 
}

export const getAllOrg = () =>{
    try {
        const query = db.organization.findMany()
        return query
    } catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    } 
}

export const createEvent = async (events: any) =>{
    try {
        const title: string = events.name
        const query = await db.events.findUnique({
            where: {
                name: title
            }
        })
        if (query) {
            return false
        }
        const users = await db.events.create({
            data: {
                name: title,
                country: events.location
            
            }
        })
        return true
    } catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    } 
}


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
                date: new Date(race.date),
                start_time: race.start_time,
                max_point: race.max_point,
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

    return updateData;

    function parseID(id: string) {
        return Number.parseInt(id, 10);
    }

}


export const eventFilter = async  (filter:{ country?: string, distance?: string, year: string, title: string }) =>{
    try {
        const filterQuery: interface_.ObjectSort = {};
        if (filter.country) {
            filterQuery["country"] = filter.country
        }
        if (filter.distance) {
            filterQuery["distance"] = filter.distance
        }
        if (filter.year) {
            filterQuery["year"] = filter.year
        }
        if(filter.title) {
            if((filter.title).trim() !== "") {
                filterQuery["name"] = {
                    contains:filter.title,
                    mode: 'insensitive'
                }
            }
            
        }
        const eventsData = await db.events.findMany({
            where: {
                ...filterQuery
            }
        });
        return eventsData
    } catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    } 
}

export const uploadURI = async (params: any) =>{
    try {
        const storage = new Storage({ keyFilename: 'src/googleclound.json' })
        const {filename, bucket, ext, extFile} = params
        const options: any = {
                version: 'v4',
                action: 'write',
                expires: Date.now() + 15 * 60 * 1000, // 15 minutes
                contentType: ext,
                extensionHeaders: {
                    'x-goog-acl': 'public-read'
                }
        };
        //  This code is using the Google Cloud Storage library to generate a signed URL for uploading a
        // file to a specific bucket in Google Cloud Storage. 
        const url = await storage
            .bucket(bucket)
            .file(`/images/users/profile/${filename}.${extFile}`)
            .getSignedUrl(options);

        return url;


        
    } catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    } 
}


