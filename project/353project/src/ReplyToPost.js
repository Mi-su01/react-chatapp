import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AllReplies from "./AllReplies";
import Navbar from "./Navbar";
import { Container, Card, Form, Button } from "react-bootstrap";
import "./styles.css";

const ReplyToPost = () => {
  const location = useLocation();
  const postId = location.state?.postId;
  const [post, setPost] = useState(null);
  const [getReply, setReply] = useState("");
  const [getArrayReplies, setArrayReplies] = useState([]);
  const username = window.localStorage.getItem("name");

  useEffect(() => {
    if (postId) {
      fetch(`http://localhost:8080/getPost/${postId}`)
        .then((response) => response.json())
        .then((data) => {
          setPost(data);
        })
        .catch((error) => {
          console.error("Error fetching post:", error);
        });
    }
  }, [postId]);

  const CreateReply = () => {
    if (getReply.trim() !== "") {
      fetch(`http://localhost:8080/addReply/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `username=${encodeURIComponent(
          username
        )}&data=${encodeURIComponent(getReply)}`,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to add reply. Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          fetchReplies();
          console.log("Reply added successfully", data);
        })
        .catch((error) => {
          console.error("Error adding reply:", error.message);
        });
    }
  };

  const fetchReplies = () => {
    fetch(`http://localhost:8080/getReplies/${postId}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setArrayReplies(data);
        } else {
          setArrayReplies([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching replies from post id:", error);
      });
  };

  useEffect(() => {
    fetchReplies();
    console.log(postId);
  }, [postId]);

  return (
    <>
      <Navbar />
      {post ? (
        <Container className="mt-4">
          <Card className="mb-4">
            <Card.Body>
              <Card.Title className="small-text">{post.time}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted small-text font-weight-bold">
                [{post.user}]
              </Card.Subtitle>
              <Card.Title className="small-text">{post.topic}</Card.Title>
              <Card.Text className="small-text">{post.data}</Card.Text>
              <Form onSubmit={(e) => e.preventDefault()} className="mb-3">
                <Form.Group controlId="formReply">
                  <Form.Control
                    type="text"
                    placeholder="Enter Message"
                    value={getReply}
                    onChange={(e) => setReply(e.target.value)}
                  />
                </Form.Group>
                <Button onClick={() => CreateReply()}>Submit</Button>
              </Form>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <AllReplies grabReply={getArrayReplies} grabPostId={postId} />
            </Card.Body>
          </Card>
        </Container>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default ReplyToPost;
