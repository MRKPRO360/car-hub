import { ICar } from './car.interface';
import Car from './car.model';

const getAllCarsFromDB = async () => {
  return await Car.find();
};

const getACarFromDB = async (id: string) => {
  return await Car.findById(id);
};

const creatACarInDB = async (payload: ICar) => {
  return await Car.create(payload);
};

const updateACarInDB = async (id: string, updatedVal: ICar) => {
  //FIXME: VALIDATION IS NOT WORKING
  return await Car.findByIdAndUpdate(
    id,
    { $set: updatedVal },
    // Return updated document and run validtators);
    { new: true, runValidators: true, context: 'query ' }
  );
};

const deleteACarFromDB = async (id: string) => {
  return await Car.findByIdAndUpdate(
    id,
    { $set: { isDeleted: true } },
    // Return updated document and run validtators);
    { new: true, runValidators: true, context: 'query ' }
  );
};

export const carServices = {
  creatACarInDB,
  getAllCarsFromDB,
  getACarFromDB,
  updateACarInDB,
  deleteACarFromDB,
};
