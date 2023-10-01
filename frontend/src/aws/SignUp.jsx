// THIS FILE IS NO LONGER REQUIRED AS WE ARE USING THE PRE-MADE SIGN IN UI

// // modules
// import React, { useEffect } from "react";
// import {
//   CognitoUser,
//   CognitoUserPool,
//   CognitoUserAttribute,
// } from "amazon-cognito-identity-js";
// import styled from "styled-components";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { useNavigate } from "react-router-dom";
// import HeaderComponentLogin from "../components/header/HeaderComponentLogin";

// // styling
// import "./styles/SignUp.scss";

// const userPool = new CognitoUserPool({
//   UserPoolId: process.env.REACT_APP_USERPOOL_ID,
//   ClientId: process.env.REACT_APP_APPCLIENT_ID,
// });

// export const SignUp = () => {
//   const navigate = useNavigate();

//   const handleSubmit = (values) => {
//     const email = values.email.trim();
//     const password = values.password.trim();
//     const attributeList = [
//       new CognitoUserAttribute({
//         Name: "email",
//         Value: email,
//       }),
//       new CognitoUserAttribute({
//         Name: "given_name",
//         Value: values.name,
//       }),
//       new CognitoUserAttribute({
//         Name: "family_name",
//         Value: values.surname,
//       }),
//       // new CognitoUserAttribute({
//       //   Name: "custom:telnum",
//       //   Value: values.telnum,
//       // }),
//     ];

//     const cognitoUser = new CognitoUser({
//       Username: email,
//       Pool: userPool,
//     });

//     userPool.signUp(email, password, attributeList, null, (err, result) => {
//       if (err) {
//         console.log(err);
//         return;
//       }
//       console.log("call result: ", result);
//       navigate(`/confirmation/${email}`);
//     });
//   };

//   const formik = useFormik({
//     initialValues: {
//       name: "",
//       surname: "",
//       email: "",
//       password: "",
//     },
//     validationSchema: Yup.object({
//       name: Yup.string()
//         .max(30, "Must be 15 characters or less")
//         .required("Required"),
//       surname: Yup.string()
//         .max(30, "Must be 15 characters or less")
//         .required("Required"),
//       // telnum: Yup.string()
//       //   .max(10, "Must be 10 characters or less")
//       //   .required("Required"),
//       email: Yup.string().email("Invalid email address").required("Required"),
//       password: Yup.string()
//         .required("No password provided.")
//         .matches(/[0-9]/, "Password requires a number")
//         .matches(/[a-z]/, "Password requires a lowercase letter")
//         .matches(/[A-Z]/, "Password requires an uppercase letter")
//         .matches(/[^\w]/, "Password requires a symbol")
//         .min(8, "Password is too short. There should be 8 chars minimum."),
//     }),
//     onSubmit: (values) => {
//       handleSubmit(values);
//     },
//   });

//   return (
//     <>
//     <HeaderComponentLogin />
//       <div className="signup__container">
//         <div className="signup__form" onSubmit={formik.handleSubmit}>
//           <h1>Sign Up</h1>
//           <div className="signup__fieldName" htmlFor="name">
//             Name
//           </div>
//           <input
//             className="signup__inputField"
//             name="name"
//             type="text"
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             value={formik.values.name}
//           />
//           {formik.touched.name && formik.errors.name ? (
//             <div className="signup__error">{formik.errors.name}</div>
//           ) : null}

//           <div className="signup__fieldName" htmlFor="surname">
//             Surname
//           </div>
//           <input
//             className="signup__inputField"
//             name="surname"
//             type="text"
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             value={formik.values.surname}
//           />
//           {formik.touched.surname && formik.errors.surname ? (
//             <div className="signup__error">{formik.errors.surname}</div>
//           ) : null}

//           {/* <div className="signup__fieldName" htmlFor="telnum">
//             Telephone Number
//           </div>
//           <input
//             className="signup__inputField"
//             name="telnum"
//             type="text"
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             value={formik.values.telnum}
//           />
//           {formik.touched.telnum && formik.errors.telnum ? (
//             <div className="signup__error">{formik.errors.telnum}</div>
//           ) : null} */}

//           <div className="signup__fieldName" htmlFor="email">
//             Email Address
//           </div>
//           <input
//             className="signup__inputField"
//             name="email"
//             type="email"
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             value={formik.values.email}
//           />
//           {formik.touched.email && formik.errors.email ? (
//             <div className="signup__error">{formik.errors.email}</div>
//           ) : null}

//           <div className="signup__fieldName" htmlFor="password">
//             Password
//           </div>
//           <input
//             className="signup__inputField"
//             name="password"
//             type="password"
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             value={formik.values.password}
//           />
//           {formik.touched.password && formik.errors.password ? (
//             <div className="signup__error">{formik.errors.password}</div>
//           ) : null}

//           {/* <div className="signup__fieldName" htmlFor="confirmPassword">
//             Confirm Password
//           </div>
//           <input
//             className="signup__inputField"
//             name="confirmPassword"
//             type="password"
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             value={formik.values.confirmPassword}
//           />
//           {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
//             <div className="signup__error">{formik.errors.confirmPassword}</div>
//           ) : null} */}

//           <button
//             className="signup__submitButton"
//             name="Hello"
//             onClick={() => handleSubmit(formik.values)}
//           >
//             Submit
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default SignUp;