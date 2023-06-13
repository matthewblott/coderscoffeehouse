const forms = require("@tailwindcss/forms");
const typography = require("@tailwindcss/typography");
const UpgradeHelper = require("@11ty/eleventy-upgrade-help");

module.exports = {
  mode: "jit",
  purge: ["./src/**/*.html"],
  darkMode: false, // or 'media' or 'class'
  plugins: [typography, forms],
};
