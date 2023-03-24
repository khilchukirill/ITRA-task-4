import "./registration.scss";
import React, { useState } from "react";
import moment from "moment";
import { Button, Form } from "react-bootstrap";
import { RegFormModel } from "../models";
import { useNavigate } from "react-router-dom";

export function Registration() {
  const signUpTitle: string = "Sign Up!";
  const submitBtn: string = "Submit";
  const signInBtn: string = "Have an account? Sign In!";
  const apiUrl = "http://localhost:4000";
  const signUpFormFields: Array<RegFormModel> = [
    new RegFormModel("formBasicName", "Name", "text", "Enter your name"),
    new RegFormModel("formBasicEmail", "Email address", "email", "Enter email"),
    new RegFormModel("formBasicPassword", "Password", "password", "Password"),
  ];

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>("");
  const [authorized, setAuthorized] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleFormFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));

    if (name === "formBasicEmail") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setError(emailRegex.test(value) ? "" : "Please enter a valid email");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const endpoint = `${apiUrl}/users`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData["formBasicName"],
          email: formData["formBasicEmail"],
          password: formData["formBasicPassword"],
          registeredAt: moment().format("DD.MM.YYYY, h:mm:ss"),
          status: "Active",
        }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const loginEndpoint = `${apiUrl}/login`;
      const loginResponse = await fetch(loginEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData["formBasicEmail"],
          password: formData["formBasicPassword"],
        }),
      });

      if (!loginResponse.ok) {
        throw new Error(loginResponse.statusText);
      }

      const { token } = await loginResponse.json();
      localStorage.setItem("token", token);
      setAuthorized(authorized);
      navigate("/adminPanel");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="signUp">
      <h2 className="signUp__title">{signUpTitle}</h2>
      <Form onSubmit={handleSubmit}>
        {signUpFormFields.map((signUpFormField) => (
          <Form.Group
            className="mb-3"
            controlId={signUpFormField.controlId}
            key={signUpFormField.controlId}
          >
            <Form.Label>{signUpFormField.formLabel}</Form.Label>
            <Form.Control
              type={signUpFormField.formType}
              placeholder={signUpFormField.formPlaceholder}
              name={signUpFormField.controlId}
              value={formData[signUpFormField.controlId] || ""}
              onChange={handleFormFieldChange}
            />
          </Form.Group>
        ))}
        <Button variant="primary" type="submit" disabled={Boolean(error)}>
          {submitBtn}
        </Button>
        {error && <p className="error-message">{error}</p>}
      </Form>
      <a href="/signIn" className="signIn__link">
        {signInBtn}
      </a>
    </div>
  );
}
