import { readFile, writeFile } from "fs/promises";
import { createConnection, Connection, RowDataPacket } from "mysql2/promise";
interface DownloadDataConfig {
    connection: Connection;
    tableName: string;
}

const writeToFile=async (fileName: string, data: string) => {
    await writeFile(fileName, data, 'utf8');
}

// use this to download data of a single chunk if new data is added to the table instead of downloading all the chunks again
const exportSingleChunk=async ({ connection, tableName, offset, chunk }: DownloadDataConfig&{ offset: number, chunk: number }) => {
    const dataQuery=`SELECT * FROM ${tableName} where id > ${offset}`;
    try {
        // Execute query and fetch results
        const [dataResult]=await connection.query(dataQuery);

        // Convert data to JSON format, handling special characters
        const jsonData=JSON.stringify(dataResult, null, 2);

        // Write JSON data to a file
        const filename=`./data/shesh/${tableName}_chunk${chunk+1}.json`;
        await writeToFile(filename, jsonData);
        console.log(`Data for table '${tableName}' chunk ${chunk+1} exported to '${filename}'`);
    } catch (error) {
        console.error(`Error exporting data for table '${tableName}' chunk ${chunk+1}:`, error);
    }
}

const dbTableDataToJSONChunked=async ({ connection, tableName, chunkSize }: DownloadDataConfig&{ chunkSize?: number }) => {
    chunkSize=chunkSize||100;

    try {
        // Get the total number of rows in the table
        const totalRowsQuery=`SELECT COUNT(*) FROM ${tableName}`;
        const [totalRowsResult]=await connection.query(totalRowsQuery);
        const totalRows=(totalRowsResult as RowDataPacket[])[0]!['COUNT(*)'];

        // Calculate the number of chunks
        const numChunks=Math.ceil(totalRows/chunkSize);

        // Iterate through each chunk
        for (let chunk=0; chunk<numChunks; chunk++) {
            const offset=chunk*chunkSize;

            // Construct query to retrieve data for this chunk
            const dataQuery=`SELECT * FROM ${tableName} LIMIT ${offset}, ${chunkSize}`;
            // const dataQuery=`SELECT * FROM ${tableName} where id > ${offset}`;

            try {
                // Execute query and fetch results
                const [dataResult]=await connection.query(dataQuery);

                // Convert data to JSON format, handling special characters
                const jsonData=JSON.stringify(dataResult, null, 2);

                // Write JSON data to a file
                const filename=`./data/shesh/${tableName}_chunk${chunk+1}.json`;
                await writeToFile(filename, jsonData);
                console.log(`Data for table '${tableName}' chunk ${chunk+1} exported to '${filename}'`);
            } catch (error) {
                console.error(`Error exporting data for table '${tableName}' chunk ${chunk+1}:`, error);
            }
        }
    } catch (error) {
        console.error('Error connecting to database:', error);
    } finally {
        await connection.end();
    }

}

const dbTableDataToJSON=async ({ connection, tableName }: DownloadDataConfig) => {
    const dataQuery=`SELECT * FROM ${tableName}`;

    try {
        const [dataResult]=await connection.query(dataQuery);

        // Convert data to JSON format, handling special characters
        const jsonData=JSON.stringify(dataResult, null, 2);
        const filename=`./data/${tableName}.json`;
        await writeToFile(filename, jsonData);
        console.log(`Data for table '${tableName}' exported to '${filename}'`);
    } catch (error) {
        console.error(`Error exporting data for table '${tableName}'`, error);
    }
}

export const downloadData=async () => {

    const connection=await createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: {
            ca: await readFile("./DigiCertGlobalRootCA.crt.pem")
        }
    });
    const tables=["account_emailaddress", "auth_user", "mac_attendance_record"];
    const chunkedTables=["shesh_attendancereport"]; // data is too large, hence needs to be downloaded in chunks

    for (const table of tables) {
        await dbTableDataToJSON({ connection, tableName: table });
    }

    for (const table of chunkedTables) {
        await dbTableDataToJSONChunked({ connection, tableName: table, chunkSize: 100 });
    }
}

export default downloadData;