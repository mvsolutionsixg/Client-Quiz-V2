const { Client } = require('pg');
const fs = require('fs');

const connectionString = 'postgresql://postgres:Br%401932002@db.isvjqfwkylxukqvmxgsd.supabase.co:5432/postgres';

const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        console.log('Connecting...');
        await client.connect();
        console.log('Connected!');
        await client.end();
    } catch (err) {
        const errorLog = JSON.stringify(err, Object.getOwnPropertyNames(err), 2);
        console.log(errorLog);
        fs.writeFileSync('db-error.log', errorLog);
    }
}

run();
