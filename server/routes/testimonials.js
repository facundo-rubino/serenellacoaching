const express = require('express');
const router = express.Router();

// Datos de testimonios (podrías mover esto a una base de datos más adelante)
const testimonials = [
  {
    id: 1,
    name: 'Euge',
    image: '/assets/img/testimonials/testimonials-1.jpg',
    text: 'Los masajes trascienden la piel y llegan al alma, con ella viví una experiencia única, la recomiendo al 100%. Muy buena dedicación, una energía especial, quede encantada, muy profesional pero sobre todo humana, cálida y positiva.',
    rating: 5,
    service: 'masaje-tui-na'
  },
  {
    id: 2,
    name: 'Pati',
    image: '/assets/img/testimonials/testimonials-2.jpg',
    text: 'Luego de las preguntas que me hizo tome la decisión que buscaba y me siento feliz! Lo que me dijo me sirvió para soltar y animarme. Su impulso fue justo lo que necesitaba',
    rating: 5,
    service: 'coach-ontologico'
  },
  {
    id: 3,
    name: 'Patricio',
    image: '/assets/img/testimonials/testimonials-3.jpg',
    text: 'Lo más destacable ha sido mi nueva capacidad de observarme ... me siento feliz de estar haciéndolo, pues parece que me hubiese dividido en dos personas, una es bastante emocional y apresurada en sacar conclusiones y la otra, la que apareció ahora, es reflexiva, más despegada y bastante más madura.',
    rating: 5,
    service: 'mindfulness-individual'
  },
  {
    id: 4,
    name: 'María',
    image: '/assets/img/testimonials/testimonials-4.jpg',
    text: 'La terapia con Sere fue algo que yo buscaba hace mucho! Encontrarme conmigo misma! Ella me enseño a manejar mi energía, a entenderme, a ver las cosas de una manera diferente. Para mi, fue un antes y un después. Todo lo lindo que ella es te lo transmite! De cada Sesión salía renovada y con mucha paz',
    rating: 5,
    service: 'mindfulness-individual'
  },
  {
    id: 5,
    name: 'Stefi',
    image: '/assets/img/testimonials/testimonials-5.jpg',
    text: 'Me siento super bien, siento que cosas muy buenas me están pasando a nivel del estudio y en mis relaciones. Compañeros y profesores me hacen devoluciones muy lindas y siento que todo está funcionando. Me siento como un imán de buena suerte, que pasan cosas preciosas.',
    rating: 5,
    service: 'coach-ontologico'
  },
  {
    id: 6,
    name: 'Gabi',
    image: '/assets/img/testimonials/testimonials-6.jpg',
    text: 'Me di cuenta que no debemos adelantarnos a los acontecimientos, ni afligirnos por cosas que no podemos cambiar. Que no todos reaccionamos de igual manera frente a una misma situación y que cada uno tendrá sus razones para hacerlo.',
    rating: 5,
    service: 'mindfulness-individual'
  },
  {
    id: 7,
    name: 'Dani',
    image: '/assets/img/testimonials/testimonials-7.jpg',
    text: 'Excelente profesional y persona. La primera vez que alguien me puede aliviar realmente la tensión física y mental. El mejor momento de mi semana era ir a consulta. Busca la excelencia y lo logra, estudiándote y empatizando para un tratamiento único que realmente cambia tu vida.',
    rating: 5,
    service: 'medicina-cuantica'
  },
  {
    id: 8,
    name: 'Anto',
    image: '/assets/img/testimonials/testimonials-8.jpg',
    text: 'Encontré un estado de equilibrio energético y emocional gracias a mis encuentros con Sere. 100% recomendable.',
    rating: 5,
    service: 'reiki'
  },
  {
    id: 9,
    name: 'Pao',
    image: '/assets/img/testimonials/testimonials-9.jpg',
    text: 'Excelente atención. Una maravillosa experiencia que Sere formara parte de mi proceso personal. Brinda herramientas para continuar trabajando y su labor tiene una faseta humana increíble. Realmente recomiendo sus terapias.',
    rating: 5,
    service: 'mindfulness-individual'
  },
  {
    id: 10,
    name: 'Romi',
    image: '/assets/img/testimonials/testimonials-10.jpg',
    text: 'Tuve una excelente experiencia, la cual me aportó mucho conocimiento y ayuda. La Coach es increíble, hace todo con mucho amor. Súper recomiendo.',
    rating: 5,
    service: 'coach-ontologico'
  }
];

// @route   GET /api/testimonials
// @desc    Obtener todos los testimonios
// @access  Public
router.get('/', (req, res) => {
  try {
    const { service, limit } = req.query;
    
    let filteredTestimonials = testimonials;
    
    // Filtrar por servicio si se especifica
    if (service) {
      filteredTestimonials = testimonials.filter(t => t.service === service);
    }
    
    // Limitar cantidad si se especifica
    if (limit) {
      filteredTestimonials = filteredTestimonials.slice(0, parseInt(limit));
    }

    res.json({
      success: true,
      testimonials: filteredTestimonials,
      total: filteredTestimonials.length
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   GET /api/testimonials/:id
// @desc    Obtener un testimonio específico
// @access  Public
router.get('/:id', (req, res) => {
  try {
    const testimonial = testimonials.find(t => t.id === parseInt(req.params.id));
    
    if (!testimonial) {
      return res.status(404).json({ 
        success: false,
        message: 'Testimonio no encontrado' 
      });
    }

    res.json({
      success: true,
      testimonial
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   GET /api/testimonials/service/:service
// @desc    Obtener testimonios por servicio
// @access  Public
router.get('/service/:service', (req, res) => {
  try {
    const serviceTestimonials = testimonials.filter(t => t.service === req.params.service);
    
    res.json({
      success: true,
      testimonials: serviceTestimonials,
      total: serviceTestimonials.length,
      service: req.params.service
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
