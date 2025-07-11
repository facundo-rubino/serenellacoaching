// Configuración de la API
const API_BASE_URL = 'http://localhost:3001/api';

// Clase para manejar llamadas a la API
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  // Método genérico para hacer requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    // Agregar token si existe
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en la API');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Métodos para autenticación
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (response.token) {
      this.token = response.token;
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  }

  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });

    if (response.token) {
      this.token = response.token;
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  }

  async logout() {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Suscripción de newsletter
  async subscribe(subscriptionData) {
    return await this.request('/auth/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscriptionData)
    });
  }

  // Métodos para citas
  async createAppointment(appointmentData) {
    return await this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData)
    });
  }

  async getAppointments(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/appointments?${queryString}`);
  }

  async updateAppointment(id, updateData) {
    return await this.request(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  }

  // Métodos para contacto
  async sendContactMessage(contactData) {
    return await this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData)
    });
  }

  async getContactMessages(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/contact?${queryString}`);
  }

  // Métodos para cursos
  async getCourses() {
    return await this.request('/courses');
  }

  async getCourse(id) {
    return await this.request(`/courses/${id}`);
  }

  // Métodos para testimonios
  async getTestimonials(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/testimonials?${queryString}`);
  }

  // Verificar salud del servidor
  async checkHealth() {
    return await this.request('/health');
  }
}

// Crear instancia global
const api = new ApiService();

// Funciones de utilidad para el frontend
const utils = {
  // Formatear fecha para mostrar en el frontend
  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('es-UY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  // Formatear hora
  formatTime(timeString) {
    return timeString;
  },

  // Validar email
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Mostrar notificación (usando SweetAlert si está disponible)
  showNotification(message, type = 'success') {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: type === 'success' ? '¡Éxito!' : 'Error',
        text: message,
        icon: type,
        timer: 3000,
        showConfirmButton: false
      });
    } else {
      alert(message);
    }
  },

  // Manejar errores de la API
  handleApiError(error) {
    console.error('Error de API:', error);
    this.showNotification(error.message || 'Error desconocido', 'error');
  }
};

// Ejemplo de uso para el formulario de contacto
async function submitContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const formData = new FormData(form);
  const contactData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    subject: formData.get('subject'),
    message: formData.get('message')
  };

  try {
    const response = await api.sendContactMessage(contactData);
    utils.showNotification('¡Mensaje enviado exitosamente!');
    form.reset();
  } catch (error) {
    utils.handleApiError(error);
  }
}

// Ejemplo de uso para solicitar una cita
async function submitAppointmentForm() {
  const form = document.getElementById('appointmentForm');
  if (!form) return;

  const formData = new FormData(form);
  const appointmentData = {
    clientName: formData.get('clientName'),
    clientEmail: formData.get('clientEmail'),
    clientPhone: formData.get('clientPhone'),
    serviceType: formData.get('serviceType'),
    preferredDate: formData.get('preferredDate'),
    preferredTime: formData.get('preferredTime'),
    message: formData.get('message')
  };

  try {
    const response = await api.createAppointment(appointmentData);
    utils.showNotification('¡Cita solicitada exitosamente!');
    form.reset();
  } catch (error) {
    utils.handleApiError(error);
  }
}

// Ejemplo de uso para suscripción de newsletter
async function submitSubscriptionForm() {
  const form = document.getElementById('subscriptionForm');
  if (!form) return;

  const formData = new FormData(form);
  const subscriptionData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    birthDate: formData.get('birthDate')
  };

  // Validaciones básicas
  if (!subscriptionData.name || subscriptionData.name.trim().length < 2) {
    utils.showNotification('Por favor ingresa un nombre válido', 'error');
    return;
  }

  if (!subscriptionData.email || !utils.isValidEmail(subscriptionData.email)) {
    utils.showNotification('Por favor ingresa un email válido', 'error');
    return;
  }

  try {
    const response = await api.subscribe(subscriptionData);
    utils.showNotification('¡Suscripción exitosa! Te mantendremos informado.');
    form.reset();
  } catch (error) {
    utils.handleApiError(error);
  }
}

// Cargar testimonios dinámicamente
async function loadTestimonials(service = null) {
  try {
    const params = service ? { service } : {};
    const response = await api.getTestimonials(params);
    
    const testimonialsContainer = document.getElementById('testimonials-container');
    if (!testimonialsContainer) return;

    testimonialsContainer.innerHTML = response.testimonials.map(testimonial => `
      <div class="swiper-slide">
        <div class="testimonial-item">
          <img src="${testimonial.image}" class="testimonial-img" alt="${testimonial.name}">
          <h3>${testimonial.name}</h3>
          <p>
            <i class="bx bxs-quote-alt-left quote-icon-left"></i>
            ${testimonial.text}
            <i class="bx bxs-quote-alt-right quote-icon-right"></i>
          </p>
        </div>
      </div>
    `).join('');

  } catch (error) {
    console.error('Error cargando testimonios:', error);
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Cargar testimonios
  loadTestimonials();

  // Verificar salud del servidor
  api.checkHealth()
    .then(() => console.log('✅ Conexión con API establecida'))
    .catch(() => console.log('❌ Error conectando con API'));
});

// Exportar para uso global
window.api = api;
window.utils = utils;
