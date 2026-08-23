import { routes } from "@/lib/routes";

export type ContentCard = {
  slug: string;
  title: string;
  summary: string;
  description: string[];
  image: string;
  imageAlt: string;
  href: string;
  meta?: string;
};

export type Testimonial = {
  name: string;
  quote: string;
  image: string;
  imageAlt: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type ContactInfo = {
  email: string;
  phone: string;
  address: string;
  mapEmbedUrl: string;
  formUrl: string;
  socialLinks: Array<{
    label: string;
    href: string;
  }>;
};

export const site = {
  name: "SerenellaCoaching",
  title: "SerenellaCoaching | Mindfulness y gestión emocional",
  description:
    "Acompañamiento en mindfulness, gestión emocional, terapias energéticas y cursos para encontrar tu mejor versión.",
  analyticsId: "G-SLMJ6ZH9SJ",
};

export const navigation = [
  { label: "Inicio", href: routes.homeSection("inicio") },
  { label: "Terapias", href: routes.homeSection("terapias") },
  { label: "Testimonios", href: routes.homeSection("testimonios") },
  { label: "Cursos", href: routes.homeSection("cursos") },
  { label: "Sobre mi", href: routes.homeSection("sobre-mi") },
  { label: "Contacto", href: routes.homeSection("contacto") },
];

export const contactInfo: ContactInfo = {
  email: "sereosho@gmail.com",
  phone: "+598 99 210299",
  address: "Parque Posadas, Montevideo",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=parque%20posadas&t=&z=13&ie=UTF8&iwloc=&output=embed",
  formUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLSdY-kC30ZfiPspI5lpglbB3f53SpS6VQi6egLRFu42xXVUoXg/viewform",
  socialLinks: [
    { label: "Facebook", href: "https://www.facebook.com/sereosho.sereosho" },
    { label: "Instagram", href: "https://www.instagram.com/serenellacoaching/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/serenelladangelo/" },
  ],
};

export const therapies: ContentCard[] = [
  {
    slug: "cirugia-astral",
    title: "Cirugía astral",
    summary: "Eliminando bloqueos emocionales, mentales y físicos.",
    description: [
      "Es una técnica que nos permite conectar con el campo energético sutil que nos rodea y eliminar cualquier densidad que se haya formado y esté bloqueando el fluir de nuestra energía.",
      "El espacio es llenado con energía vital y sanadora generando una sanación de alto impacto, a nivel mental, emocional y físico. Es una reprogramación a nivel energético, un reiniciar la información recibida del exterior que nos bloquea o impide avanzar.",
    ],
    image: "/assets/img/terapias/astral.jpeg",
    imageAlt: "Cirugía astral",
    href: routes.therapy("cirugia-astral"),
  },
  {
    slug: "mindfulness-individual",
    title: "Mindfulness - Entrenamiento Individual",
    summary: "Atención plena en sesiones de 60 a 90 minutos.",
    description: [
      "Se realizan entrevistas previas para establecer objetivos a corto, medio y largo plazo. La instructora de mindfulness crea un plan de prácticas en equipo y proporciona material adaptado a cada persona.",
      "En las sesiones individuales se enseñan prácticas y se discuten dificultades. Aprenderás a entender tu mente, reconocer patrones, cambiar creencias limitantes y manejar las señales de estrés.",
    ],
    image: "/assets/img/terapias/individual.jpg",
    imageAlt: "Terapia individual de mindfulness",
    href: routes.therapy("mindfulness-individual"),
    meta: "60 a 90 minutos",
  },
  {
    slug: "mindfulness-grupal",
    title: "Mindfulness - Entrenamiento Grupal",
    summary: "Atención plena en sesiones de 60 a 120 minutos.",
    description: [
      "Varias personas realizan prácticas de mindfulness guiadas por un profesional. Las sesiones incluyen diálogos para plantear dudas y compartir experiencias.",
      "Se practica la atención plena a la respiración, sensaciones, emociones y pensamientos, así como la bondad amorosa hacia uno mismo y los demás. Estos talleres entrenan la presencia con apertura y amabilidad.",
    ],
    image: "/assets/img/terapias/grupal.jpg",
    imageAlt: "Entrenamiento grupal de mindfulness",
    href: routes.therapy("mindfulness-grupal"),
    meta: "60 a 120 minutos",
  },
  {
    slug: "coach-ontologico",
    title: "Coach ontológico",
    summary: "Búsqueda interior y despertar de la consciencia.",
    description: [
      "Proceso liberador de las creencias condicionantes que nos limitan. Nos conecta con nuestros recursos y con nuestra capacidad de intervenir, hacernos responsables de cada acción y reacción.",
    ],
    image: "/assets/img/terapias/coach.jpg",
    imageAlt: "Sesión de coaching ontológico",
    href: routes.therapy("coach-ontologico"),
  },
  {
    slug: "masaje-tui-na",
    title: "Masaje tui na",
    summary: "Soltar lo que no me pertenece.",
    description: [
      "Despierta la capacidad sanadora del cuerpo y restablece el equilibrio psico-físico-energético.",
      "Trata dolores musculares y articulares, y es especialmente eficaz en estrés, ansiedad, insomnio y problemas emocionales.",
    ],
    image: "/assets/img/terapias/masaje.jpg",
    imageAlt: "Masaje tui na",
    href: routes.therapy("masaje-tui-na"),
  },
  {
    slug: "reiki",
    title: "Reiki",
    summary: "Recibir energía vital universal.",
    description: [
      "Utiliza energía divina y energía vital presente en el entorno para ayudar a equilibrar y fortalecer el campo energético y, por consecuente, todas las áreas de la vida.",
      "Lograrás vivir con mayor plenitud.",
    ],
    image: "/assets/img/terapias/reiki.jpg",
    imageAlt: "Sesión de reiki",
    href: routes.therapy("reiki"),
  },
  {
    slug: "medicina-cuantica",
    title: "Medicina cuántica",
    summary: "Ser mucho más que un cuerpo físico.",
    description: [
      "La sanación energética armoniza nuestro cuerpo no visible, te da una nueva libertad y más espacio.",
      "El segundo cuerpo es más grande que el primero. Te rodea como un clima sutil, un aura de energía. Te conecta a la experiencia de la Unidad.",
    ],
    image: "/assets/img/terapias/sanacion.jpg",
    imageAlt: "Medicina cuántica y sanación energética",
    href: routes.therapy("medicina-cuantica"),
  },
];

export const courses: ContentCard[] = [
  {
    slug: "mindfulness-estres-ansiedad",
    title: "Curso de mindfulness para reducir el estrés y la ansiedad",
    summary: "Programa de 4 semanas para entrenar atención plena y gestión emocional.",
    meta: "4 semanas",
    description: [
      "Semana 1. ¿Qué es mindfulness? ¿Cómo puedo utilizarlo para nuestra gestión emocional? Entrenamiento de atención plena al momento presente.",
      "Semana 2. Beneficios de mindfulness para el cambio de creencias limitantes. Entrenamiento de atención plena al entorno presente.",
      "Semana 3. Relaciones conscientes, límites saludables, autoestima y empatía. Entrenamiento en atención plena a nuestro espacio y el ajeno.",
      "Semana 4. Cómo entender el estrés, la ansiedad y utilizarlos a nuestro favor. Entrenamiento para entrar en estado de relajación.",
    ],
    image: "/assets/img/terapias/curso1.jpg",
    imageAlt: "Curso de mindfulness para reducir estrés y ansiedad",
    href: routes.course("mindfulness-estres-ansiedad"),
  },
  {
    slug: "mindfulness-manejo-emocional",
    title: "Curso de mindfulness para el manejo emocional",
    summary: "Programa de 8 semanas para fortalecer atención plena y vínculos conscientes.",
    meta: "8 semanas",
    description: [
      "Semana 1. Mindfulness - Gestión Emocional.",
      "Semana 2. Primeros pasos en la atención plena - Fortalezas emocionales.",
      "Semana 3. Crear consciencia de relaciones automáticas.",
      "Semana 4. Relaciones conscientes I.",
      "Semana 5. Relaciones conscientes II.",
      "Semana 6. Empatía y espacio personal sano.",
      "Semana 7. Comunicación saludable.",
      "Semana 8. Cambia el foco, potenciando tus creencias.",
    ],
    image: "/assets/img/terapias/individual.jpg",
    imageAlt: "Curso de mindfulness para manejo emocional",
    href: routes.course("mindfulness-manejo-emocional"),
  },
  {
    slug: "instructorado-mindfulness-gestion-emocional",
    title: "Instructorado mindfulness y gestión emocional",
    summary: "Formación de 12 semanas para profundizar práctica, comunicación y acompañamiento.",
    meta: "12 semanas",
    description: [
      "Semana 1. Mindfulness - Gestión Emocional.",
      "Semana 2. Energía de las emociones.",
      "Semana 3. Crear consciencia de relaciones automáticas.",
      "Semana 4. Relaciones conscientes I.",
      "Semana 5. Relaciones conscientes II.",
      "Semana 6. Empatía y espacio personal sano.",
      "Semana 7. Comunicación. Manifestación.",
      "Semana 8. Comunicación. Manifestación.",
      "Semana 9. Cambia el foco, potenciando tus creencias.",
      "Semana 10. Apreciación de la belleza, curiosidad, vitalidad, perdón.",
      "Semana 11. Aceptación, universalismo, gratitud, armonía, compasión.",
      "Semana 12. Manejo del estrés, estado flow.",
    ],
    image: "/assets/img/terapias/instructorado.jpg",
    imageAlt: "Instructorado mindfulness y gestión emocional",
    href: routes.course("instructorado-mindfulness-gestion-emocional"),
  },
];

export const testimonials: Testimonial[] = [
  {
    name: "Euge",
    image: "/assets/img/testimonials/testimonials-1.jpg",
    imageAlt: "Testimonio de Euge",
    quote:
      "Los masajes trascienden la piel y llegan al alma. Viví una experiencia única, la recomiendo al 100%. Muy buena dedicación, una energía especial, quedé encantada, muy profesional pero sobre todo humana, cálida y positiva.",
  },
  {
    name: "Pati",
    image: "/assets/img/testimonials/testimonials-2.jpg",
    imageAlt: "Testimonio de Pati",
    quote:
      "Luego de las preguntas que me hizo tomé la decisión que buscaba y me siento feliz. Lo que me dijo me sirvió para soltar y animarme. Su impulso fue justo lo que necesitaba.",
  },
  {
    name: "Patricio",
    image: "/assets/img/testimonials/testimonials-3.jpg",
    imageAlt: "Testimonio de Patricio",
    quote:
      "Lo más destacable ha sido mi nueva capacidad de observarme. Me siento feliz de estar haciéndolo, pues parece que me hubiese dividido en dos personas: una emocional y otra reflexiva, más despegada y madura.",
  },
  {
    name: "María",
    image: "/assets/img/testimonials/testimonials-4.jpg",
    imageAlt: "Testimonio de María",
    quote:
      "La terapia con Sere fue algo que yo buscaba hace mucho: encontrarme conmigo misma. Ella me enseñó a manejar mi energía, a entenderme y a ver las cosas de una manera diferente.",
  },
  {
    name: "Stefi",
    image: "/assets/img/testimonials/testimonials-5.jpg",
    imageAlt: "Testimonio de Stefi",
    quote:
      "Me siento súper bien, siento que cosas muy buenas me están pasando a nivel del estudio y en mis relaciones. Quiero agradecer desde el corazón porque me siento muy bien.",
  },
  {
    name: "Gabi",
    image: "/assets/img/testimonials/testimonials-6.jpg",
    imageAlt: "Testimonio de Gabi",
    quote:
      "Me di cuenta que no debemos adelantarnos a los acontecimientos ni afligirnos por cosas que no podemos cambiar. Con un pequeño cambio de actitud de nuestra parte, logramos que el entorno mejore.",
  },
  {
    name: "Dani",
    image: "/assets/img/testimonials/testimonials-7.jpg",
    imageAlt: "Testimonio de Dani",
    quote:
      "Excelente profesional y persona. La primera vez que alguien me puede aliviar realmente la tensión física y mental. Busca la excelencia y lo logra, estudiándote y empatizando para un tratamiento único.",
  },
  {
    name: "Anto",
    image: "/assets/img/testimonials/testimonials-8.jpg",
    imageAlt: "Testimonio de Anto",
    quote:
      "Encontré un estado de equilibrio energético y emocional gracias a mis encuentros con Sere. 100% recomendable.",
  },
  {
    name: "Pao",
    image: "/assets/img/testimonials/testimonials-9.jpg",
    imageAlt: "Testimonio de Pao",
    quote:
      "Excelente atención. Una maravillosa experiencia que Sere formara parte de mi proceso personal. Brinda herramientas para continuar trabajando y su labor tiene una faceta humana increíble.",
  },
  {
    name: "Romi",
    image: "/assets/img/testimonials/testimonials-10.jpg",
    imageAlt: "Testimonio de Romi",
    quote:
      "Tuve una excelente experiencia, la cual me aportó mucho conocimiento y ayuda. La coach es increíble, hace todo con mucho amor. Súper recomiendo.",
  },
];

export const about = {
  title: "Hola! Me llamo Serenella",
  image: "/assets/img/about.jpeg",
  imageAlt: "Retrato de Serenella",
  paragraphs: [
    "Soy un ser en continuo auto descubrimiento y expansión. Comencé con prácticas de meditaciones activas y pasivas desde 2004 que cambiaron mi vida, transformándose en un fluir con la existencia, en un hacerse consciente del movimiento y la calma disfrutando de cada estado que transitamos.",
    "Comencé mi carrera en Alta Performance con el Instructorado en G.R.C (Gimnasia, Respiración y Consciencia) utilizando ejercicios de aeróbica, Pilates, Yoga, Tai Chi y Chi Kung, poniendo vital importancia en los movimientos y cómo el cuerpo responde a la mente y a la emoción. Más tarde, continué con Trascender en la Certificación como Coach Evolutivo, Coach Ontológico y Coach en Programación Neuro-Lingüístico (2010) dando espacio al entendimiento desde la lógica y lo mental.",
    "En el Centro Superior de Estudios Universitarios LA SALLE me fue otorgado el Título Superior Universitario en Mindfulness y Gestión Emocional (2020), que abrió mi capacidad de entendimiento a la unidad, en la estructura que presenta Jon Kabat Zinn.",
    "La vocación de transmitir al mundo la posibilidad de ver la vida a colores, que sea tan disfrutable el negro como el blanco, que las dualidades se unifiquen en la observación de la unidad que somos me mueve a seguir aprendiendo, compartiendo y sintiendo que la vida tiene mucho más para mí, mucho más para ti y mucho más para nosotros.",
    "Si quieres trabajar conmigo, fluiremos juntos en esa dirección.",
  ],
};

export const faqItems: FaqItem[] = [
  {
    question: "¿Qué es Mindfulness?",
    answer:
      "Es la habilidad de mantener la atención plena en el momento presente, es vivir aquí y ahora, sin juicios, sin culpas, sin miedos, sin adelantar acontecimientos, sin poner etiquetas. Es una enseñanza que proviene del budismo y significa intención, atención pura, recepción y presencia del corazón. Es un concepto rico y múltiple: una práctica forma de meditación y también una manera de percibir el mundo, la vida y a uno mismo.",
  },
  {
    question: "¿Cómo se practica?",
    answer:
      "Tan solo hay que prestar atención al momento presente, al aquí y al ahora. El éxito en la práctica consiste en practicar con ecuanimidad, serenidad y amabilidad, no en conseguir nada. Tanto en prácticas formales como informales se escoge algo que nos ancle al presente, como respiración, sensaciones corporales o sonidos, y observamos lo que surja sin emitir juicio.",
  },
  {
    question: "¿Se trata de una terapia?",
    answer:
      "Mindfulness no es una terapia psicológica como tal. Es un programa de psicoeducación que busca dotar a las personas de habilidades y estrategias para enfrentar creencias limitantes, estrés o ansiedad de una manera más eficaz. No sustituye el tratamiento indicado por tu médico.",
  },
  {
    question: "¿Cómo es una sesión individual?",
    answer:
      "Después de una o varias entrevistas previas, cada persona decide objetivos a corto, medio y largo plazo. La instructora analiza la situación actual y se crea en equipo un plan de prácticas. En cada sesión se enseñan una o varias prácticas, se comentan dificultades o dudas y se proporcionan audios para continuar en la vida cotidiana.",
  },
  {
    question: "¿Cómo es una sesión grupal?",
    answer:
      "En una sesión grupal varias personas hacen las prácticas a la vez, guiadas por una profesional experta en mindfulness. Las sesiones suelen durar entre 60 y 120 minutos e incluyen diálogo para plantear dudas y compartir experiencias. No hacen falta conocimientos previos.",
  },
  {
    question: "¿Qué habilidades aprenderé?",
    answer:
      "Aprenderás a entender cómo funciona tu mente, reconocer hábitos y patrones recurrentes, poner distancia de pensamientos y emociones estresantes, detectar señales de estrés y relacionarte con tus sensaciones, pensamientos y emociones con más amabilidad y compasión.",
  },
  {
    question: "¿Qué beneficios obtengo practicando Mindfulness?",
    answer:
      "Seremos más conscientes de nuestras propias experiencias, aceptando lo que viene sin reaccionar automáticamente. Esto entrena respuestas más reflexivas y equilibradas, regula mejor las emociones y ayuda a bajar el nivel de estrés.",
  },
  {
    question: "¿Mindfulness tiene base científica?",
    answer:
      "El programa que hizo historia en occidente fue el de Jon Kabat Zinn en 1979, basado en prácticas contemplativas y orientado a reducción del estrés. Existen numerosos estudios que muestran beneficios en concentración, sueño, inteligencia emocional, relaciones interpersonales, prevención de recaídas y salud mental.",
  },
  {
    question: "¿Cómo son las prácticas?",
    answer:
      "Son variadas y adaptables a la edad y necesidades de cada persona. Consisten en atender a la respiración, sensaciones corporales, emociones y pensamientos. Las prácticas formales reservan un tiempo y postura específicos; las informales llevan la atención a actividades cotidianas.",
  },
  {
    question: "¿Qué cantidad de prácticas son recomendables realizar?",
    answer:
      "Cada ser requiere diferentes tiempos y formas. En las primeras semanas se recomienda usar alguna herramienta unos 10 minutos mínimos diariamente e ir aumentando. Práctica formal, práctica informal y auto observación conforman los tres aspectos fundamentales a entrenar.",
  },
  {
    question: "¿Qué efecto tiene Mindfulness en la salud física, emocional y mental?",
    answer:
      "Ayuda a vivenciar estados con menores niveles de estrés físico y emocional, mejores recursos para afrontar retos y buenas estrategias cognitivas. El objetivo es observar cómo nos relacionamos con nuestros pensamientos, emociones y creencias para potenciar respuestas más saludables.",
  },
];
