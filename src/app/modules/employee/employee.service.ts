import { Employee } from "./employee.model";
import { IEmployee } from "./employee.interface";
import mongoose from "mongoose";

const createEmployee = async (employeeData: IEmployee) => {
  try {
    // Create the employee
    const employee = new Employee(employeeData);

    return await employee.save();
  } catch (error) {
    throw error;
  }
};

const getAllEmployee = async () => {
  try {
    // Retrieve all employee who are not deleted
    const employee = await Employee.find({
      isDeleted: false,
    });

    return employee;
  } catch (error) {
    throw new Error("Failed to retrieve employees");
  }
};

const getEmployeeById = async (employeeId: string) => {
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      throw new Error("Invalid employee ID");
    }

    const result = await Employee.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(employeeId),
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "expenses",
          let: { empId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$employeeId", "$$empId"] },
                    { $eq: ["$category", "salary"] },
                    { $eq: ["$isDeleted", false] },
                  ],
                },
              },
            },
            {
              $sort: { date: -1 },
            },
            {
              $lookup: {
                from: "users", // MongoDB collection name (usually lowercase plural)
                localField: "issuedBy",
                foreignField: "_id",
                as: "issuedByUser",
              },
            },
            {
              $unwind: {
                path: "$issuedByUser",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 0,
                amount: 1,
                date: 1,
                description: 1,
                issuedBy: {
                  _id: "$issuedByUser._id",
                  name: "$issuedByUser.name", // assuming User model has `name`
                },
              },
            },
          ],
          as: "salaryHistory",
        },
      },
    ]);

    const employee = result[0];

    if (!employee) {
      throw new Error("Employee not found");
    }

    return employee;
  } catch (error) {
    throw new Error("Failed to retrieve employee");
  }
};

const deleteEmployeeById = async (employeeId: string) => {
  try {
    // Find employee by ID and check if not deleted
    const employee = await Employee.findOne({
      _id: employeeId,
      isDeleted: false,
    });
    if (!employee) {
      throw new Error("Employee not found");
    }
    employee.isDeleted = true;

    await employee.save();

    return employee;
  } catch (error) {
    throw new Error("Failed to delete employee");
  }
};

const updateEmployeeById = async (
  employeeId: string,
  updateData: Partial<IEmployee>
) => {
  try {
    // Find employee by ID and check if not deleted
    const employee = await Employee.findOne({
      _id: employeeId,
      isDeleted: false,
    });
    if (!employee) {
      throw new Error("User not found");
    }
    return await Employee.findByIdAndUpdate(employeeId, updateData, {
      new: true,
    });
  } catch (error) {
    throw new Error("Failed to update employee");
  }
};

export const EmployeeServices = {
  createEmployee,
  getAllEmployee,
  getEmployeeById,
  deleteEmployeeById,
  updateEmployeeById,
};
