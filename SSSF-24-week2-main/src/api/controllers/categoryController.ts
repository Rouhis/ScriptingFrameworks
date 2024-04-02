import {Request, Response, NextFunction} from 'express';
import {Category, UserWithoutPassword} from '../../types/DBTypes';
import {MessageResponse} from '../../types/MessageTypes';
import categoryModel from '../models/categoryModel';
import CustomError from '../../classes/CustomError';

const categoryListGet = async (
  req: Request,
  res: Response<Category[]>,
  next: NextFunction
) => {
  try {
    const categories = await categoryModel.find();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

const categoryGet = async (
  req: Request<{id: string}, {}, {}>,
  res: Response<Category>,
  next: NextFunction
) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      throw new CustomError('No categories found', 404);
    }
    res.json(category);
  } catch (error) {
    next(error);
  }
};

const categoryPost = async (
  req: Request<{}, {}, Pick<Category, 'category_name'>>,
  res: Response<MessageResponse & {data: Category}>,
  next: NextFunction
) => {
  try {
    const category = await categoryModel.create(req.body);
    const response = {
      message: 'Category added',
      data: category,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const categoryPut = async (
  req: Request<{id: string}, {}, Pick<Category, 'category_name'>>,
  res: Response<MessageResponse & {data: Category}>,
  next: NextFunction
) => {
  try {
    const category = await categoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true}
    );
    if (!category) {
      throw new CustomError('No categories found', 404);
    }
    const response = {
      message: 'Category updated',
      data: category,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const categoryDelete = async (
  req: Request<{id: string}, {}, {}>,
  res: Response<
    MessageResponse & {data: Category},
    {user: UserWithoutPassword}
  >,
  next: NextFunction
) => {
  try {
    if (res.locals.user.role !== 'admin') {
      throw new CustomError('Not authorized', 401);
    }
    const category = await categoryModel.findByIdAndDelete(req.params.id);
    if (!category) {
      throw new CustomError('No categories found', 404);
    }
    const response = {
      message: 'Category deleted',
      data: category,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export {
  categoryListGet,
  categoryGet,
  categoryPost,
  categoryPut,
  categoryDelete,
};
