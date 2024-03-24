import CustomError from '../../classes/CustomError';
import promisePool from '../../database/db';
import {Animal} from '../../types/DBTypes';
import {RowDataPacket} from 'mysql2';

const getAllAnimals = async (): Promise<Animal[]> => {
  const sql = promisePool.format('SELECT * FROM animals;');
  const [rows] = await promisePool.execute<Animal[] & RowDataPacket[]>(sql);
  console.log(rows);
  return rows;
};

const getAnimalById = async (id: number) => {
  const sql = promisePool.format('SELECT * FROM animals WHERE animal_id = ?', [
    id,
  ]);
  console.log(sql);
  const [rows] = await promisePool.execute<RowDataPacket[] & Animal[]>(sql);
  if (rows.length === 0) {
    throw new CustomError('No animal found', 404);
  }
  return rows[0];
};

export {getAllAnimals, getAnimalById};
