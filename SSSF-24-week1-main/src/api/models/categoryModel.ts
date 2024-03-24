import CustomError from '../../classes/CustomError';
import promisePool from '../../database/db';
import {Category} from '../../types/DBTypes';
import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {MessageResponse} from '../../types/MessageTypes';

const getAllCategories = async () => {
  const [rows] = await promisePool.execute<RowDataPacket[] & Category[]>(
    'SELECT * FROM categories'
  );
  if (!rows) {
    throw new Error('No categories found');
  }
  return rows as Category[];
};

const getCategoryById = async (id: number) => {
  const sql = promisePool.format(
    'SELECT * FROM categories WHERE category_id = ?',
    [id]
  );
  console.log(sql);
  const [rows] = await promisePool.execute<RowDataPacket[] & Category[]>(sql);
  if (rows.length === 0) {
    throw new CustomError('No categories found', 404);
  }
  return rows[0];
};

const postCategory = async (
  category: Pick<Category, 'category_name'>
): Promise<MessageResponse> => {
  const sql = promisePool.format(
    'INSERT INTO categories (category_name) VALUES (?);',
    [category.category_name]
  );
  const [headers] = await promisePool.execute<ResultSetHeader>(sql);

  if (headers.affectedRows === 0) {
    throw new CustomError('Category not added', 400);
  }

  return {message: 'Category added'};
};

const putCategory = async (
  id: number,
  category: Pick<Category, 'category_name'>
) => {
  const sql = promisePool.format(
    'UPDATE categories SET category_name = ? WHERE category_id = ?;',
    [category.category_name, id]
  );
  const [headers] = await promisePool.execute<ResultSetHeader>(sql);

  if (headers.affectedRows === 0) {
    throw new CustomError('Category not updated', 400);
  }

  return {message: 'Category updated'};
};

const deleteCategory = async (id: number) => {
  const sql = promisePool.format(
    'DELETE FROM categories WHERE category_id = ?;',
    [id]
  );
  const [headers] = await promisePool.execute<ResultSetHeader>(sql);

  if (headers.affectedRows === 0) {
    throw new CustomError('Category not deleted', 400);
  }

  return {message: 'Category deleted'};
};

export {
  getAllCategories,
  getCategoryById,
  postCategory,
  putCategory,
  deleteCategory,
};
