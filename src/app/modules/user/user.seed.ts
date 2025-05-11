import bcrypt from "bcrypt";

import config from "../../config";
import { User } from "./user.model";

const superUser = {
  name: "Ahad Ahamed",
  email: "superadmin@alishan.com",
  password: config.super_admin_password,
  role: "super_admin",
  phone: "01636428995",
  needPassChange: false,
};

export const seedSuperAdmin = async () => {
  const isSuperAdminExits = await User.findOne({ role: "super_admin" });

  const hashedPassword = await bcrypt.hash(
    superUser.password,
    Number(config.bcrypt_salt_rounds)
  );

  const superAdminDataWithHashedPass = {
    ...superUser,
    password: hashedPassword,
  };

  if (!isSuperAdminExits) {
    await User.create(superAdminDataWithHashedPass);
    console.log("Super admin created successfully!");
  }
};
