const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    container: {
      center: true,
      padding: '1rem',
  },
  screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1142px',
  },
  // fontFamily: {
  //     mulish: ['Mulish', 'sans-serif'],
  //     reey: ['reey', 'sans-serif'],
  // },
  // colors: {
  //     transparent: 'transparent',
  //     current: 'currentColor',
  //     white: '#ffffff',
  //     black: '#08111F',
  //     primary: '#ec0000',
  //     secondary: '#ecca00',
  //     // gray: {
  //     //     DEFAULT: '#7780A1',
  //     //     dark: '#1C2331',
  //     // },
  // },
    extend: {
      colors: {
        primary: {
          ...colors.blue,
          DEFAULT: colors.blue[900],
        },
        secondary: '#ecca00',
        white: '#ffffff',
        black: '#08111F',
        card: '#FFFFFF',
        disabled: colors.slate[400],
        default: colors.slate[100],
        accent: {
          ...colors.slate,
          DEFAULT: colors.slate[800],
        },
        warn: {
          ...colors.red,
          DEFAULT: colors.red[600],
        },
      },

      animation: {
        'spin-slow': 'spin 5s linear infinite',
    },
    // typography: ({ theme }) => ({
    //     DEFAULT: {
    //         css: {
    //             color: theme('colors.gray'),
    //             fontSize: '1.125rem',
    //         },
    //     },
    // }),

      fontSize: {
        'xs'  : '0.625rem',
        'sm'  : '0.75rem',
        'md'  : '0.8125rem',
        'base': '0.875rem',
        'lg'  : '1rem',
        'xl'  : '1.125rem',
        '2xl' : '1.25rem',
        '3xl' : '1.5rem',
        '4xl' : '2rem',
        '5xl' : '2.25rem',
        '6xl' : '2.5rem',
        '7xl' : '3rem',
        '8xl' : '4rem',
        '9xl' : '6rem',
        '10xl': '8rem'
    },

      opacity: {
        12: "0.12",
        38: "0.38",
        87: "0.87",
      },
      spacing: {
        13: "3.25rem",
        15: "3.75rem",
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
        30: "7.5rem",
        50: "12.5rem",
        90: "22.5rem",

        // Bigger values
        100: "25rem",
        120: "30rem",
        128: "32rem",
        140: "35rem",
        160: "40rem",
        180: "45rem",
        192: "48rem",
        200: "50rem",
        240: "60rem",
        256: "64rem",
        280: "70rem",
        320: "80rem",
        360: "90rem",
        400: "100rem",
        480: "120rem",

        // Fractional values
        "1/2": "50%",
        "1/3": "33.333333%",
        "2/3": "66.666667%",
        "1/4": "25%",
        "2/4": "50%",
        "3/4": "75%",
      },
      minHeight: ({ theme }) => ({
        ...theme("spacing"),
      }),
      maxHeight: {
        none: "none",
      },
      minWidth: ({ theme }) => ({
        ...theme("spacing"),
        screen: "100vw",
      }),
      maxWidth: ({ theme }) => ({
        ...theme("spacing"),
        screen: "100vw",
      }),
    },
  },
  plugins: [],
};
