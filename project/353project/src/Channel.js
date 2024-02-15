import React, { useState, useEffect } from "react";
import AllChannels from "./AllChannels";
import Navbar from "./Navbar";
import Search from "./Search";
import { Container, Form, Button, Row, Col } from "react-bootstrap";

function Channel() {
  const [getChannels, setArrayChannels] = useState([]);
  const [createChannel, setCreateChannel] = useState("");

  const handleCreateChannel = () => {
    if (createChannel.trim() !== "") {
      fetch("http://localhost:8080/createChannel", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `topic=${createChannel}`,
      })
        .then((response) => {
          if (!response.ok) {
            alert("Enter a valid channel name");
            throw new Error("Failed to create channel");
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          if (data.error) {
            console.error("Error creating channel:", data.error);
          } else {
            console.log("Channel created successfully");
            setCreateChannel("");

            fetchChannels();
          }
        })
        .catch((error) => {
          console.error("Error creating channel:", error);
        });
    }
  };

  const fetchChannels = () => {
    fetch("http://localhost:8080/getChannels")
      .then((response) => response.json())
      .then((response) => setArrayChannels(response))
      .catch((error) => {
        console.error("Error fetching channels:", error);
      });
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  return (
    <>
      <Navbar />
      <Search />
      <Container>
        <Row className="mt-4">
          <Col md={12}>
            <AllChannels Channels={getChannels} title="All Channels!" />
          </Col>
        </Row>
        <Row className="mt-4">
          <Col md={6}>
            <Form onSubmit={(e) => e.preventDefault()}>
              <Form.Group controlId="formChannel">
                <Form.Label>Create a New Channel:</Form.Label>
                <Form.Control
                  type="text"
                  value={createChannel}
                  onChange={(e) => setCreateChannel(e.target.value)}
                />
              </Form.Group>
              <Button onClick={handleCreateChannel}>Create Channel</Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Channel;
