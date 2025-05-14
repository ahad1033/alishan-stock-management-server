import { EMPLOYEE_ROLE } from "./employee.constant";

export interface IEmployee {
  name: string;
  email?: string;
  phone: string;
  emergencyContact: string;
  position:
    | "accountant"
    | "junior_sales"
    | "senior_sales"
    | "stock_manager"
    | "junior_worker"
    | "senior_worker"
    | "managing_director";
  gender: "male" | "female";
  presentAddress: string;
  permanentAddress: string;
  monthlySalary: number;
  nidNumber: string;
  joiningDate: string;
  dateOfBirht: string;
  isDeleted?: boolean;
}

export type TEmployeeRole = keyof typeof EMPLOYEE_ROLE;
