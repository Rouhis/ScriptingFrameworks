import express from 'express';
import {
  speciesDelete,
  speciesGet,
  speciesGetByBounds,
  speciesListGet,
  speciesPost,
  speciesPut,
} from '../controllers/speciesController';
import {imageFromWikipedia} from '../../middlewares';
import {body, param} from 'express-validator';

const router = express.Router();

router
  .route('/')
  .get(speciesListGet)
  .post(
    imageFromWikipedia,
    body('species_name').isString().escape(),
    body('category').isMongoId().notEmpty(),
    body('image').isURL(),
    speciesPost
  );

router.route('/area').get(speciesGetByBounds);

router
  .route('/:id')
  .get(param('id').isMongoId().notEmpty(), speciesGet)
  .put(
    imageFromWikipedia,
    param('id').isMongoId().notEmpty(),
    body('species_name').isString().escape().optional(),
    body('category').isMongoId().notEmpty().optional(),
    body('image').isURL().optional(),
    speciesPut
  )
  .delete(param('id').isMongoId().notEmpty(), speciesDelete);

export default router;