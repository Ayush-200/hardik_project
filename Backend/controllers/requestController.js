import Request from "../models/Request.js";

// 📌 Citizen: Create a new gathering request
export const createRequest = async (req, res) => {
  try {
    const { gatheringName, type, expectedPeople, date, location } = req.body;

    if (!gatheringName || !type || !expectedPeople || !date || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const request = new Request({
      citizen: req.citizen._id,     // ✅ use _id
      sector: req.citizen.sector,   // ✅ directly from schema
      gatheringName,
      type,
      expectedPeople,
      date,
      location,
    });

    await request.save();
    res.status(201).json({
      message: "Request submitted successfully",
      request,
    });
  } catch (error) {
    console.error("Create Request Error:", error.message);
    return res.status(500).json({ message: "Server error while creating request" });
  }
};

// 📌 Citizen: View their own requests
export const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ citizen: req.citizen._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(requests);
  } catch (error) {
    console.error("Get My Requests Error:", error.message);
    return res.status(500).json({ message: "Server error while fetching requests" });
  }
};


