// Utilidades para respuestas de la API
const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

const sendError = (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString()
  });
};

const sendValidationError = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: 'Validation Error',
    errors: errors.array(),
    timestamp: new Date().toISOString()
  });
};

// Utilidad para paginar resultados
const paginate = (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return {
    limit: parseInt(limit),
    offset: parseInt(offset),
    page: parseInt(page)
  };
};

// Utilidad para formatear fecha
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-UY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Utilidad para sanitizar datos de usuario
const sanitizeUser = (user) => {
  const { password, ...userWithoutPassword } = user.toObject();
  return userWithoutPassword;
};

module.exports = {
  sendSuccess,
  sendError,
  sendValidationError,
  paginate,
  formatDate,
  sanitizeUser
};
