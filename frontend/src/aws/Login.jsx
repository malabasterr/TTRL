import React from "react";
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateData } from "../redux/slices/authSlice";
import HeaderComponentLogin from "../components/header/HeaderComponentLogin";
import "./styles/Login.scss";

const userPool = new CognitoUserPool({
  UserPoolId: "eu-west-2_tCIJ3cao1",
  ClientId: "7k34uusaan17621r0tkud0ojt6",
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (values) => {
    const cognitoUser = new CognitoUser({
      Username: values.email,
      Pool: userPool,
    });

    const authenticationDetails = new AuthenticationDetails({
      Username: values.email,
      Password: values.password,
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        localStorage.setItem("jwtToken", result.getAccessToken().getJwtToken());

        cognitoUser.getUserAttributes(function (err, result) {
          if (err) {
            console.log("err", err);
            return;
          }

          dispatch(
            updateData({
              name: result[2].Value,
              email: values.email,
            }),
          );
          navigate("/home");
        });
      },
      onFailure: (err) => {
        console.log("login failed", err);
        alert("Login failed. Please check your email and password.");
      },
    });
  };
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("No password provided."),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  return (
    <>
      <HeaderComponentLogin />
      <div className="login__container">
        <div className="login__form" onSubmit={formik.handleSubmit}>
          <h1 className="signIn">Sign In</h1>

          <div className="login__fieldName" htmlFor="email">
            Email Address
          </div>
          <input
            className="login__inputField"
            name="email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="login__error">{formik.errors.email}</div>
          ) : null}

          <div className="login__fieldName" htmlFor="password">
            Password
          </div>
          <input
            className="login__inputField"
            name="password"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="login__error">{formik.errors.password}</div>
          ) : null}

          <button
            className="login__submitButton"
            onClick={() => handleSubmit(formik.values)}
          >
            {" "}
            SUBMIT{" "}
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
