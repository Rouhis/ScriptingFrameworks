import {Request, Response, NextFunction} from 'express';
import {Animal, UserWithoutPassword} from '../../types/DBTypes';
import animalModel from '../models/animalModel';
import {MessageResponse} from '../../types/MessageTypes';
import CustomError from '../../classes/CustomError';

const animalListGet = async (
  req: Request,
  res: Response<Animal[]>,
  next: NextFunction
) => {
  try {
    const animals = await animalModel
      .find()
      .select('-__v')
      .populate({
        path: 'species',
        select: '-__v',
        populate: {
          path: 'category',
          select: '-__v',
        },
      });
    res.json(animals);
  } catch (error) {
    next(error);
  }
};

const animalGet = async (
  req: Request<{id: string}, {}, {}>,
  res: Response<Animal>,
  next: NextFunction
) => {
  try {
    const animal = await animalModel.findById(req.params.id);
    if (!animal) {
      throw new Error('No animals found');
    }
    res.json(animal);
  } catch (error) {
    next(error);
  }
};

const animalPost = async (
  req: Request<{}, {}, Omit<Animal, 'animal_id'>>,
  res: Response<MessageResponse & {data: Animal}, {user: UserWithoutPassword}>,
  next: NextFunction
) => {
  try {
    if (!res.locals.user) {
      throw new CustomError('Not authorized', 401);
    }
    req.body.owner = res.locals.user._id;
    const animal = await animalModel.create(req.body);
    const response = {
      message: 'Animal added',
      data: animal,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const animalPut = async (
  req: Request<{id: string}, {}, Omit<Animal, 'animal_id'>>,
  res: Response<MessageResponse & {data: Animal}>,
  next: NextFunction
) => {
  try {
    const animal = await animalModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true}
    );
    if (!animal) {
      throw new Error('No animals found');
    }
    const response = {
      message: 'Animal updated',
      data: animal,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const animalDelete = async (
  req: Request<{id: string}, {}, {}>,
  res: Response<MessageResponse & {data: Animal}, {user: UserWithoutPassword}>,
  next: NextFunction
) => {
  try {
    if (!res.locals.user) {
      throw new CustomError('Not authorized', 401);
    }

    const params = {
      _id: req.params.id,
      owner: res.locals.user._id,
    };

    if (res.locals.user.role === 'admin') {
      delete params.owner;
    }

    const animal = await animalModel.findOneAndDelete(params);

    if (!animal) {
      throw new Error('No animals found');
    }
    const response = {
      message: 'Animal deleted',
      data: animal,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export {animalListGet, animalGet, animalPost, animalPut, animalDelete};
