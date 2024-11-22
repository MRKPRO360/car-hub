import Car from '../car/car.model';
import { IOrder } from './order.interface';
import Order from './order.model';

const getAllOrdersFromDB = async () => {
  return await Order.find();
};

const createOrderInDB = async (orderData: IOrder) => {
  const car = await Car.findById(orderData.car);

  // RETURN ERROR IF NO CAR EXISTS
  if (!car) {
    throw new Error('Car not found!');
  }

  // CHECK IF THE CAR IS DELETED

  if (car.isDeleted) throw new Error('You can not order a deleted car!');

  // CHECK IF THE CAR QUANTITY IS AVAILABLE
  if (car.quantity < orderData.quantity)
    throw new Error('Insufficinet stock for this car!');

  // REDUCING CAR QUANTITY
  car.quantity -= orderData.quantity;

  // PRE SAVE MIDDLEWARE WILL SET inStock TO false
  await car.save();
  return await Order.create(orderData);
};

export const orderServices = {
  getAllOrdersFromDB,
  createOrderInDB,
};
