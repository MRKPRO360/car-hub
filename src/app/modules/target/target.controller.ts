import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { MonthlyTargetService } from './target.service';

const createMonthlyTarget = catchAsync(async (req, res) => {
  const result = await MonthlyTargetService.createMonthlyTargetInDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Monthly target data retrieved successfully!',
    data: result,
  });
});

const getMonthlyTargetByYearAndMonth = catchAsync(async (req, res) => {
  const result =
    await MonthlyTargetService.getMonthlyTargetByYearAndMonthFromDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Monthly target data retrieved successfully!',
    data: result,
  });
});

const updateMonthlyTarget = catchAsync(async (req, res) => {
  const { year, month, targetAmount } = req.body;

  const result = await MonthlyTargetService.updateMonthlyTargetInDB(
    year,
    month,
    targetAmount
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Monthly target updated successfully!',
    data: result,
  });
});

export const TargetControllers = {
  updateMonthlyTarget,
  getMonthlyTargetByYearAndMonth,
  createMonthlyTarget,
};
