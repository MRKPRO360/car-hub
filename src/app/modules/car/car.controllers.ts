import { Request, Response } from 'express';
import { carServices } from './car.services';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';

const getAllCars = catchAsync(async (req: Request, res: Response) => {
  const { query } = req;

  const result = await carServices.getAllCarsFromDB(query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Car retrieved successfully!',
    data: result.result,
    meta: result.meta,
  });
});
const getMyCars = catchAsync(async (req: Request, res: Response) => {
  const { query } = req;
  const user = req.user;

  const result = await carServices.getMyCarsFromDB(query, user!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Cars retrieved successfully!',
    data: result.result,
    meta: result.meta,
  });
});

const getACar = catchAsync(async (req: Request, res: Response) => {
  const { carId } = req.params;

  const result = await carServices.getACarFromDB(carId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Car retrieved successfully!',
    data: result,
  });
});

const createACar = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const result = await carServices.creatACarInDB(req.file, req.body, user!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Car created successfully!',
    data: result,
  });
});

const updateACar = catchAsync(async (req: Request, res: Response) => {
  const updatedVal = req.body;
  const { carId } = req.params;
  const result = await carServices.updateACarInDB(carId, updatedVal);

  // SEND RESPONSE IF THE CAR IS NOT FOUND ON DB
  if (!result) throw new Error("This car doesn't exist on database 💥");

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Car updated successfully!',
    data: result,
  });
});

const deleteACar = catchAsync(async (req: Request, res: Response) => {
  const { carId } = req.params;
  const result = await carServices.deleteACarFromDB(carId);

  // SEND RESPONSE IF THE CAR IS NOT FOUND ON DB
  if (!result) throw new Error("This car doesn't exist on database 💥");

  sendResponse(res, {
    statusCode: 204,
    success: true,
    message: 'Car deleted successfully!',
    data: {},
  });
});

export const carControllers = {
  getAllCars,
  getACar,
  getMyCars,
  updateACar,
  deleteACar,
  createACar,
};
