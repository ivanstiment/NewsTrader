import * as yup from "yup";

// Definición del esquema de validación con Yup
export const loginSchema = yup.object({
  username: yup
    .string()
    .trim()
    .required("El usuario es obligatorio"),
  password: yup
    .string()
    .required("La contraseña es obligatoria"),
});