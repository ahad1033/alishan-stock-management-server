import path from "path";
import dotenv from "dotenv";

interface IConfig {
  port: string;
  database_url: string;
  bcrypt_salt_rounds: string;
  jwt_access_secret: string;
  jwt_access_expires_in: string;
  jwt_refresh_secret: string;
  jwt_refresh_expires_in: string;
  super_admin_password: string;
}

dotenv.config({ path: path.join((process.cwd(), ".env")) });

const config: IConfig = {
  port: process.env.PORT || "5000",
  database_url: process.env.DATABASE_URL || "",
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS || "10",
  jwt_access_secret: process.env.JWT_ACCESS_SECRET || "default-secret",
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN || "10d",
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET || "default-secret",
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || "10d",
  super_admin_password: process.env.SUPER_ADMIN_PASSWORD || "",
};

export default config;
