
import { Elysia, t } from "elysia";
import { PrismaClient } from '@prisma/client'
import { uploadDataToRaces } from '../../query/races/racesQuery';
import XLSX from "xlsx"

const db = new PrismaClient()


export const appUpload = new Elysia()

.post('/upload', async ({ body: { excelFile, raceId, }, set  }) => {
    const columnsField = ['Name','Gender','Age_Group','Gun_Time','Rank','Nationality'];
    var workbook = XLSX.read(await excelFile.arrayBuffer(), { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const sheetJSON_ =  JSON.parse(JSON.stringify(sheetData))
    if(sheetData) {
        const selectFirstRow = sheetJSON_[0];
        const columnValidate = columnsField.every(field => selectFirstRow.hasOwnProperty(field));

    if (columnValidate) {
        const response = await uploadDataToRaces(db, raceId, sheetJSON_)

        return {
            success:true,
            data:response,
            success_msg: "Data has been added in races result."
        }
        } else {
            set.status = 400;
            return {
                error: true,
                error_msg: "Some fields is missing."
            }
        }
    } else {
        set.status = 400;
        return {
            error: true,
            error_msg: "Please re-check your data file."
        }
    }
},{
    body: t.Object({
    excelFile: t.File(),
    raceId: t.String()
})
})




