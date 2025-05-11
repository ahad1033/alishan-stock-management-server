import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

import config from "../../config";

import { TLoginTeacher } from "./auth.interface";
import { Teacher } from "../user/user.model";

const loginTeacher = async (payload: TLoginTeacher) => {
  const isTeacherExist = await Teacher.findOne({ email: payload.email }).select(
    "+password"
  );

  console.log("IS TEACHER EXIST: ", isTeacherExist);

  if (!isTeacherExist) {
    throw new Error("Teacher not found");
  }

  // CHECK IF THE TEACHER IS DELETED
  const isDeleted = isTeacherExist?.isDeleted;

  if (isDeleted) {
    throw new Error("Teacher is deleted");
  }

  console.log("password in payload: ", payload?.password);
  console.log("password in database: ", isTeacherExist?.password);

  // CHECK IF THE PASSWORD IS CORRECT
  const isPasswordCorrect = await bcrypt.compare(
    payload.password,
    isTeacherExist?.password
  );

  if (!isPasswordCorrect) {
    throw new Error("Password is incorrect");
  }

  // CREATE TOKEN
  const accessToken = jwt.sign(
    {
      email: isTeacherExist?.email,
      role: isTeacherExist?.role,
      teacherId: isTeacherExist?.id,
    },
    config.jwt_access_secret as string,
    {
      expiresIn: "10d",
    }
  );

  // CREATE REFRESH TOKEN
  const refreshToken = jwt.sign(
    {
      email: isTeacherExist?.email,
      role: isTeacherExist?.role,
      teacherId: isTeacherExist?.id,
    },
    config.jwt_refresh_secret as string,
    {
      expiresIn: "365d",
    }
  );

  return {
    accessToken,
    refreshToken,
    needsPassowrdChange: isTeacherExist?.needPassChange,
  };
};

const changePassword = async (
  teacher: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  const isTeacherExist = await Teacher.findOne({ email: teacher.email }).select(
    "+password"
  );

  console.log("IS TEACHER EXIST: ", isTeacherExist);

  if (!isTeacherExist) {
    throw new Error("Teacher not found");
  }

  // CHECK IF THE TEACHER IS DELETED
  const isDeleted = isTeacherExist?.isDeleted;

  if (isDeleted) {
    throw new Error("Teacher is deleted");
  }

  // CHECK IF THE PASSWORD IS CORRECT
  const isPasswordCorrect = await bcrypt.compare(
    payload.oldPassword,
    isTeacherExist?.password
  );

  if (!isPasswordCorrect) {
    throw new Error("Password is incorrect");
  }

  // HASH THE NEW PASSWORD
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await Teacher.findOneAndUpdate(
    { id: teacher?.teacherId, role: teacher?.role },
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

    const isTeacherExist = await Teacher.findOne({
      email: decoded.email,
    });

    console.log("IS TEACHER EXIST: ", isTeacherExist);

    if (!isTeacherExist) {
      throw new Error("Teacher not found");
    }

    // CHECK IF THE TEACHER IS DELETED
    const isDeleted = isTeacherExist?.isDeleted;

    if (isDeleted) {
      throw new Error("Teacher is deleted");
    }

    const accessToken = jwt.sign(
      {
        email: isTeacherExist?.email,
        role: isTeacherExist?.role,
        teacherId: isTeacherExist?.id,
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
  loginTeacher,
  refreshToken,
  changePassword,
};
