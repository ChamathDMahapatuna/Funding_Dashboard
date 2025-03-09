import express from "express";
import Funding from "../Models/FundingModel.js";

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
        const funding = await Funding.findById(req.params.id);
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
        const updatedFunding = await Funding.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedFunding) return res.status(404).json({ message: "Funding entry not found" });
        res.status(200).json(updatedFunding);
    } catch (err) {
        next(err);
    }
});

// 🟢 **DELETE: Remove Funding**
router.delete("/:id", async (req, res, next) => {
    try {
        const deletedFunding = await Funding.findByIdAndDelete(req.params.id);
        if (!deletedFunding) return res.status(404).json({ message: "Funding entry not found" });
        res.status(200).json({ message: "Funding entry deleted successfully" });
    } catch (err) {
        next(err);
    }
});

export default router;
