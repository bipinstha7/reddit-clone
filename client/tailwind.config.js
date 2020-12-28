module.exports = {
  purge: ["./pages/**/*.tsx", "./components/**/*.tsx"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        70: "280px",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
