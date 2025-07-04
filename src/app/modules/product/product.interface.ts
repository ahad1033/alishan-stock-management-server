export interface IProduct {
  name: String;
  image?: String;
  description?: String;
  sku: String;
  price: Number;
  stock: Number;
  reserved?: Number;
  isDeleted?: Boolean;
}
