import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

import config from "../../config";

import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";

const loginUser = async (payload: TLoginUser) => {
  const isUserExist = await User.findOne({ email: payload.email }).select(
    "+password"
  );

  console.log("IS USER EXIST: ", isUserExist);

  if (!isUserExist) {
    throw new Error("User not found");
  }

  // CHECK IF THE USER IS DELETED
  const isDeleted = isUserExist?.isDeleted;

  if (isDeleted) {
    throw new Error("User has been deleted");
  }

  // CHECK IF THE PASSWORD IS CORRECT
  const isPasswordCorrect = await bcrypt.compare(
    payload.password,
    isUserExist?.password
  );

  if (!isPasswordCorrect) {
    throw new Error("Password is incorrect");
  }

  // CREATE TOKEN
  const accessToken = jwt.sign(
    {
      name: isUserExist?.name,
      email: isUserExist?.email,
      role: isUserExist?.role,
      userId: isUserExist?.id,
    },
    config.jwt_access_secret as string,
    {
      expiresIn: "10d",
    }
  );

  // CREATE REFRESH TOKEN
  const refreshToken = jwt.sign(
    {
      email: isUserExist?.email,
      role: isUserExist?.role,
      userId: isUserExist?.id,
    },
    config.jwt_refresh_secret as string,
    {
      expiresIn: "365d",
    }
  );

  return {
    accessToken,
    refreshToken,
    needsPassowrdChange: isUserExist?.needPassChange,
  };
};

const changePassword = async (
  user: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  const isUserExist = await User.findOne({ email: user.email }).select(
    "+password"
  );

  console.log("IS USER EXIST: ", isUserExist);

  if (!isUserExist) {
    throw new Error("User not found");
  }

  // CHECK IF THE USER IS DELETED
  const isDeleted = isUserExist?.isDeleted;

  if (isDeleted) {
    throw new Error("User has been deleted!");
  }

  // CHECK IF THE PASSWORD IS CORRECT
  const isPasswordCorrect = await bcrypt.compare(
    payload.oldPassword,
    isUserExist?.password
  );

  if (!isPasswordCorrect) {
    throw new Error("Password is incorrect");
  }

  // HASH THE NEW PASSWORD
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await User.findOneAndUpdate(
    { id: user?.userId, role: user?.role },
    {
      password: newHashedPassword,
      needPassChange: false,
      passChangedAt: new Date(),
    }
  );

  return null;
};

const refreshToken = async (refreshToken: string) => {
  // CHECK IF THE TOKEN IS PRESENT
  if (!refreshToken) {
    throw new Error("You are not authorized to access this resource!");
  }

  // CHECK IF THE TOKEN IS VALID
  try {
    const decoded = jwt.verify(
      refreshToken,
      config.jwt_refresh_secret as string
    ) as JwtPayload;
    console.log("DECODED: ", decoded);

    const role = decoded.role;

    const isUserExist = await User.findOne({
      email: decoded.email,
    });

    console.log("IS USER EXIST: ", isUserExist);

    if (!isUserExist) {
      throw new Error("User not found");
    }

    // CHECK IF THE USER IS DELETED
    const isDeleted = isUserExist?.isDeleted;

    if (isDeleted) {
      throw new Error("User has been deleted!");
    }

    const accessToken = jwt.sign(
      {
        email: isUserExist?.email,
        role: isUserExist?.role,
        userId: isUserExist?.id,
      },
      config.jwt_refresh_secret as string,
      { expiresIn: "365d" }
    );

    return {
      accessToken,
    };
  } catch (error) {
    throw new Error("You are not authorized to access this resource!");
  }
};

export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
};
