import "./auth.scss";
import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { RegFormModel } from "../models";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

export function Auth() {
  const [authorized, setAuthorized] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const signUpFormFields: Array<RegFormModel> = [
    new RegFormModel("formBasicEmail", "Email address", "email", "Enter email"),
    new RegFormModel("formBasicPassword", "Password", "password", "Password"),
  ];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch("http://localhost:4000/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (response.ok) {
      const { token } = await response.json();
      const decodedToken: { id: string } = jwt_decode(token) as { id: string };
      setAuthorized(authorized);
      storeToken(token);

      localStorage.setItem("userId", decodedToken.id);
      navigate("/adminPanel");
    } else {
      const { message } = await response.json();
      setError(message);
    }

    function storeToken(token: string) {
      localStorage.setItem("token", token);
    }
  };

  const renderFormFields = () =>
    signUpFormFields.map((formField) => (
      <Form.Group
        key={formField.controlId}
        className="mb-3"
        controlId={formField.controlId}
      >
        <Form.Label>{formField.formLabel}</Form.Label>
        <Form.Control
          type={formField.formType}
          placeholder={formField.formPlaceholder}
          value={formField.controlId === "formBasicEmail" ? email : password}
          onChange={(event) =>
            formField.controlId === "formBasicEmail"
              ? setEmail(event.target.value)
              : setPassword(event.target.value)
          }
        />
      </Form.Group>
    ));

  return (
    <div className="signIn signUp">
      <h2 className="signIn__title signUp__title">Sign In!</h2>
      <Form onSubmit={handleSubmit}>
        {renderFormFields()}
        {error && <div className="error">{error}</div>}
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      <a href="/signUp" className="signUp__link">
        Don't have an account? Sign Up now!
      </a>
    </div>
  );
}
