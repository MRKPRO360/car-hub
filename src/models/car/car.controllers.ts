import { Request, response, Response } from 'express';
import { carServices } from './car.services';
import carValidationSchema from './car.validation';

const getAllCars = async (req: Request, res: Response) => {
  try {
    const result = await carServices.getAllCarsFromDB();

    res.status(200).json({
      message: 'Car retrieved successfully!',
      cars: result.length,
      success: true,
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: 'Something went wrong!',
      success: false,
      error: err,
      //   stack: err.stackTrack
    });
  }
};

const getACar = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;
    console.log(carId);

    const result = await carServices.getACarFromDB(carId);

    res.status(200).json({
      message: 'Car retrieved successfully!',
      success: true,
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: 'Something went wrong!',
      success: false,
      error: err,
      //   stack: err.stackTrack
    });
  }
};

const createACar = async (req: Request, res: Response) => {
  try {
    const { car } = req.body;
    const validatedData = carValidationSchema.parse(car);
    const result = await carServices.creatACarInDB(validatedData);

    res.status(201).json({
      message: 'Car created successfully!',
      success: true,
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: 'Validation failed!',
      success: false,
      error: err,
      //   stack: err.stackTrack
    });
  }
};

const updateACar = () => {};

const deleteACar = () => {};

export const carControllers = {
  getAllCars,
  getACar,
  updateACar,
  deleteACar,
  createACar,
};
