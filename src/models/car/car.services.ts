import { ICar } from './car.interface';
import Car from './car.model';

const getAllCarsFromDB = () => {};

const getACarFromDB = () => {};

const creatACarInDB = async (carData: ICar) => {
  return await Car.create(carData);
};

const updateACarFromDB = (id: string) => {};

const deleteACarFromDB = (id: string) => {};

export const carServices = {
  creatACarInDB,
  getAllCarsFromDB,
  getACarFromDB,
  updateACarFromDB,
  deleteACarFromDB,
};
