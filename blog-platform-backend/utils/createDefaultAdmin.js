import bcrypt from "bcryptjs";
import { Admin } from "../models/admin.model.js";

export const createDefaultAdmin = async () => {
  try {
    const adminCount = await Admin.count();

    if (adminCount > 0) {
      console.log("✅ Admin already exists, skipping default admin creation");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      process.env.DEFAULT_ADMIN_PASSWORD,
      10
    );

    await Admin.create({
      username: process.env.DEFAULT_ADMIN_USERNAME,
      email: process.env.DEFAULT_ADMIN_EMAIL,
      password: hashedPassword,
    });

    console.log("✅ Default admin created successfully");
  } catch (err) {
    console.error("❌ Failed to create default admin:", err.message);
  }
};
