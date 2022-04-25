
const atlantis = {
  DEFAULT: '#7CD836',
  50: '#F9FDF6',
  100: '#EBF9E1',
  200: '#D0F1B6',
  300: '#B4E98B',
  400: '#98E061',
  500: '#7CD836',
  600: '#63B724',
  700: '#4C8D1B',
  800: '#356213',
  900: '#1E370B',
};

const electricViolet = {
  DEFAULT: '#8800D8',
  50: '#E7BEFF',
  100: '#DEA5FF',
  200: '#CB72FF',
  300: '#B83FFF',
  400: '#A50CFF',
  500: '#8800D8',
  600: '#6800A5',
  700: '#480072',
  800: '#28003F',
  900: '#08000C',
};

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        atlantis,
        electricViolet,
        primary: atlantis,
        secondary: electricViolet,
      },
      fontSize: {
        '3xs': '0.60rem',
        '2xs': '0.70rem',
      },
    },
  },
  variants: ['responsive', 'group-hover', 'disabled', 'hover', 'focus', 'active', 'checked'],
  plugins: [require('tailwind-svg-import')],
}
