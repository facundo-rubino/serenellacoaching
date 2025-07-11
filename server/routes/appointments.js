const express = require('express');
const { body, validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/appointments
// @desc    Crear nueva cita
// @access  Public
router.post('/', [
  body('clientName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('El nombre debe tener al menos 2 caracteres'),
  body('clientEmail')
    .isEmail()
    .normalizeEmail()
    .withMessage('Por favor ingresa un email válido'),
  body('clientPhone')
    .trim()
    .isLength({ min: 8 })
    .withMessage('El teléfono debe tener al menos 8 dígitos'),
  body('serviceType')
    .isIn([
      'cirugia-astral',
      'mindfulness-individual',
      'mindfulness-grupal',
      'coach-ontologico',
      'masaje-tui-na',
      'reiki',
      'medicina-cuantica',
      'curso-mindfulness-4-semanas',
      'curso-mindfulness-8-semanas',
      'instructorado-mindfulness'
    ])
    .withMessage('Tipo de servicio no válido'),
  body('preferredDate')
    .isISO8601()
    .withMessage('Fecha no válida'),
  body('preferredTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Hora no válida (formato HH:MM)')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const appointment = new Appointment(req.body);
    await appointment.save();

    res.status(201).json({
      message: 'Cita creada exitosamente',
      appointment
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   GET /api/appointments
// @desc    Obtener todas las citas (admin)
// @access  Private (admin)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    const { page = 1, limit = 10, status, startDate, endDate } = req.query;
    
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (startDate && endDate) {
      query.preferredDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const appointments = await Appointment.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Appointment.countDocuments(query);

    res.json({
      appointments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   GET /api/appointments/:id
// @desc    Obtener una cita específica
// @access  Private (admin)
router.get('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    res.json(appointment);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   PUT /api/appointments/:id
// @desc    Actualizar una cita
// @access  Private (admin)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    const { status, confirmedDate, confirmedTime, notes } = req.body;
    
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    if (status) appointment.status = status;
    if (confirmedDate) appointment.confirmedDate = confirmedDate;
    if (confirmedTime) appointment.confirmedTime = confirmedTime;
    if (notes !== undefined) appointment.notes = notes;

    await appointment.save();

    res.json({
      message: 'Cita actualizada exitosamente',
      appointment
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   DELETE /api/appointments/:id
// @desc    Eliminar una cita
// @access  Private (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    await appointment.remove();

    res.json({ message: 'Cita eliminada exitosamente' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
