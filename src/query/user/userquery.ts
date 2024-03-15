import { PrismaClient } from '@prisma/client'
import  postmark  from "postmark"
import { calculateScore } from '../../function/calculate'
import { type } from 'os'
const db = new PrismaClient()
import continents from '../../../JSON/countryByContinent.json'

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

export const checkemail = async (email: string) =>{
    try {
        
        const query = await db.userRunX.findUnique({
            where: {
                email: email
            },
            select:{
                firstname_eng:true,
                password: true
            }
        })
        if (query != null) {
            return {
                query,
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

export const changepassword = async (user: any, email:any) =>{
    try {
        if (user.password === user.confirmpassword) {
            const isEmailExit = await checkemail(email)
            if (isEmailExit.isuser) {
                const passUser: any = isEmailExit.query?.password
                const isMatch = await Bun.password.verify(user.currentpassword, passUser);
                if (isMatch) {
                    user.password = await Bun.password.hash(user.password, {
                        algorithm: 'bcrypt',
                        cost: 10,
                    })
                    const updateUser: any = await db.userRunX.update({
                        where: {
                            email: email
                        },
                        data: {
                            password: user.password
                        },
                    }) 
                    // var client = new postmark.ServerClient(`${process.env.POSTMARK_TOKEN}`);
                    // client.sendEmailWithTemplate({
                    //     "From": "6322771930@g.siit.tu.ac.th",
                    //     "To": "6322772953@g.siit.tu.ac.th",
                    //     "TemplateAlias": "password-reset-1",
                    //     "TemplateModel": {
                    //     "product_name": "Runx",
                    //     "name": isEmailExit.query?.firstname_eng,
                    //     "action_url": "https://www.youtube.com/watch?v=btNmeVPdsT8",
                    //     "company_name": "Runx",
                    //     "company_address": "สวรรค์ชั้น 7",
                    //     }
                    // });
                    return {
                        message: "change password complete"
                    }
                }
                return {
                    message: "currentpassword is not match"
                }
                
            }
        }
        return {
            message: "confirmpassword not same"
        }

        
    } catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    } 
}

export const getrankrunx = async (query: any) =>{
    try {
        var minY: any
        var maxY: any
        if (query !== null) {
            const date = new Date();
            minY = date.getFullYear() - parseInt(query.min) 
            maxY = date.getFullYear() - parseInt(query.max) 
        }
        const user = await db.userRunX.findMany({
            select:{
                id:true,
                firstname_eng:true,
                lastname_eng:true,
                gender:true,
                nationality: true,
                birth_date: true
            },
            where:{
                ...(Object.keys(query).length > 0 && {
                    birth_date: {
                        lte: new Date(`${minY}`),
                        gte: new Date(`${maxY}`)
                    }
                }),
                
            }
        })
        var rankuser = []
        for (let i = 0; i < user.length; i++) {
            const userrace = await db.race_result.findMany({
                where:{
                    runx_id: user[i].id
                }
            })
            var totalscore: number = 0
            if (userrace.length > 0) {
                for (let i = 0; i < userrace.length; i++) {
                    const score: any = await calculateScore(userrace[i].rank)
                    totalscore = totalscore + score
                }
            }
            const resultWithScore = await RaceResults(user[i], totalscore, )
            rankuser.push(resultWithScore)
            
            
        }
        rankuser.sort((a, b) => {
            return a.totalscore - b.totalscore;
        });

        rankuser.reverse();
        const dataConvert = rankuser.map((item,i) => {
        return {
            id: item.id,
            rank: i + 1,
            name: item.name,
            totalscore: item.totalscore,
            gender: item.gender,
            age: item.age,
            nationality: item.nationality
        }
    })
        return dataConvert
    }  
    catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    } 
}

const RaceResults = async (user: any, totalscore: number) =>{
    var age : any = null
    if (user.birth_date !== null) {
        const date = new Date();
        const dateY = date.getFullYear();
        const d = user.birth_date.getFullYear()
        age = dateY - d
    }
    return{
        id: user.id,
        name: user.firstname_eng +" "+ user.lastname_eng,
        totalscore: totalscore,
        gender: user.gender,
        age: age,
        nationality: user.nationality
    }
}

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
                        if (continentOfuser.some(e => e.continent === continents[j].continent )) {
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
            var x_axis = []
            var y_axis = []
            if (continentOfuser.length > 0) {
                for (let i = 0; i < continentOfuser.length; i++) {
                    x_axis.push(continentOfuser[i].continent)
                    y_axis.push(continentOfuser[i].total)
                }
            }
            return {
                x_axis: x_axis,
                y_axis: y_axis
            }
        }
        var x_axis = []
        var y_axis = []
        if (groupBy.length > 0) {
            for (let i = 0; i < groupBy.length; i++) {
                x_axis.push(groupBy[i].nationality)
                y_axis.push(groupBy[i]._count.nationality)
            }
        }
        return {
            x_axis: x_axis,
            y_axis: y_axis
        }
    } catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    }
    
}




