import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()


export const calculateScore  = async (rank: number) =>{
    if ( rank  <= 500) {
        var score: number = 1000/Math.log2(rank  + 1)
        return parseInt(score.toFixed(0)) 
    }
    if ( 500 < rank   && rank  <= 1000 ) {
        return 100
    }
    return 50
} 