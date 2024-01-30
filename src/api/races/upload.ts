
import { Elysia, t } from "elysia";
import { PrismaClient } from '@prisma/client'
import {uploadDataToRaces} from '../../model';
import XLSX from "xlsx"

const db = new PrismaClient()


export const appUpload = new Elysia()

.post('/upload', async ({ body: { excelFile, raceId, runx_id }, set  }) => {

    const columnsField = ['rank','gun_time','firstname','lastname','gender','age_group','nationality'];
    var workbook = XLSX.read(await excelFile.arrayBuffer(), { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const sheetJSON_ =  JSON.parse(JSON.stringify(sheetData))
    const selectFirstRow = sheetJSON_[0];
    const columnValidate = columnsField.every(field => selectFirstRow.hasOwnProperty(field));
    if(sheetData) {
    const selectFirstRow = sheetJSON_[0];
    const columnValidate = columnsField.every(field => selectFirstRow.hasOwnProperty(field));

    if (columnValidate) {
        const response = await db.uploadDataToRaces(db, raceId, runx_id , sheetJSON_ )

        return {
            success:true,
            data:response,
            success_msg: "Data has been added in races."
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
    raceId: t.String(),
    runx_id: t.String()
})
})




