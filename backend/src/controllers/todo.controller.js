import { pool } from '../config/db.js';

// Get all todos for authenticated user
export const getTodos = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );

    res.status(200).json({
      success: true,
      todos: result.rows
    });
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching todos.'
    });
  }
};

// Get single todo
export const getTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM todos WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found.'
      });
    }

    // Check ownership
    if (result.rows[0].user_id !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized.'
      });
    }

    res.status(200).json({
      success: true,
      todo: result.rows[0]
    });
  } catch (error) {
    console.error('Get todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
};

// Create new todo
export const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Validation
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Title is required.'
      });
    }

    const result = await pool.query(
      `INSERT INTO todos (user_id, title, description, status) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [req.userId, title.trim(), description?.trim() || '', 'pending']
    );

    res.status(201).json({
      success: true,
      message: 'Todo created successfully.',
      todo: result.rows[0]
    });
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating todo.'
    });
  }
};

// Update todo
export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    // Check if todo exists and belongs to user
    const existingTodo = await pool.query(
      'SELECT * FROM todos WHERE id = $1',
      [id]
    );

    if (existingTodo.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found.'
      });
    }

    // Verify ownership
    if (existingTodo.rows[0].user_id !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only update your own todos.'
      });
    }

    // Validate status if provided
    if (status && !['pending', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "pending" or "completed".'
      });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (title !== undefined && title !== null) {
      updates.push(`title = $${paramCount}`);
      values.push(typeof title === 'string' ? title.trim() : title);
      paramCount++;
    }

    if (description !== undefined && description !== null) {
      updates.push(`description = $${paramCount}`);
      values.push(typeof description === 'string' ? description.trim() : description);
      paramCount++;
    }

    if (status !== undefined) {
      updates.push(`status = $${paramCount}`);
      values.push(status);
      paramCount++;
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    if (updates.length === 1) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update.'
      });
    }

    values.push(id);

    const result = await pool.query(
      `UPDATE todos SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    res.status(200).json({
      success: true,
      message: 'Todo updated successfully.',
      todo: result.rows[0]
    });
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating todo.'
    });
  }
};

// Toggle todo status (Atomic)
export const toggleTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE todos 
       SET status = CASE WHEN status = 'pending' THEN 'completed' ELSE 'pending' END,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found or unauthorized.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Todo status toggled.',
      todo: result.rows[0]
    });
  } catch (error) {
    console.error('Toggle todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while toggling todo.'
    });
  }
};

// Delete todo
export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if todo exists and belongs to user
    const existingTodo = await pool.query(
      'SELECT user_id FROM todos WHERE id = $1',
      [id]
    );

    if (existingTodo.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found.'
      });
    }

    // Verify ownership
    if (existingTodo.rows[0].user_id !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only delete your own todos.'
      });
    }

    await pool.query('DELETE FROM todos WHERE id = $1', [id]);

    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully.'
    });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting todo.'
    });
  }
};
