import { Request, Response } from "express";
import { CustomerServices } from "./customer.service";

const createCustomer = async (req: Request, res: Response) => {
  try {
    const customerData = req.body;

    const product = await CustomerServices.createCustomer(customerData);

    res.status(201).json({
      success: true,
      message: "Customer created successfully!",
      data: product,
    });
  } catch (error) {
    let errorMessage = "Something went wrong!";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({
      success: false,
      message: errorMessage,
      error: errorMessage,
    });
  }
};

const editCustomer = async (req: Request, res: Response) => {
  try {
    const customerId = req.params.id;

    const customerData = req.body;

    const updatedCustomer = await CustomerServices.editCustomer(
      customerId,
      customerData
    );

    res.status(200).json({
      success: true,
      message: "Customer updated successfully!",
      data: updatedCustomer,
    });
  } catch (error) {
    let errorMessage = "Something went wrong!";

    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: errorMessage,
    });
  }
};

const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const customerId = req.params.id;

    await CustomerServices.deleteCustomer(customerId);

    res.status(200).json({
      success: true,
      message: "Customer deleted successfully!",
    });
  } catch (error) {
    let errorMessage = "Something went wrong!";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({
      success: false,
      message: "Failed to delete customer",
      error: errorMessage,
    });
  }
};

const getCustomers = async (req: Request, res: Response) => {
  try {
    const classParam = req.query.name as string | undefined;

    const customers = await CustomerServices.getCustomers(classParam);

    res.status(200).json({
      success: true,
      message: "Customers retrieved successfully!",
      data: customers,
    });
  } catch (error) {
    let errorMessage = "Something went wrong!";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({
      success: false,
      message: "Failed to retrieve customers",
      error: errorMessage,
    });
  }
};

const getCustomerById = async (req: Request, res: Response) => {
  try {
    const customerId = req.params.id;

    const customer = await CustomerServices.getCustomerById(customerId);

    res.status(200).json({
      success: true,
      message: "Customer retrieved successfully!",
      data: customer,
    });
  } catch (error) {
    let errorMessage = "Something went wrong!";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({
      success: false,
      message: "Failed to retrieve customer",
      error: errorMessage,
    });
  }
};

export const CustomerControllers = {
  editCustomer,
  getCustomers,
  createCustomer,
  deleteCustomer,
  getCustomerById,
};
