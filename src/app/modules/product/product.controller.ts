import { Request, Response } from "express";

import { ProductServices } from "./product.service";

const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = req.body;

    const product = await ProductServices.createProduct(productData);

    res.status(201).json({
      success: true,
      message: "Product created successfully!",
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

const editProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;

    const productData = req.body;

    const updatedProduct = await ProductServices.editProduct(
      productId,
      productData
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      data: updatedProduct,
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

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;

    await ProductServices.deleteProduct(productId);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully!",
    });
  } catch (error) {
    let errorMessage = "Something went wrong!";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: errorMessage,
    });
  }
};

const getProducts = async (req: Request, res: Response) => {
  try {
    const classParam = req.query.name as string | undefined;

    const products = await ProductServices.getProducts(classParam);

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully!",
      data: products,
    });
  } catch (error) {
    let errorMessage = "Something went wrong!";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({
      success: false,
      message: "Failed to retrieve products",
      error: errorMessage,
    });
  }
};

const getProductById = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;

    const product = await ProductServices.getProductById(productId);

    res.status(200).json({
      success: true,
      message: "Product retrieved successfully!",
      data: product,
    });
  } catch (error) {
    let errorMessage = "Something went wrong!";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({
      success: false,
      message: "Failed to retrieve product",
      error: errorMessage,
    });
  }
};

export const ProductControllers = {
  editProduct,
  getProducts,
  createProduct,
  deleteProduct,
  getProductById,
};
