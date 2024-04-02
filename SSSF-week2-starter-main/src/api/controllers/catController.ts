// TODO: create following functions:
// - catGetByUser - get all cats by current user id
// - catGetByBoundingBox - get all cats by bounding box coordinates (getJSON)
// - catPutAdmin - only admin can change cat owner
// - catDeleteAdmin - only admin can delete cat
// - catDelete - only owner can delete cat
// - catPut - only owner can update cat
// - catGet - get cat by id
// - catListGet - get all cats
// - catPost - create new cat
// - use mongodb and mongoose
// - use mongoose schema

import {Request, Response, NextFunction} from 'express';
import {Cat} from '../../types/DBTypes';
import catModel from '../models/catModel';
import CustomError from '../../classes/CustomError';
import {MessageResponse} from '../../types/MessageTypes';
import {UserWithoutPassword} from '../../types/DBTypes';

const catGet = async (
  req: Request<{id: string}, {}, {}, {userId: string}>,
  res: Response<Cat>,
  next: NextFunction
) => {
  try {
    const cat = await catModel.findById(req.params.id).populate('owner');
    if (!cat) {
      throw new CustomError('Cat not found', 404);
    }
    console.log(cat.location);
    console.log(cat.location.coordinates);
    console.log(cat);
    res.json(cat);
  } catch (error) {
    next(error);
  }
};

const catListGet = async (
  req: Request,
  res: Response<Cat[]>,
  next: NextFunction
) => {
  try {
    const cats = await catModel.find().select('-__v').populate({
      path: 'owner',
      select: '-password -__v -role',
    });
    res.json(cats);
  } catch (error) {
    next(error);
  }
};
const catPost = async (
  req: Request<{}, {}, Omit<Cat, 'cat_id'>>,
  res: Response<MessageResponse & {data: Cat}>,
  next: NextFunction
) => {
  try {
    if (!res.locals.user) {
      throw new CustomError('Not authorized', 401);
    }
    req.body.owner = res.locals.user._id;
    const cat = await catModel.create(req.body);
    console.log('cat:', req.body, cat);
    const response = {
      message: 'Cat added',
      data: cat,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const catPut = async (
  req: Request<{id: string}, {}, Cat>,
  res: Response<MessageResponse & {data: Cat}>,
  next: NextFunction
) => {
  try {
    const cat = await catModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!cat) {
      throw new CustomError('Cat not found', 404);
    }
    res.json({message: 'Cat updated', data: cat});
  } catch (error) {
    next(error);
  }
};

const catGetByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cats = await catModel.find({owner: res.locals.user._id});
    res.json(cats);
  } catch (error) {
    next(error);
  }
};

const catGetByBoundingBox = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {topRight, bottomLeft} = req.query;
    const cats = await catModel.find({
      location: {
        $geoWithin: {
          $box: [topRight, bottomLeft],
        },
      },
    });
    res.json(cats);
  } catch (error) {
    next(error);
  }
};

const catPutAdmin = async (
  req: Request<{id: string}, {}, Partial<Cat>>,
  res: Response<MessageResponse & {data: Cat}>,
  next: NextFunction
) => {
  try {
    const cat = await catModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!cat) {
      throw new CustomError('Cat not found', 404);
    }
    res.json({message: 'Cat updated successfully', data: cat});
  } catch (error) {
    next(error);
  }
};

const catDeleteAdmin = async (
  req: Request<{id: string}>,
  res: Response<MessageResponse & {data: Cat}>,
  next: NextFunction
) => {
  try {
    const cat = await catModel.findById(req.params.id);
    if (!cat) {
      throw new CustomError('Cat not found', 404);
    }
    if (res.locals.user.role !== 'admin') {
      throw new CustomError('Not authorized', 401);
    }
    await catModel.findByIdAndDelete(req.params.id);
    res.json({message: 'Cat deleted', data: cat});
  } catch (error) {
    next(error);
  }
};

const catDelete = async (
  req: Request<{id: string}, {}, {}, {userId: string}>,
  res: Response<MessageResponse & {data: Cat}>,
  next: NextFunction
) => {
  try {
    const cat = await catModel.findById(req.params.id);
    if (!cat) {
      throw new CustomError('Cat not found', 404);
    }
    console.log('cat:', cat.owner._id.toString(), res.locals.user._id);
    if (cat.owner._id.toString() !== res.locals.user._id) {
      throw new CustomError('Not authorized', 401);
    }
    await catModel.findByIdAndDelete(req.params.id);
    res.json({message: 'Cat deleted', data: cat});
  } catch (error) {
    next(error);
  }
};

export {
  catGet,
  catListGet,
  catPost,
  catPut,
  catGetByUser,
  catGetByBoundingBox,
  catPutAdmin,
  catDeleteAdmin,
  catDelete,
};
