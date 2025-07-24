import sql from "mssql";
import sqlConfig from "../db.js";


export const getAllPatients = async () => {
  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request().query("SELECT * FROM patient");
    return result.recordset;
  } catch (err) {
    throw new Error(err.message);
  }
};
