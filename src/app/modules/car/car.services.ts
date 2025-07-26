import { JwtPayload } from 'jsonwebtoken';
import QueryBuilder from '../../builder/QueryBuilder';
import { carSearchableFileds } from './car.constant';
import { ICar } from './car.interface';
import Car from './car.model';
import User from '../user/user.model';
import AppError from '../../errors/AppError';

const getAllCarsFromDB = async (query: Record<string, unknown>) => {
  const carsQuery = new QueryBuilder(
    Car.find().populate({ path: 'author', model: 'User' }),
    query
  )
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

const getMyCarsFromDB = async (
  query: Record<string, unknown>,
  userData: JwtPayload
) => {
  const user = await User.findOne({
    email: userData.email,
    role: userData.role,
  });

  if (!user) throw new AppError(403, 'User not found');

  const carsQuery = new QueryBuilder(
    Car.find({ author: user._id }).populate({ path: 'author', model: 'User' }),
    query
  )
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

const creatACarInDB = async (payload: ICar, userData: JwtPayload) => {
  //APPLY THIS LOGIC
  // IF CAR BRAND AND NAME IS EXISTS AND USER WANTS TO ADD ANOTHER CAR THEN SHOW AN ERROR OR ADD THE STOCK

  const user = await User.findOne({
    email: userData.email,
    role: userData.role,
  });

  if (!user) throw new AppError(403, 'User not found');

  return await Car.create({
    ...payload,
    // images: payload.images,
    // coverImage: payload.coverImage,
    author: user._id,
  });
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
  getMyCarsFromDB,
};
