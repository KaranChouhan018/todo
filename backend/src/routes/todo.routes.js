import express from 'express';
import {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo
} from '../controllers/todo.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All todo routes require authentication
router.use(authMiddleware);

router.get('/', getTodos);
router.get('/:id', getTodo);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.patch('/:id/toggle', toggleTodo);
router.delete('/:id', deleteTodo);

export default router;
