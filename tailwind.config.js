const forms = require("@tailwindcss/forms");
const typography = require("@tailwindcss/typography");

module.exports = {
  mode: "jit",
  purge: ["./src/**/*.html"],
  darkMode: false, // or 'media' or 'class'
  plugins: [typography, forms],
};
