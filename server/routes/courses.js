const express = require('express');
const router = express.Router();

// Datos de cursos (podrías mover esto a una base de datos más adelante)
const courses = [
  {
    id: 'mindfulness-4-semanas',
    title: 'Curso de mindfulness para reducir el estrés y la ansiedad',
    duration: '4 semanas',
    description: 'Curso diseñado para aprender mindfulness y gestión emocional en 4 semanas intensivas.',
    price: 150,
    currency: 'USD',
    weeks: [
      {
        week: 1,
        title: '¿Qué es mindfulness? ¿Cómo puedo utilizarlo para nuestra gestión emocional?',
        content: 'Entrenamiento de atención plena al momento presente.'
      },
      {
        week: 2,
        title: 'Beneficios de Mindfulness (atención plena) para el cambio de creencias limitantes',
        content: 'Entrenamiento de atención plena al entorno presente.'
      },
      {
        week: 3,
        title: 'Relaciones conscientes, límites saludables, autoestima y empatía.',
        content: 'Entrenamiento en atención plena a nuestro espacio y el ajeno.'
      },
      {
        week: 4,
        title: 'Cómo entender el estrés, la ansiedad y utilizarlos a nuestro favor.',
        content: 'Entrenamiento para entrar en estado de relajación'
      }
    ]
  },
  {
    id: 'mindfulness-8-semanas',
    title: 'Curso de mindfulness para el manejo emocional',
    duration: '8 semanas',
    description: 'Curso completo de mindfulness y gestión emocional en 8 semanas.',
    price: 280,
    currency: 'USD',
    weeks: [
      { week: 1, title: 'Mindfulness - Gestión Emocional.', content: '' },
      { week: 2, title: 'Primeros pasos en la atención plena - Fortalezas emocionales', content: '' },
      { week: 3, title: 'Crear consciencia de relaciones automáticas', content: '' },
      { week: 4, title: 'Relaciones conscientes I', content: '' },
      { week: 5, title: 'Relaciones conscientes II.', content: '' },
      { week: 6, title: 'Empatía y espacio personal sano.', content: '' },
      { week: 7, title: 'Comunicación saludable.', content: '' },
      { week: 8, title: 'Cambia el foco, potenciando tus creencias.', content: '' }
    ]
  },
  {
    id: 'instructorado-mindfulness',
    title: 'Instructorado mindfulness y gestión emocional',
    duration: '12 semanas',
    description: 'Formación completa para convertirse en instructor de mindfulness y gestión emocional.',
    price: 450,
    currency: 'USD',
    weeks: [
      { week: 1, title: 'Mindfulness - Gestión Emocional.', content: '' },
      { week: 2, title: 'Energía de las emociones.', content: '' },
      { week: 3, title: 'Crear consciencia de relaciones automáticas', content: '' },
      { week: 4, title: 'Relaciones conscientes I', content: '' },
      { week: 5, title: 'Relaciones conscientes II.', content: '' },
      { week: 6, title: 'Empatía y espacio personal sano.', content: '' },
      { week: 7, title: 'Comunicación. Manifestación.', content: '' },
      { week: 8, title: 'Comunicación. Manifestación.', content: '' },
      { week: 9, title: 'Cambia el foco, potenciando tus creencias.', content: '' },
      { week: 10, title: 'Apreciación de la belleza, curiosidad, vitalidad, perdón.', content: '' },
      { week: 11, title: 'Aceptación, universalismo, gratitud, armonía, compasión.', content: '' },
      { week: 12, title: 'Manejo del estrés, estado flow.', content: '' }
    ]
  }
];

// @route   GET /api/courses
// @desc    Obtener todos los cursos
// @access  Public
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      courses: courses.map(course => ({
        id: course.id,
        title: course.title,
        duration: course.duration,
        description: course.description,
        price: course.price,
        currency: course.currency
      }))
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   GET /api/courses/:id
// @desc    Obtener un curso específico
// @access  Public
router.get('/:id', (req, res) => {
  try {
    const course = courses.find(c => c.id === req.params.id);
    
    if (!course) {
      return res.status(404).json({ 
        success: false,
        message: 'Curso no encontrado' 
      });
    }

    res.json({
      success: true,
      course
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
