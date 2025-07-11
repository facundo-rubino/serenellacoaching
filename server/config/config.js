// Archivo de configuración centralizada
module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '7d'
  },
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/serenella-coaching'
  },
  server: {
    port: process.env.PORT || 3001,
    env: process.env.NODE_ENV || 'development'
  },
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://tu-dominio.com'] 
      : ['http://localhost:3000', 'http://127.0.0.1:5500', 'http://localhost:5500']
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // máximo 100 requests por ventana
  },
  services: {
    types: [
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
  }
};
