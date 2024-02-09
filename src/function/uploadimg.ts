import { Elysia, t } from "elysia";
import { PrismaClient } from '@prisma/client'

import { Storage } from '@google-cloud/storage'


const db = new PrismaClient()

export const uploadURI = async (params: any) =>{
    try {
        const storage = new Storage({ keyFilename: 'src/googleclound.json' })
        const {filename, bucket,  extFile} = params
        const options: any = {
                version: 'v4',
                action: 'write',
                expires: Date.now() + 15 * 60 * 1000, // 15 minutes
                contentType: "image/jpeg",
                extensionHeaders: {
                    'x-goog-acl': 'public-read'
                }
        };
        //  This code is using the Google Cloud Storage library to generate a signed URL for uploading a
        // file to a specific bucket in Google Cloud Storage. 
        const url = await storage
            .bucket(bucket)
            .file(`images/users/profile/${filename}.${extFile}`)
            .getSignedUrl(options);
        return url;
    } catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    } 
}