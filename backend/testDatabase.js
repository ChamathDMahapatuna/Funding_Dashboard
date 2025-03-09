import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file



mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

const FundingSchema = new mongoose.Schema({}, { strict: false });
const Funding = mongoose.model("Funding", FundingSchema, "funding_DB");

async function testDatabase() {
    const fundings = await Funding.find();
    console.log("Database Data:", fundings);
    mongoose.connection.close();
}

testDatabase();
