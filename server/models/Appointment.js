const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: [true, 'El nombre del cliente es requerido'],
    trim: true
  },
  clientEmail: {
    type: String,
    required: [true, 'El email del cliente es requerido'],
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un email válido']
  },
  clientPhone: {
    type: String,
    required: [true, 'El teléfono del cliente es requerido'],
    trim: true
  },
  serviceType: {
    type: String,
    required: [true, 'El tipo de servicio es requerido'],
    enum: [
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
    ]
  },
  preferredDate: {
    type: Date,
    required: [true, 'La fecha preferida es requerida']
  },
  preferredTime: {
    type: String,
    required: [true, 'La hora preferida es requerida']
  },
  message: {
    type: String,
    trim: true,
    maxlength: [500, 'El mensaje no puede exceder 500 caracteres']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  confirmedDate: {
    type: Date
  },
  confirmedTime: {
    type: String
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índices
appointmentSchema.index({ clientEmail: 1 });
appointmentSchema.index({ preferredDate: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
