import mongoose from "mongoose";

interface DBconnection {
  isConnected?: boolean;
}
const db: DBconnection = { isConnected: false };

export const connectDb = async (): Promise<void> => {
  if (db.isConnected) {
    console.log("Database is already connected");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI || "");
    db.isConnected = true;
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};
