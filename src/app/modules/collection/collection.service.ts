import { Collection } from "./collection.model";
import { ICollection } from "./collection.interface";
import { Customer } from "../customer/customer.model";

const createCollection = async (data: ICollection, issuedBy: string) => {
  const { customerId, amount } = data;

  // Save the collection record
  const newCollection = new Collection(data);
  const savedCollection = await newCollection.save();

  // Update customer's paid and due amounts
  await Customer.findByIdAndUpdate(customerId, {
    $inc: {
      totalPaidAmount: amount,
      totalDue: -amount,
    },
  });

  return savedCollection;
};

const getCollection = async () => {
  const collections = await Collection.find()
    .populate("customerId", "name phone")
    .populate("issuedBy", "name role")
    .sort({ createdAt: -1 });

  return collections;
};

export const CollectionServices = {
  createCollection,
  getCollection,
};
