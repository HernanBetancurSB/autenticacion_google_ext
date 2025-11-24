import { Router } from 'express';
import { isAuthenticated, AuthenticatedRequest } from '../middleware/auth.middleware';
import { pool } from '../config/database';

const router = Router();

// Obtener todos los pitches del usuario
router.get('/', isAuthenticated, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT * FROM pitches WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error al obtener pitches:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los pitches',
    });
  }
});

// Crear nuevo pitch
router.post('/', isAuthenticated, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user.id;
    const { title, description, content } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'El título es requerido',
      });
    }

    const result = await pool.query(
      `INSERT INTO pitches (user_id, title, description, content, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING *`,
      [userId, title, description || '', content || '']
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error al crear pitch:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el pitch',
    });
  }
});

// Obtener un pitch específico
router.get('/:id', isAuthenticated, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user.id;
    const pitchId = req.params.id;

    const result = await pool.query(
      'SELECT * FROM pitches WHERE id = $1 AND user_id = $2',
      [pitchId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pitch no encontrado',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error al obtener pitch:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el pitch',
    });
  }
});

// Actualizar pitch
router.put('/:id', isAuthenticated, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user.id;
    const pitchId = req.params.id;
    const { title, description, content } = req.body;

    const result = await pool.query(
      `UPDATE pitches 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           content = COALESCE($3, content),
           updated_at = NOW()
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [title, description, content, pitchId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pitch no encontrado',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error al actualizar pitch:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el pitch',
    });
  }
});

// Eliminar pitch
router.delete('/:id', isAuthenticated, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user.id;
    const pitchId = req.params.id;

    const result = await pool.query(
      'DELETE FROM pitches WHERE id = $1 AND user_id = $2 RETURNING *',
      [pitchId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pitch no encontrado',
      });
    }

    res.json({
      success: true,
      message: 'Pitch eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error al eliminar pitch:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el pitch',
    });
  }
});

export default router;

