export interface IProduct {
  name: String;
  description?: String;
  sku: String;
  price: Number;
  stock: Number;
  isDeleted?: Boolean;
}
