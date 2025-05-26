import * as yup from "yup";

export const registerSchema = yup.object().shape({
  user: yup
    .string()
    .trim()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(30, "Máximo 30 caracteres")
    .required("Usuario es obligatorio"),
  password: yup
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .matches(/[A-Z]/, "Debe contener una letra mayúscula")
    .matches(/[a-z]/, "Debe contener una letra minúscula")
    .matches(/[0-9]/, "Debe contener un número")
    .required("Contraseña es obligatoria"),
  repassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Las contraseñas deben coincidir")
    .required("Repetir contraseña es obligatorio"),
});