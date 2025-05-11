export interface IProduct {
  name: String;
  description?: String;
  sku: String;
  price: Number;
  currentStock: Number;
  isDeleted?: Boolean;
}
