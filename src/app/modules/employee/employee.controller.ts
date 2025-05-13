import { Request, Response } from "express";
import { EmployeeServices } from "./employee.service";

// CREATE A EMPLOYEE
const createEmployee = async (req: Request, res: Response) => {
  try {
    const employeeData = req.body;

    const employee = await EmployeeServices.createEmployee(employeeData);

    res.status(201).json({
      success: true,
      message: "Employee created successfully!",
      data: employee,
    });
  } catch (error) {
    let errorMessage = "Something went wrong!";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({
      success: false,
      message: "Failed to create employee",
      error: errorMessage,
    });
  }
};

// GET ALL EMPLOYEE
const getAllEmployee = async (req: Request, res: Response) => {
  try {
    const employees = await EmployeeServices.getAllEmployee();

    res.status(200).json({
      success: true,
      message: "Employees retrieved successfully!",
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve employees",
    });
  }
};

// GET A EMPLOYEE BY ID
const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const employeeId = req.params.id;

    const employee = await EmployeeServices.getEmployeeById(employeeId);
    res.status(200).json({
      success: true,
      message: "Employee retrieved successfully!",
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve employee",
    });
  }
};

// DELETE A EMPLOYEE BY ID
const deleteEmployeeById = async (req: Request, res: Response) => {
  try {
    const employeeId = req.params.id;

    const employee = await EmployeeServices.deleteEmployeeById(employeeId);

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully!",
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete employee",
    });
  }
};

// UPDATE A EMPLOYEE BY ID
const updateEmployeeById = async (req: Request, res: Response) => {
  try {
    const employeeId = req.params.id;

    const updateData = req.body;

    const employee = await EmployeeServices.updateEmployeeById(employeeId, updateData);
    res.status(200).json({
      success: true,
      message: "Employee updated successfully!",
      data: employee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update employee",
    });
  }
};

export const EmployeeControllers = {
  createEmployee,
  getAllEmployee,
  getEmployeeById,
  deleteEmployeeById,
  updateEmployeeById,
};
