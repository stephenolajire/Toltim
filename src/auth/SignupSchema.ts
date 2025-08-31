import * as Yup from "yup";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signUpSchema = Yup.object().shape({
  email: Yup.string()
    .matches(emailRegex, "Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .matches(
      passwordRegex,
      "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .required("Password is required"),
  first_name: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters long"),
  last_name: Yup.string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters long"),
  confirmpassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords does not match")
    .required("Confirm password is required"),
  phonenumber: Yup.string()
    .min(10, "Phone number must not be less than 11 digits")
    .max(15, "Phone number must not be more than 15 digits")
    .required("Phone number is required"),
});

export default signUpSchema;
