import "dotenv/config";
import sql from "mssql";

const config = {
    server: process.env.SQL_SERVER_HOST, // SQL Server Host from .env
    database: process.env.SQL_SERVER_DATABASE, // Database Name from .env
    options: {
        encrypt: true, // Enable encryption for secure connections
        trustServerCertificate: true, // Trust the server certificate
    },
    authentication: {
        type: "ntlm", // Use NTLM authentication for Windows
        options: {
            userName: process.env.SQL_SERVER_USER, // Windows Username from .env
            password: process.env.SQL_SERVER_PASSWORD, // Windows Password from .env
            domain: process.env.SQL_SERVER_HOST.split("\\")[0], // Extract domain (machine name) from server
        },
    },
    port: parseInt(process.env.SQL_SERVER_PORT, 10) || 1433, // Port from .env or default to 1433
};

const testConnection = async () => {
    try {
        const pool = await sql.connect(config);
        console.log("Connection successful!");
        pool.close(); // Close the connection pool
    } catch (err) {
        console.error("Connection failed:", err.message);
    }
};

testConnection();
