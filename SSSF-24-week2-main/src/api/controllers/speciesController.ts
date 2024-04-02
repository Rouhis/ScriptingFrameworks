import {Request, Response, NextFunction} from 'express';
import {Species} from '../../types/DBTypes';
import {MessageResponse} from '../../types/MessageTypes';
import speciesModel from '../models/speciesModel';
import CustomError from '../../classes/CustomError';

const speciesListGet = async (
  req: Request,
  res: Response<Species[]>,
  next: NextFunction
) => {
  try {
    const species = await speciesModel
      .find()
      .select('-__v')
      .populate('category', '-__v');
    res.json(species);
  } catch (error) {
    next(error);
  }
};

const speciesGet = async (
  req: Request<{id: string}, {}, {}>,
  res: Response<Species>,
  next: NextFunction
) => {
  try {
    const species = await speciesModel
      .findById(req.params.id)
      .select('-__v')
      .populate('category', '-__v');
    if (!species) {
      throw new CustomError('No species found', 404);
    }
    res.json(species);
  } catch (error) {
    next(error);
  }
};

const speciesPost = async (
  req: Request<{}, {}, Omit<Species, 'species_id'>>,
  res: Response<MessageResponse & {data: Species}>,
  next: NextFunction
) => {
  try {
    const species = await speciesModel.create(req.body);
    const response = {
      message: 'Species added',
      data: species,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const speciesPut = async (
  req: Request<{id: string}, {}, Omit<Species, 'species_id'>>,
  res: Response<MessageResponse & {data: Species}>,
  next: NextFunction
) => {
  try {
    const species = await speciesModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true}
    );
    if (!species) {
      throw new CustomError('No species found', 404);
    }
    const response = {
      message: 'Species updated',
      data: species,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const speciesDelete = async (
  req: Request<{id: string}, {}, {}>,
  res: Response<MessageResponse & {data: Species}>,
  next: NextFunction
) => {
  try {
    const species = await speciesModel.findByIdAndDelete(req.params.id);
    if (!species) {
      throw new CustomError('No species found', 404);
    }
    const response = {
      message: 'Species deleted',
      data: species,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const speciesGetByBounds = async (
  req: Request<{}, {}, {}, {topRight: string; bottomLeft: string}>,
  res: Response<Species[]>,
  next: NextFunction
) => {
  try {
    // query example: /species/area?topRight=40.73061,-73.935242&bottomLeft=40.71427,-74.00597
    // longitude first, then latitude (opposite of google maps)

    const {topRight, bottomLeft} = req.query;
    const rightCorner = topRight.split(',');
    const leftCorner = bottomLeft.split(',');

    const species = await speciesModel.find({
      location: {
        $geoWithin: {
          $box: [leftCorner, rightCorner],
        },
      },
    });

    res.json(species);
  } catch (error) {
    next(error);
  }
};

export {
  speciesListGet,
  speciesGet,
  speciesPost,
  speciesPut,
  speciesDelete,
  speciesGetByBounds,
};
