import bcrypt from "bcrypt";

import config from "../../config";

import { User } from "./user.model";
import { IUser } from "./user.interface";

const createUser = async (userData: IUser) => {
  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email: userData.email });

    if (existingUser) {
      throw new Error("This email already exists! Please use another email.");
    }
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(
      userData.password,
      parseInt(config.bcrypt_salt_rounds, 10)
    );

    // Replace the plain password with the hashed password
    const userWithHashedPassword = {
      ...userData,
      password: hashedPassword,
    };

    // Create the user
    const user = new User(userWithHashedPassword);
    
    return await user.save();
  } catch (error) {
    throw error;
  }
};

const getAllUser = async () => {
  try {
    // Retrieve all users who are not deleted and whose role is not super_admin
    const users = await User.find({
      isDeleted: false,
      role: { $ne: "super_admin" },
    });

    return users;
  } catch (error) {
    throw new Error("Failed to retrieve users");
  }
};

const getUserById = async (userId: string) => {
  try {
    // Find user by ID and check if not deleted
    const user = await User.findOne({ _id: userId, isDeleted: false });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error("Failed to retrieve user");
  }
};

const deleteUserById = async (userId: string) => {
  try {
    // Find user by ID and check if not deleted
    const user = await User.findOne({ _id: userId, isDeleted: false });
    if (!user) {
      throw new Error("User not found");
    }
    user.isDeleted = true;
    await user.save();
    return user;
  } catch (error) {
    throw new Error("Failed to delete user");
  }
};

const updateUserById = async (userId: string, updateData: Partial<IUser>) => {
  try {
    // Find user by ID and check if not deleted
    const user = await User.findOne({ _id: userId, isDeleted: false });
    if (!user) {
      throw new Error("User not found");
    }
    return await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
  } catch (error) {
    throw new Error("Failed to update user");
  }
};

export const UserServices = {
  createUser,
  getAllUser,
  getUserById,
  deleteUserById,
  updateUserById,
};
