import express from "express";
import authCitizen from '../middleware/authCitizen.js';
import { createRequest, getMyRequests } from "../controllers/requestController.js";
const router = express.Router();
router.post("/create", authCitizen, createRequest);
router.get("/my-requests", authCitizen, getMyRequests);

export default router;
    