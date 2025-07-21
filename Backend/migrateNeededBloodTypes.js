import mongoose from "mongoose";
import dotenv from "dotenv";
import MedicalCenter from "./models/MedicalCenter.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/your-db-name";

async function migrate() {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const centers = await MedicalCenter.find();

    for (const center of centers) {
        if (
            Array.isArray(center.neededBloodTypes) &&
            center.neededBloodTypes.length > 0 &&
            typeof center.neededBloodTypes[0] === "string"
        ) {
            // Convert array of strings to array of objects with default quantity 1
            center.neededBloodTypes = center.neededBloodTypes.map(type => ({
                type,
                quantity: 1,
            }));
            await center.save();
            console.log(`Migrated center: ${center.name}`);
        }
    }

    console.log("Migration complete.");
    await mongoose.disconnect();
}

migrate().catch(err => {
    console.error(err);
    process.exit(1);
}); 