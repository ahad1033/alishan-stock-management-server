import { Request, Response } from "express";

import { AuthService } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.loginUser(req.body);

    const { refreshToken, accessToken, needsPassowrdChange, userRole } = result;

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully!",
      data: { accessToken, needsPassowrdChange, userRole },
    });
  } catch (error) {
    let errorMessage = "Something went wrong!";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({
      success: false,
      message: "Failed to login",
      error: errorMessage,
    });
  }
};

const changePassword = async (req: Request, res: Response) => {
  try {
    const { ...passwordData } = req.body;

    const user = req.user;

    const response = await AuthService.changePassword(user, passwordData);

    res.status(200).json({
      success: true,
      message: "Password is updated successfully!",
      data: response,
    });
  } catch (error) {
    let errorMessage = "Something went wrong!";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({
      success: false,
      message: "Failed to change password",
      error: errorMessage,
    });
  }
};

const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;

    const result = await AuthService.refreshToken(refreshToken);

    res.status(200).json({
      success: true,
      message: "Access token is retrieved successfully!",
      data: result,
    });
  } catch (error) {
    let errorMessage = "Something went wrong!";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({
      success: false,
      message: "Failed to get new access token",
      error: errorMessage,
    });
  }
};

export const AuthController = {
  loginUser,
  refreshToken,
  changePassword,
};
