import mongoose from 'mongoose';
import { ICar } from './car.interface';

const carSchema = new mongoose.Schema<ICar>({});

export default carSchema;
