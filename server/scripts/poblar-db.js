const mongoose = require('mongoose');
require('dotenv').config();

// Importar modelos
const Terapia = require('./models/Terapia');
const User = require('./models/User');

// Datos de terapias basados en tu frontend
const terapiasData = [
  {
    nombre: 'Cirugía astral',
    descripcionCorta: 'Eliminando bloqueos emocionales, mentales y físicos',
    descripcion: 'Es una técnica que nos permite conectar con el campo energético sutil que nos rodea y eliminar cualquier densidad que se haya formado y esté bloqueando el fluir de nuestra energía. El espacio es llenado con energía vital y sanadora generando una sanación de alto impacto, a nivel mental, emocional y físico. Es una reprogramación a nivel energético, un reiniciar la información recibida del exterior que nos bloquea o impide avanzar.',
    categoria: 'energia',
    imagen: 'assets/img/terapias/astral.jpeg',
    precio: 80,
    moneda: 'USD',
    duracion: '60-90 minutos',
    orden: 1,
    tags: ['energía', 'sanación', 'bloqueos'],
    beneficios: [
      'Eliminación de bloqueos energéticos',
      'Sanación a nivel mental, emocional y físico',
      'Reprogramación energética',
      'Mayor fluidez energética'
    ]
  },
  {
    nombre: 'Mindfulness – Entrenamiento Individual',
    descripcionCorta: 'Atención Plena - Sesión 60 a 90 minutos',
    descripcion: 'Se realizan entrevistas previas para establecer objetivos a corto, medio y largo plazo. La instructora de mindfulness crea un plan de prácticas en equipo y proporciona material adaptado a cada persona. En las sesiones individuales, se enseñan prácticas y se discuten dificultades. Aprenderás a entender tu mente, reconocer patrones y cambiar creencias limitantes. También sabrás cómo manejar las señales de estrés.',
    categoria: 'individual',
    imagen: 'assets/img/terapias/individual.jpg',
    precio: 70,
    moneda: 'USD',
    duracion: '60-90 minutos',
    orden: 2,
    tags: ['mindfulness', 'individual', 'estrés'],
    beneficios: [
      'Entendimiento de la mente',
      'Reconocimiento de patrones',
      'Cambio de creencias limitantes',
      'Manejo del estrés'
    ]
  },
  {
    nombre: 'Mindfulness – Entrenamiento Grupal',
    descripcionCorta: 'Atención Plena - Sesión 60 a 120 minutos',
    descripcion: 'Varias personas realizan prácticas de mindfulness guiadas por un profesional. Las sesiones incluyen diálogos para plantear dudas y compartir experiencias. Se practica la atención plena a la respiración, sensaciones, emociones y pensamientos, así como la bondad amorosa hacia uno mismo y los demás. Estos talleres son un entrenamiento para estar presentes con apertura y amabilidad. A su vez, se comparten propuestas para practicar mindfulness en la vida diaria.',
    categoria: 'grupal',
    imagen: 'assets/img/terapias/grupal.jpg',
    precio: 45,
    moneda: 'USD',
    duracion: '60-120 minutos',
    orden: 3,
    tags: ['mindfulness', 'grupal', 'meditación'],
    beneficios: [
      'Práctica grupal de mindfulness',
      'Compartir experiencias',
      'Atención plena integral',
      'Bondad amorosa'
    ]
  },
  {
    nombre: 'Coach ontológico',
    descripcionCorta: '¡Búsqueda interior y despertar de la consciencia!',
    descripcion: 'Proceso liberador de las creencias condicionantes que nos limitan. Nos conecta con nuestros recursos y con nuestra capacidad de intervenir, y hacernos responsables de cada acción y reacción.',
    categoria: 'coaching',
    imagen: 'assets/img/terapias/coach.jpg',
    precio: 75,
    moneda: 'USD',
    duracion: '60 minutos',
    orden: 4,
    tags: ['coaching', 'ontológico', 'consciencia'],
    beneficios: [
      'Liberación de creencias limitantes',
      'Conexión con recursos internos',
      'Mayor responsabilidad personal',
      'Despertar de consciencia'
    ]
  },
  {
    nombre: 'Masaje tui na',
    descripcionCorta: '¡Soltar lo que no me pertenece!',
    descripcion: 'Despierta la capacidad sanadora del cuerpo, restablece el equilibrio psico-físico-energético. Trata los dolores musculares, articulares y especialmente eficaz en estrés, ansiedad, insomnio y cualquier problema emocional.',
    categoria: 'masaje',
    imagen: 'assets/img/terapias/masaje.jpg',
    precio: 60,
    moneda: 'USD',
    duracion: '60 minutos',
    orden: 5,
    tags: ['masaje', 'tui na', 'relajación'],
    beneficios: [
      'Capacidad sanadora del cuerpo',
      'Equilibrio psico-físico-energético',
      'Alivio de dolores musculares',
      'Reducción de estrés y ansiedad'
    ]
  },
  {
    nombre: 'Reiki',
    descripcionCorta: 'Recibir energía vital universal',
    descripcion: 'Utiliza energía divina y energía vital presente en el entorno, para ayudar a las personas a equilibrar y fortalecer su campo energético y por consecuente todas las áreas de su vida. Lograrás vivir con mayor plenitud.',
    categoria: 'energia',
    imagen: 'assets/img/terapias/reiki.jpg',
    precio: 55,
    moneda: 'USD',
    duracion: '45-60 minutos',
    orden: 6,
    tags: ['reiki', 'energía', 'sanación'],
    beneficios: [
      'Equilibrio energético',
      'Fortalecimiento del campo energético',
      'Mejora en todas las áreas de la vida',
      'Mayor plenitud'
    ]
  },
  {
    nombre: 'Medicina cuántica',
    descripcionCorta: 'Ser mucho más que un cuerpo físico',
    descripcion: 'La Sanación Energética armoniza nuestro cuerpo no visible, te da una nueva libertad, te da más espacio. El segundo cuerpo es más grande que el primero. Te rodea como un clima sutil, un aura de energía. Te conecta a la experiencia de la Unidad.',
    categoria: 'energia',
    imagen: 'assets/img/terapias/sanacion.jpg',
    precio: 90,
    moneda: 'USD',
    duracion: '90 minutos',
    orden: 7,
    tags: ['medicina cuántica', 'sanación energética', 'unidad'],
    beneficios: [
      'Armonización del cuerpo energético',
      'Nueva libertad y espacio',
      'Conexión con la Unidad',
      'Expansión de consciencia'
    ]
  }
];

// Función para poblar la base de datos
async function poblarBaseDatos() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar colección de terapias existente
    await Terapia.deleteMany({});
    console.log('🗑️  Terapias existentes eliminadas');

    // Insertar nuevas terapias
    const terapiasCreadas = await Terapia.insertMany(terapiasData);
    console.log(`✅ ${terapiasCreadas.length} terapias creadas exitosamente`);

    // Crear usuario administrador si no existe
    const adminExists = await User.findOne({ email: 'admin@serenellacoaching.com' });
    
    if (!adminExists) {
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      const adminUser = new User({
        name: 'Administrador',
        email: 'admin@serenellacoaching.com',
        password: hashedPassword,
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('✅ Usuario administrador creado');
      console.log('📧 Email: admin@serenellacoaching.com');
      console.log('🔑 Contraseña: admin123');
    } else {
      console.log('ℹ️  Usuario administrador ya existe');
    }

    console.log('\n🎉 Base de datos poblada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error poblando la base de datos:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📤 Conexión cerrada');
    process.exit();
  }
}

// Ejecutar script
poblarBaseDatos();
