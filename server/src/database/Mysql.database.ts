import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

function database() {
    const db = {
        createDatabase() {
            const hostCon = mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD || '',
            });

            hostCon.query('CREATE DATABASE IF NOT EXISTS chirper', function (error, result, field) {
                if (error) throw error;
                if (result.affectedRows > 0) {
                    console.log('Database successfully created.');
                }
            });

            hostCon.end((err) => {
                if (err) throw err;
                this.createUserTable();
            });

        },

        createUserTable() {
            const con = this.con();

            con.query('CREATE TABLE IF NOT EXISTS users(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL, email_address VARCHAR(255) NOT NULL, first_name VARCHAR(255) NOT NULL, middle_name VARCHAR(255), last_name VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP )', function (error, result, field) {
                if (error) throw error;
                if (result.affectedRows > 0) {
                    console.log('Users table successfully created.');
                }
            });

            con.end((err) => {
                if (err) throw err;
            });
        },

        con() {
            return mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD || '',
                database: process.env.DB_DATABASE
            });
        }
    }

    return db;
}

const db = database();
export { db };