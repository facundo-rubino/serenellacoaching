const mongoose = require('mongoose');

const terapiaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la terapia es requerido'],
    trim: true
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es requerida'],
    trim: true
  },
  descripcionCorta: {
    type: String,
    trim: true
  },
  duracion: {
    type: String,
    trim: true
  },
  precio: {
    type: Number,
    min: [0, 'El precio no puede ser negativo']
  },
  moneda: {
    type: String,
    enum: ['USD', 'UYU', 'EUR'],
    default: 'USD'
  },
  imagen: {
    type: String,
    trim: true
  },
  categoria: {
    type: String,
    enum: [
      'individual',
      'grupal', 
      'energia',
      'coaching',
      'masaje',
      'curso'
    ],
    required: [true, 'La categoría es requerida']
  },
  activa: {
    type: Boolean,
    default: true
  },
  orden: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  beneficios: [{
    type: String,
    trim: true
  }],
  queIncluje: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índices
terapiaSchema.index({ nombre: 1 });
terapiaSchema.index({ categoria: 1 });
terapiaSchema.index({ activa: 1 });
terapiaSchema.index({ orden: 1 });

// Middleware para actualizar updatedAt
terapiaSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Terapia', terapiaSchema);
