import { Request, Response } from "express";

import { UserServices } from "./user.service";

// CREATE A USER
const createUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body;

    const user = await UserServices.createUser(userData);

    res.status(201).json({
      success: true,
      message: "User created successfully!",
      data: user,
    });
  } catch (error) {
    let errorMessage = "Something went wrong!";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: errorMessage,
    });
  }
};

// GET ALL USER
const getAllUser = async (req: Request, res: Response) => {
  try {
    const users = await UserServices.getAllUser();

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully!",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve users",
    });
  }
};

// GET A USER BY ID
const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const user = await UserServices.getUserById(userId);
    res.status(200).json({
      success: true,
      message: "User retrieved successfully!",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user",
    });
  }
};

// DELETE A USER BY ID
const deleteUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const user = await UserServices.deleteUserById(userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully!",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

// UPDATE A USER BY ID
const updateUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const updateData = req.body;

    const user = await UserServices.updateUserById(userId, updateData);
    res.status(200).json({
      success: true,
      message: "User updated successfully!",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
};

const resetUserPassword = async (req: Request, res: Response) => {
  try {
    const { userId, password } = req.body;

    const user = await UserServices.resetUserPassword(userId, password);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
      data: user,
    });
  } catch (error) {
    let errorMessage = "Something went wrong!";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({
      success: false,
      message: "Failed to reset password",
      error: errorMessage,
    });
  }
};

export const UserControllers = {
  createUser,
  getAllUser,
  getUserById,
  deleteUserById,
  updateUserById,
  resetUserPassword,
};
