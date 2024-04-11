import { Pool } from 'pg'

const ssl = process.env.SSL;

const sslOptions = {
    rejectUnauthorized: true,
    ca: ssl
}

export const db = new Pool({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: 10867,
    ssl: sslOptions
})