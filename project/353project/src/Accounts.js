import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { Card, Button, Container, Row, Col } from "react-bootstrap";

function Accounts() {
  const [allUsers, setAllUsers] = useState([]);

  const getAllUsers = () => {
    fetch(`http://localhost:8080/getUsers`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setAllUsers(data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <>
      <Navbar />
      <Container>
        <Row>
          {allUsers.map((user) => (
            <Col key={user.id} md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>ID: {user.id}</Card.Title>
                  <Card.Title>Name: {user.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Username: {user.username}
                  </Card.Subtitle>
                  {/* <Card.Text>{user.additionalInfo}</Card.Text> */}
                  <Button variant="primary">View Details</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default Accounts;
