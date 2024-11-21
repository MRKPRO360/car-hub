import { Request, Response } from 'express';
import { carServices } from './car.services';
import carValidationSchema from './car.validation';

const getAllCars = () => {};

const getACar = () => {};

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
