import { ICollection } from "./collection.interface";

import { Collection } from "./collection.model";
import { Balance } from "../balance/balance.model";
import { Customer } from "../customer/customer.model";

const createCollection = async (data: ICollection, issuedBy: string) => {
  try {
    const { customerId, amount } = data;

    // Step 1: Fetch customer
    const customer = await Customer.findById(customerId);

    if (!customer) {
      throw new Error("Customer not found");
    }

    // Step 2: Validate amount doesn't exceed due
    if (amount > customer.totalDue) {
      throw new Error(`Amount exceeds customer's due (${customer.totalDue})`);
    }

    // Step 3: Save the collection
    const newCollection = new Collection({ ...data, issuedBy });
    const savedCollection = await newCollection.save();

    // Step 4: Update customer's paid and due amounts
    await Customer.findByIdAndUpdate(customerId, {
      $inc: {
        totalPaidAmount: amount,
        totalDue: -amount,
      },
    });

    // Step 5: Update balance
    await Balance.updateOne(
      {},
      {
        $inc: {
          totalPaid: amount,
          currentBalance: amount,
          totalUnPaid: -amount,
        },
      }
    );

    return savedCollection;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to create collection: Unknown error");
    }
  }
};

const getCollection = async () => {
  try {
    const collections = await Collection.find()
      .populate("customerId", "name phone")
      .populate("issuedBy", "name role")
      .sort({ createdAt: -1 });

    return collections;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to retrieve collections: Unknown error");
    }
  }
};

export const CollectionServices = {
  createCollection,
  getCollection,
};
