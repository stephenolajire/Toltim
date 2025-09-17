import * as Yup from "yup";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .matches(emailRegex, "Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .matches(passwordRegex, "Password must contain at least 6 characters, including letters, numbers and special characters")
    .required("Password is required"),
});

export default loginSchema;
