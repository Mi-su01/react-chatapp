import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AllPosts from "./AllPosts";
import Navbar from "./Navbar";
import Search from "./Search";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";

function InsideChannel() {
  const { channelId } = useParams();
  const [channelName, setChannelName] = useState("");
  const [topic, setTopic] = useState("");
  const [data, setData] = useState("");
  const [getPosts, setArrayPosts] = useState([]);
  const username = window.localStorage.getItem("name");

  useEffect(() => {
    fetch(`http://localhost:8080/getChannel/${channelId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error("Error fetching channel name:", data.error);
        } else {
          setChannelName(data.channelName);
        }
      })
      .catch((error) => {
        console.error("Error fetching channel name:", error);
      });
  }, [channelId]);

  const CreatePost = () => {
    if (topic.trim() !== "" && data.trim() !== "") {
      fetch(`http://localhost:8080/addPost/${channelId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `topic=${encodeURIComponent(topic)}&data=${encodeURIComponent(
          data
        )}&username=${encodeURIComponent(username)}`,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to add post. Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          fetch(`http://localhost:8080/updateNumPosts/${channelId}`, {
            method: "POST",
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("Num_posts updated successfully", data);
            })
            .catch((error) => {
              console.error("Error updating num_posts:", error.message);
            });

          fetchPosts();
          console.log("Post added successfully", data);
        })
        .catch((error) => {
          console.error("Error adding post:", error.message);
        });
    }
  };

  const fetchPosts = () => {
    fetch(`http://localhost:8080/getPosts/${channelId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error("Error fetching posts from channel id:", data.error);
        } else {
          setArrayPosts(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching posts from channel id:", error);
      });
  };

  useEffect(() => {
    fetchPosts();
    console.log(channelId);
  }, [channelId]);

  return (
    <>
      <Navbar />
      <Search />
      <Container>
        <Row className="mt-4">
          <Col>
            <h2 className="mb-4">Channel Name: {channelName}</h2>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col md={6}>
            <Card className="p-4">
              <Form onSubmit={(e) => e.preventDefault()}>
                <Form.Group controlId="formTopic">
                  <Form.Label>Create Post:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formData">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter Message"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                  />
                </Form.Group>
                <Button onClick={CreatePost}>Create Post</Button>
              </Form>
            </Card>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <h3 className="mb-3">Recent Posts</h3>
            <AllPosts grabPosts={getPosts} />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default InsideChannel;
