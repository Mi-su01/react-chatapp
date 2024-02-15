import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import Navbar from "./Navbar";

function Profile() {
  const [profile, setProfile] = useState([]);
  const username = window.localStorage.getItem("name");

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = () => {
    fetch(`http://localhost:8080/getUsers/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setProfile(data);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
      });
  };

  return (
    <Container>
      <Navbar />
      <Row className="mt-5">
        <Col>
          <h2>Your Profile</h2>
        </Col>
      </Row>
      {profile.map((user) => (
        <Row key={user.id} className="mt-3">
          <Col>
            <p>
              <strong>User ID:</strong> {user.id}
            </p>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Username:</strong> {user.username}
            </p>
          </Col>
        </Row>
      ))}
      <Row className="mt-3">
        <Col>
          <Button onClick={getProfile}>Refresh Profile</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;
