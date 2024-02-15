import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch("http://localhost:8080/getUsers");
      if (response.ok) {
        const accountsData = await response.json();
        setAccounts(accountsData);
      } else {
        console.error("Error fetching accounts:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (accounts.some((account) => account.username === username)) {
      alert("Username already exists. Please choose a different username.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/addUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `name=${encodeURIComponent(name)}&password=${encodeURIComponent(
          password
        )}&username=${encodeURIComponent(username)}`,
      });

      if (response.ok) {
        alert("User added successfully");
        fetchAccounts();
      } else {
        alert("Error adding user:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding user:", error.message);
    }
  };

  const goToLoginPage = () => {
    navigate("/");
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h1 className="text-center">Register Now!</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Name:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formUsername">
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>

          <div className="mt-3 text-center">
            <p>Already have an account?</p>
            <Button variant="link" onClick={goToLoginPage}>
              Go to Login
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;
