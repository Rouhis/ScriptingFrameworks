import express from 'express';
import {
  animalDelete,
  animalGet,
  animalListGet,
  animalPost,
  animalPut,
} from '../controllers/animalController';
import {body, param} from 'express-validator';
import {authenticate} from '../../middlewares';

const router = express.Router();

router
  .route('/')
  .get(animalListGet)
  .post(
    authenticate,
    body('animal_name').isString().escape(),
    body('birthdate').isDate(),
    body('species').isMongoId().notEmpty(),
    animalPost
  );

router
  .route('/:id')
  .get(param('id').isMongoId().notEmpty(), animalGet)
  .put(
    authenticate,
    param('id').isMongoId().notEmpty(),
    body('animal_name').isString().escape().optional(),
    body('birthdate').isDate().optional(),
    body('species').isMongoId().notEmpty().optional(),
    animalPut
  )
  .delete(authenticate, param('id').isMongoId().notEmpty(), animalDelete);

export default router;