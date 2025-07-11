const express = require('express');
const { body, validationResult } = require('express-validator');
const Terapia = require('../models/Terapia');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/terapias
// @desc    Obtener todas las terapias activas
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { categoria, limit, page = 1 } = req.query;
    
    const query = { activa: true };
    
    if (categoria) {
      query.categoria = categoria;
    }

    let terapiasQuery = Terapia.find(query).sort({ orden: 1, createdAt: -1 });
    
    if (limit) {
      const limitNum = parseInt(limit);
      const skip = (page - 1) * limitNum;
      terapiasQuery = terapiasQuery.skip(skip).limit(limitNum);
    }

    const terapias = await terapiasQuery;
    const total = await Terapia.countDocuments(query);

    res.json({
      success: true,
      terapias,
      total,
      page: parseInt(page),
      totalPages: limit ? Math.ceil(total / parseInt(limit)) : 1
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Error del servidor' 
    });
  }
});

// @route   GET /api/terapias/:id
// @desc    Obtener una terapia específica
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const terapia = await Terapia.findById(req.params.id);
    
    if (!terapia) {
      return res.status(404).json({ 
        success: false,
        message: 'Terapia no encontrada' 
      });
    }

    res.json({
      success: true,
      terapia
    });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Terapia no encontrada' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Error del servidor' 
    });
  }
});

// @route   GET /api/terapias/categoria/:categoria
// @desc    Obtener terapias por categoría
// @access  Public
router.get('/categoria/:categoria', async (req, res) => {
  try {
    const terapias = await Terapia.find({ 
      categoria: req.params.categoria, 
      activa: true 
    }).sort({ orden: 1, createdAt: -1 });

    res.json({
      success: true,
      terapias,
      categoria: req.params.categoria,
      total: terapias.length
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Error del servidor' 
    });
  }
});

// @route   POST /api/terapias
// @desc    Crear nueva terapia (admin)
// @access  Private (admin)
router.post('/', [
  auth,
  body('nombre')
    .trim()
    .isLength({ min: 2 })
    .withMessage('El nombre debe tener al menos 2 caracteres'),
  body('descripcion')
    .trim()
    .isLength({ min: 10 })
    .withMessage('La descripción debe tener al menos 10 caracteres'),
  body('categoria')
    .isIn(['individual', 'grupal', 'energia', 'coaching', 'masaje', 'curso'])
    .withMessage('Categoría no válida'),
  body('precio')
    .optional()
    .isNumeric()
    .withMessage('El precio debe ser un número')
], async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Acceso denegado' 
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const terapia = new Terapia(req.body);
    await terapia.save();

    res.status(201).json({
      success: true,
      message: 'Terapia creada exitosamente',
      terapia
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Error del servidor' 
    });
  }
});

// @route   PUT /api/terapias/:id
// @desc    Actualizar terapia (admin)
// @access  Private (admin)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Acceso denegado' 
      });
    }

    const terapia = await Terapia.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!terapia) {
      return res.status(404).json({ 
        success: false,
        message: 'Terapia no encontrada' 
      });
    }

    res.json({
      success: true,
      message: 'Terapia actualizada exitosamente',
      terapia
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Error del servidor' 
    });
  }
});

// @route   DELETE /api/terapias/:id
// @desc    Eliminar terapia (marcar como inactiva)
// @access  Private (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Acceso denegado' 
      });
    }

    const terapia = await Terapia.findByIdAndUpdate(
      req.params.id,
      { activa: false, updatedAt: new Date() },
      { new: true }
    );
    
    if (!terapia) {
      return res.status(404).json({ 
        success: false,
        message: 'Terapia no encontrada' 
      });
    }

    res.json({
      success: true,
      message: 'Terapia desactivada exitosamente'
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Error del servidor' 
    });
  }
});

module.exports = router;
