import { Request, Response } from "express";
import { ICollection } from "./collection.interface";
import { CollectionServices } from "./collection.service";

export const createCollection = async (req: Request, res: Response) => {
  try {
    const data = req.body as ICollection;

    const issuedBy = req.user.userId;

    const result = await CollectionServices.createCollection(data, issuedBy);

    res.status(201).json({
      success: true,
      message: "Collection added successfully!",
      data: result,
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

export const getCollection = async (_req: Request, res: Response) => {
  try {
    const result = await CollectionServices.getCollection();
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export const CollectionControllers = {
  getCollection,
  createCollection,
};
