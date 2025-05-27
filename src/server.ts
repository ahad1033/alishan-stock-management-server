import { Server } from "http";
import mongoose from "mongoose";

import app from "./app";
import config from "./app/config";

import { seedSuperAdmin } from "./app/modules/user/user.seed";
import { seedBalance } from "./app/modules/balance/balance.seed";

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    await seedSuperAdmin();

    await seedBalance();
    server = app.listen(config.port, () => {
      console.log(`app is listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();
