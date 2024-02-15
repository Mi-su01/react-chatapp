import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  FormControl,
  Button,
} from "react-bootstrap";

function App() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Username:", username);
    console.log("Password:", password);
  };

  const goToRegisterPage = () => {
    navigate("/register");
  };

  useEffect(() => {
    fetch("http://localhost:8080/createdb", {
      method: "POST",
    })
      .then((response) => {
        console.log("Database created successfully");
      })
      .catch((error) => {
        console.error("Error creating the database:", error);
      });
  }, []);

  const authenticateUser = () => {
    if (username.trim() !== "" && password.trim() !== "") {
      fetch("http://localhost:8080/authenticateUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `password=${encodeURIComponent(
          password
        )}&username=${encodeURIComponent(username)}`,
      })
        .then((response) => {
          if (response.status === 200) {
            navigate("/home");
            console.log("User authenticated successfully");
          } else if (response.status === 401) {
            alert("Invalid username or password");
          } else {
            console.error(
              "Error authenticating user. Status:",
              response.status
            );
          }
        })
        .catch((error) => {
          console.error("Error authenticating user:", error);
        });
    } else {
      alert("Invalid username or password");
    }
  };

  useEffect(() => {
    window.localStorage.setItem("name", username);
  }, [username]);

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h1 className="text-center">Myintsoe Book Login Page</h1>
          <Form onSubmit={handleSubmit}>
            <FormGroup controlId="formUsername">
              <Form.Label>Username:</Form.Label>
              <FormControl
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormGroup>
            <FormGroup controlId="formPassword">
              <Form.Label>Password:</Form.Label>
              <FormControl
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormGroup>
            <Button variant="primary" type="submit" onClick={authenticateUser}>
              Submit
            </Button>
            <Button variant="link" onClick={goToRegisterPage}>
              Register
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
