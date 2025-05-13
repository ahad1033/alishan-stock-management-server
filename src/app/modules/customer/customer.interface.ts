export interface ICustomer {
  name: String;
  shopName: String;
  address?: String;
  phone?: String;
  email?: String;
  totalPurchaseAmount?: Number;
  totalPaidAmount?: Number;
  totalDue?: Number;
  isDeleted?: Boolean;
}
