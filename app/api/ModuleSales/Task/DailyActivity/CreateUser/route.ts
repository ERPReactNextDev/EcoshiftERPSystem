import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Ensure TASKFLOW_DB_URL is defined
const Xchire_databaseUrl = process.env.TASKFLOW_DB_URL;
if (!Xchire_databaseUrl) {
    throw new Error("TASKFLOW_DB_URL is not set in the environment variables.");
}

// Create a reusable Neon database connection function
const Xchire_sql = neon(Xchire_databaseUrl);

async function create(data: any) {
    try {
        const {
            referenceid, manager, tsm, companyname, contactperson,
            contactnumber, emailaddress, typeclient, address, area,
            projectname, projectcategory, projecttype, source, typeactivity,
            callback, callstatus, typecall, remarks, quotationnumber,
            quotationamount, sonumber, soamount, startdate, enddate,
            activitystatus, activitynumber, targetquota,
        } = data;

        // Validate required fields
        if (!companyname || !typeclient) {
            throw new Error("Company Name and Type of Client are required.");
        }

        // Fields for activity table
        const Xchire_activityColumns = [
            "referenceid", "manager", "tsm", "companyname", "contactperson",
            "contactnumber", "emailaddress", "typeclient", "address", "area",
            "projectname", "projectcategory", "projecttype", "source", 
            "activitystatus", "activitynumber", "targetquota",
        ];

        const Xchire_activityValues = [
            referenceid, manager, tsm, companyname, contactperson,
            contactnumber, emailaddress, typeclient, address, area,
            projectname, projectcategory, projecttype, source,
            activitystatus || null, activitynumber || null, targetquota || null
        ];

        // Construct and execute the query for activity table
        const Xchire_activityPlaceholders = Xchire_activityValues.map((_, index) => `$${index + 1}`).join(", ");
        const Xchire_activityQuery = `
            INSERT INTO activity (${Xchire_activityColumns.join(", ")}, date_created) 
            VALUES (${Xchire_activityPlaceholders}, CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila') 
            RETURNING *;
        `;

        const Xchire_activityResult = await Xchire_sql(Xchire_activityQuery, Xchire_activityValues);
        const Xchire_insertedActivity = Xchire_activityResult[0];

        if (!Xchire_insertedActivity) {
            throw new Error("Failed to insert into activity table.");
        }

        // Use the returned activitynumber from the inserted activity
        const Xchire_newActivityNumber = Xchire_insertedActivity.activitynumber;

        // Fields for progress table
        const Xchire_progressColumns = [
            ...Xchire_activityColumns, "typeactivity", "callback", "callstatus", "typecall", 
            "remarks", "quotationnumber", "quotationamount", "sonumber", "soamount", 
            "startdate", "enddate",
        ];

        const Xchire_progressValues = [
            ...Xchire_activityValues, typeactivity, callback || null, callstatus || null, typecall || null, 
            remarks || null, quotationnumber || null, quotationamount || null, sonumber || null, 
            soamount || null, startdate || null, enddate || null, 
        ];

        // Update activitynumber in progressValues to use the returned one
        Xchire_progressValues[Xchire_progressColumns.indexOf("activitynumber")] = Xchire_newActivityNumber;

        // Construct and execute the query for progress table
        const Xchire_progressPlaceholders = Xchire_progressValues.map((_, index) => `$${index + 1}`).join(", ");
        const Xchire_progressQuery = `
            INSERT INTO progress (${Xchire_progressColumns.join(", ")}, date_created) 
            VALUES (${Xchire_progressPlaceholders}, CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila') 
            RETURNING *;
        `;

        const Xchire_progressResult = await Xchire_sql(Xchire_progressQuery, Xchire_progressValues);

        if (!Xchire_progressResult[0]) {
            throw new Error("Failed to insert into progress table.");
        }

        return { success: true, activity: Xchire_insertedActivity, progress: Xchire_progressResult[0] };
    } catch (error: any) {
        console.error("Error inserting activity and progress:", error);
        return { success: false, error: error.message || "Failed to add activity and progress." };
    }
}

export async function POST(req: Request) {
    try {
        const Xchire_body = await req.json();

        // Call the addUser function
        const Xchire_result = await create(Xchire_body);

        return NextResponse.json(Xchire_result);
    } catch (Xchire_error: any) {
        console.error("Error in POST /api/addActivity:", Xchire_error);
        return NextResponse.json(
            { success: false, error: Xchire_error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
