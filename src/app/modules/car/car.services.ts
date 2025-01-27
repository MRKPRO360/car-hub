import QueryBuilder from '../../builder/QueryBuilder';
import { carSearchableFileds } from './car.constant';
import { ICar } from './car.interface';
import Car from './car.model';

const getAllCarsFromDB = async (query: Record<string, unknown>) => {
  const carsQuery = new QueryBuilder(Car.find(), query)
    .search(carSearchableFileds)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await carsQuery.countTotal();
  const result = await carsQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const getACarFromDB = async (id: string) => {
  return await Car.findById(id);
};

const creatACarInDB = async (payload: ICar) => {
  //APPLY THIS LOGIC
  // IF CAR BRAND AND NAME IS EXISTS AND USER WANTS TO ADD ANOTHER CAR THEN SHOW AN ERROR OR ADD THE STOCK
  return await Car.create(payload);
};

const updateACarInDB = async (id: string, updatedVal: ICar) => {
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
