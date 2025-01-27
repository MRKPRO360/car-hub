import { Request, Response } from 'express';
import { carServices } from './car.services';

const getAllCars = async (req: Request, res: Response) => {
  try {
    const { query } = req;

    const result = await carServices.getAllCarsFromDB(query);

    res.status(200).json({
      message: 'Car retrieved successfully!',
      success: true,
      meta: result.meta,
      data: result.result,
    });
  } catch (err: any) {
    res.status(404).json({
      message: 'Something went wrong!',
      success: false,
      error: err,
      stack: err.stack,
    });
  }
};

const getACar = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;

    const result = await carServices.getACarFromDB(carId);

    res.status(200).json({
      message: 'Car retrieved successfully!',
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(404).json({
      message: 'Something went wrong!',
      success: false,
      error: err,
      stack: err.stack,
    });
  }
};

const createACar = async (req: Request, res: Response) => {
  try {
    const result = await carServices.creatACarInDB(req.body);

    res.status(201).json({
      message: 'Car created successfully!',
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      message: 'Validation failed!',
      success: false,
      error: err,
      stack: err.stack,
    });
  }
};

const updateACar = async (req: Request, res: Response) => {
  try {
    const updatedVal = req.body;
    const { carId } = req.params;
    const result = await carServices.updateACarInDB(carId, updatedVal);

    // SEND RESPONSE IF THE CAR IS NOT FOUND ON DB
    if (!result) throw new Error("This car doesn't exist on database 💥");

    res.status(201).json({
      message: 'Car updated successfully!',
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      message: 'Car updating failed!',
      success: false,
      error: err,
      stack: err.stack,
    });
  }
};

const deleteACar = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;
    const result = await carServices.deleteACarFromDB(carId);

    // SEND RESPONSE IF THE CAR IS NOT FOUND ON DB
    if (!result) throw new Error("This car doesn't exist on database 💥");

    // STATUS CODE SHOULD BE 204 BUT PUT 200 FOR ASSIGNMENT INSTRUCTION
    res.status(200).json({
      message: 'Car deleted successfully!',
      success: true,
      data: {},
    });
  } catch (err: any) {
    res.status(400).json({
      message: 'Car deletion failed!',
      success: false,
      error: err,
      stack: err.stack,
    });
  }
};

export const carControllers = {
  getAllCars,
  getACar,
  updateACar,
  deleteACar,
  createACar,
};
