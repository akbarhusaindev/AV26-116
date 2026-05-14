import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI is not defined in environment variables.");
    process.exit(1);
  }

  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully.");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected.");
  });

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB runtime error:", err.message);
  });
}
