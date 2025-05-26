import mongoose from "mongoose";

import { Customer } from "./customer.model";
import { ICustomer } from "./customer.interface";
import { Invoice } from "../invoice/invoice.model";

const createCustomer = async (customerData: ICustomer) => {
  try {
    // CREATE CUSTOMER
    const customer = new Customer(customerData);

    return await customer.save();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Failed to create customer: " + error.message);
    } else if (error instanceof mongoose.Error.ValidationError) {
      throw new Error("Validation error: " + error.message);
    } else {
      throw new Error("Failed to create customer: Unknown error");
    }
  }
};

const editCustomer = async (id: string, customerData: Partial<ICustomer>) => {
  try {
    const customer = await Customer.findById(id);

    if (!customer) {
      throw new Error("Product not found");
    }

    // Update customer data
    Object.assign(customer, customerData);

    return await customer.save();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Failed to edit customer: " + error.message);
    } else if (error instanceof mongoose.Error.ValidationError) {
      throw new Error("Validation error: " + error.message);
    } else {
      throw new Error("Failed to edit customer: Unknown error");
    }
  }
};

const deleteCustomer = async (id: string) => {
  try {
    const customer = await Customer.findById(id);

    if (!customer) {
      throw new Error("Customer not found");
    }

    // Soft delete by setting isDelete to true
    customer.isDeleted = true;

    return await customer.save();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Failed to delete customer: " + error.message);
    } else {
      throw new Error("Failed to delete customer: Unknown error");
    }
  }
};

const getCustomers = async (classParam?: string) => {
  try {
    const query: any = { isDeleted: false };
    if (classParam) {
      query.name = classParam;
    }

    return await Customer.find(query);
  } catch (error: unknown) {
    throw new Error(
      "Failed to retrieve customers: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
};

const getCustomerById = async (id: string) => {
  try {
    const customer = await Customer.findById(id);

    if (!customer || customer.isDeleted) {
      throw new Error("Customer not found");
    }

    // Fetch invoices for the customer
    const invoices = await Invoice.find({
      customerId: id,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .populate("issuedBy", "name")
      .populate("products.productId", "name");

    return {
      ...customer.toObject(),
      invoices,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to retrieve customer: Unknown error");
    }
  }
};

export const CustomerServices = {
  editCustomer,
  getCustomers,
  deleteCustomer,
  createCustomer,
  getCustomerById,
};
