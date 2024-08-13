import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

export default {
  mode: "jit",
  purge: ["./src/**/*.html"],
  darkMode: false, // or 'media' or 'class'
  plugins: [typography, forms],
};
