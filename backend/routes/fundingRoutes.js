import express from "express";
import Funding from "../Models/FundingModel.js";
import mongoose from "mongoose";

const router = express.Router();

// 🟢 **GET All Fundings**
router.get("/", async (req, res, next) => {
    try {
        const fundings = await Funding.find();
        res.status(200).json(fundings);
    } catch (err) {
        next(err);
    }
});

// 🟢 **GET Single Funding by ID**
router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid funding ID format" });
        }

        const funding = await Funding.findById(id);
        if (!funding) return res.status(404).json({ message: "Funding entry not found" });

        res.status(200).json(funding);
    } catch (err) {
        next(err);
    }
});

// 🟢 **POST: Add New Funding**
router.post("/", async (req, res, next) => {
    try {
        const newFunding = new Funding(req.body);
        const savedFunding = await newFunding.save();
        res.status(201).json(savedFunding);
    } catch (err) {
        next(err);
    }
});

// 🟢 **PUT: Update Funding**
router.put("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid funding ID format" });
        }

        const updatedFunding = await Funding.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedFunding) return res.status(404).json({ message: "Funding entry not found" });

        res.status(200).json(updatedFunding);
    } catch (err) {
        next(err);
    }
});

// 🟢 **DELETE: Remove Funding**
router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid funding ID format" });
        }

        const deletedFunding = await Funding.findByIdAndDelete(id);
        if (!deletedFunding) return res.status(404).json({ message: "Funding entry not found" });

        res.status(200).json({ message: "Funding entry deleted successfully" });
    } catch (err) {
        next(err);
    }
});

export default router;
