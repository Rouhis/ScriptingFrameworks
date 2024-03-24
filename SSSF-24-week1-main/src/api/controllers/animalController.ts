import {Request, Response, NextFunction} from 'express';
import {Animal} from '../../types/DBTypes';
import {getAllAnimals, getAnimalById} from '../models/animalModel';

const animalListGet = async (
  req: Request,
  res: Response<Animal[]>,
  next: NextFunction
) => {
  try {
    const animals = await getAllAnimals();
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
    const id = Number(req.params.id);
    const category = await getAnimalById(id);
    res.json(category);
  } catch (error) {
    next(error);
  }
};

export {animalListGet, animalGet};
