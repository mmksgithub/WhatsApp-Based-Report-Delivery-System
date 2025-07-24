import sql from "mssql";
import sqlConfig from "../db.js";

export const getMessages = async (req, res) => {
  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request().query("SELECT * FROM messages ORDER BY timestamp DESC");
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages", error: err.message });
  }
};
