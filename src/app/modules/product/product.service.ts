import mongoose from "mongoose";

import { Product } from "./product.model";
import { IProduct } from "./product.interface";

const createProduct = async (productData: IProduct) => {
  try {
    // Check if products sku already exixt in database
    if (productData.sku) {
      // Check if the product sku already exists in the database
      const existingSku = await Product.findOne({
        sku: productData.sku,
      });
      if (existingSku) {
        throw new Error("SKU already exists");
      }
    }

    // CREATE PRODUCT
    const product = new Product(productData);

    return await product.save();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Failed to create product: " + error.message);
    } else if (error instanceof mongoose.Error.ValidationError) {
      throw new Error("Validation error: " + error.message);
    } else {
      throw new Error("Failed to create product: Unknown error");
    }
  }
};

const editProduct = async (id: string, productData: Partial<IProduct>) => {
  try {
    const product = await Product.findById(id);

    if (!product) {
      throw new Error("Product not found");
    }

    // Update product data
    Object.assign(product, productData);

    return await product.save();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Failed to edit product: " + error.message);
    } else if (error instanceof mongoose.Error.ValidationError) {
      throw new Error("Validation error: " + error.message);
    } else {
      throw new Error("Failed to edit product: Unknown error");
    }
  }
};

const deleteProduct = async (id: string) => {
  try {
    const product = await Product.findById(id);

    if (!product) {
      throw new Error("Product not found");
    }

    // Soft delete by setting isDelete to true
    product.isDeleted = true;

    return await product.save();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Failed to delete product: " + error.message);
    } else {
      throw new Error("Failed to delete product: Unknown error");
    }
  }
};

const getProducts = async (classParam?: string) => {
  try {
    const query: any = { isDeleted: false };
    if (classParam) {
      query.name = classParam;
    }

    return await Product.find(query);
  } catch (error: unknown) {
    throw new Error(
      "Failed to retrieve products: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
};

const getProductById = async (id: string) => {
  try {
    const product = await Product.findById(id);

    if (!product || product.isDeleted) {
      throw new Error("Product not found");
    }

    return product;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Failed to retrieve product: " + error.message);
    } else {
      throw new Error("Failed to retrieve product: Unknown error");
    }
  }
};

export const ProductServices = {
  editProduct,
  getProducts,
  deleteProduct,
  createProduct,
  getProductById,
};
