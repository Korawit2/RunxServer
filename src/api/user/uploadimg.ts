import { Elysia, t } from "elysia";
import { uploadURI } from '../../function/uploadimg'

export const appuploadImg = new Elysia()
.get("/creating/singUrl", async ({set}) =>{
    try {
        const extFile = "jpg";
        const filename = crypto.randomUUID();
        const bucket = 's.dev.runx.run'
        const params = {filename, bucket,  extFile}
        const uploadUri = await uploadURI(params)
        const downloadUri = `https://storage.googleapis.com/${bucket}/images/users/profile/${filename}.${extFile}`
        return {
            uploadUri: uploadUri,
            downloadUri: downloadUri
        }
    } catch (error) {
        set.status = 500
        return {
            message: "Edit fail"     
        }
    }
})