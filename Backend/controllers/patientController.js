import { getAllPatients } from "../models/patientModel.js";


export const getPatients = async (req, res) => {
  try {
    const patients = await getAllPatients();
    res.status(200).json(patients);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch patients", error: err.message });
  }
};
