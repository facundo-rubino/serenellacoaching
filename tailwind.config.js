/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.html'],
  theme: {
    extend: {
      colors: {
        primary: '#FF7453',
        'primary-hover': '#FF8466',
        'text-dark': '#222222',
        'text-body': '#444444',
        'text-muted': '#777777',
        'text-light': '#aaaaaa',
        'bg-section': '#f6f9fe',
        'bg-footer': '#f1f6fe',
        'section-title-bg': '#F7F7F7',
        'faq-question': '#0d58ba',
        'faq-border': '#d4e5fc',
        'blue-hover': '#3b8af2',
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
        heading: ['Roboto', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      height: {
        'topbar': '40px',
        'header': '86px',
        'header-scrolled': '70px',
      },
      fontSize: {
        'hero-title': ['48px', { lineHeight: '56px', fontWeight: '700' }],
        'hero-title-mobile': ['28px', { lineHeight: '36px', fontWeight: '700' }],
        'hero-subtitle': ['24px', { fontWeight: '400' }],
        'section-badge': ['13px', { letterSpacing: '1px', fontWeight: '700' }],
        'section-heading': ['32px', { fontWeight: '700' }],
        'nav': ['15px', { fontWeight: '600' }],
        'card-title': ['18px', { fontWeight: '700' }],
        'card-meta': ['13px', { fontWeight: '400' }],
        'card-body': ['14px', { lineHeight: '26px' }],
        'faq': ['18px', { lineHeight: '24px' }],
        'btn': ['14px', { letterSpacing: '1px', fontWeight: '500' }],
      },
      boxShadow: {
        'header': '0px 2px 15px rgba(0, 0, 0, 0.1)',
        'card': '0px 2px 15px rgba(16, 110, 234, 0.15)',
        'contact-info': '0 0 30px rgba(214, 215, 216, 0.3)',
        'newsletter': '0px 2px 15px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        'badge': '50px',
      },
      screens: {
        'nav': '992px',
      },
    },
  },
  plugins: [],
}
