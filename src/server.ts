import { Elysia, t } from "elysia";
import { PrismaClient } from '@prisma/client'
import { checkAdmin, uploadURI } from "./model";
import { cors } from "@elysiajs/cors";
import { swagger } from '@elysiajs/swagger'
import { appPlugin } from './api/user/user'
import { appUserguardPlugin } from './api/user/guardUser'
import { appUpload } from './api/races/upload'
import { appPostOrgPlugin, appgetOrgPlugin } from './api/org_Events/Organization'
import { appEventPlugin, appgetEventPlugin, appgetfillterEventPlugin } from './api/org_Events/Events'
import { appRacesPlugin, getraces } from './api/races/races'
import { MIMEType } from "util";


const db = new PrismaClient()
const app = new Elysia()



.use(cors({
  credentials: true,
}))

.derive(async ({jwt,  headers}) => {
  const auth = headers.authorization
  if(auth) {
    //const convert = auth.startsWith('Bearer ') ? auth.slice(7) : null
    const profile = await jwt.verify(auth!)
    //console.log(profile)
    return { profile }
  } else {
  return false
  }
})

.get("/", () => "server Runx is running ")
.use(swagger())
.guard({
  beforeHandle: ({set,profile}) =>{
    if (!profile) {
      set.status = 401
      return 'Unauthorized'
    }
    else if (profile.role != "user") {
      return 'Unauthorized'
    } 
  }
}, (app) =>
          app
          .use(appUserguardPlugin)
          .use(getraces)
          .use(appgetOrgPlugin)
          .use(appgetEventPlugin)
)


.guard({
  beforeHandle: ({set,profile}) =>{
    if (!profile) {
      set.status = 401
      return 'Unauthorized'
    }
    else if (profile.role != "admin") {
      return 'Unauthorized'
    } 
  }
}, (app) =>
          app
          .use(appUpload)
          .use(appPostOrgPlugin)
          .use(appEventPlugin)
          .use(appRacesPlugin)
          .use(getraces)
          .use(appgetOrgPlugin)
          .use(appgetEventPlugin)
          
)
.use(appPlugin)
.use(appgetfillterEventPlugin)
.post("/uploadImg", async ({body, set}) =>{
  try {
    const  ext  = body;
    const extFile = ext.image.type;
    const filename = crypto.randomUUID();
    const bucket = 's.dev.runx.run'
    
    const params = {filename, bucket, ext, extFile}
    const uploadUri = await uploadURI(params)
    const downloadUri = `https://storage.googleapi.com/${bucket}/images/users/profile/${filename}.${extFile}`
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














  // const { Storage } = require('@google-cloud/storage')
  // const storage = new Storage();
  // async function generateV4ReadSignedUrl() {
  //   // These options will allow temporary read access to the file
  //   const options = {
  //     version: 'v4',
  //     action: 'read',
  //     expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  //   };
  
  //   // Get a v4 signed URL for reading the file
  //   const [url] = await storage
  //     .bucket('runx-runners-dev')
  //     .file()
  //     .getSignedUrl(options);
  
  //   console.log('Generated GET signed URL:');
  //   console.log(url);
  //   console.log('You can use this URL with any user agent, for example:');
  //   console.log(`curl '${url}'`);
  // }
  // generateV4ReadSignedUrl().catch(console.error);
  
  // const blob = body.file
  // console.log(blob)
  // const buf = Buffer.from(await blob.arrayBuffer());
  // const qwe = buf.toString("base64")
  // const atob1 = Buffer.from(qwe)
  
  
  
})

.listen(3000);
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);


