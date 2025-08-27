import MonthlyTargetModel from './target.model';

const createMonthlyTargetInDB = async (payload: {
  year: number;
  month: number;
  targetAmount: number;
}) => {
  const { year, month, targetAmount } = payload;

  return await MonthlyTargetModel.create({
    year,
    month,
    targetAmount,
  });
};

const getMonthlyTargetByYearAndMonthFromDB = async (payload: {
  year: number;
  month: number;
}) => {
  const { year, month } = payload;

  return await MonthlyTargetModel.findOne({
    year,
    month,
  });
};

const updateMonthlyTargetInDB = async (
  year: number,
  month: number,
  targetAmount: number
) => {
  return await MonthlyTargetModel.findOneAndUpdate(
    {
      year,
      month,
    },
    {
      targetAmount,
      updatedAt: new Date(),
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
    }
  );
};

export const MonthlyTargetService = {
  getMonthlyTargetByYearAndMonthFromDB,
  updateMonthlyTargetInDB,
  createMonthlyTargetInDB,
};
