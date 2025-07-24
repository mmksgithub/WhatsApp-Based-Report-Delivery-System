import sql from "mssql";

const sqlConfig = {
  server: process.env.SQL_SERVER_HOST,
  database: process.env.SQL_SERVER_DATABASE,
  port: parseInt(process.env.SQL_SERVER_PORT, 10) || 1433,
  user: process.env.SQL_SERVER_USER , 
  password: process.env.SQL_SERVER_PASSWORD, 
  options: {
    encrypt: true, // Enable encryption
    trustServerCertificate: true, // Trust the server certificate
  },
};


const ConnectDB = async () => {
  try {
    const pool = await sql.connect(sqlConfig);
    console.log("SQL Server Connected Successfully!");
    return pool;
  } catch (err) {
    console.error("Database Connection Failed:", err.message);
    process.exit(1);
  }
};

export default ConnectDB;
