import React, { useState, useEffect } from "react";
import { Button, Form, Card, ListGroup } from "react-bootstrap";
import "./styles.css";

function ReplyToReply({ replyId, postId }) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState([]);
  const username = window.localStorage.getItem("name");

  const handleReplyClick = () => {
    setIsReplying(true);
  };

  const handleCancelClick = () => {
    setIsReplying(false);
    setReplyText("");
  };

  const handleSubmit = () => {
    createReplyToReply();
    console.log("Submitted:", replyText);
    setIsReplying(false);
    setReplyText("");
  };

  const createReplyToReply = () => {
    if (replyText.trim() !== "") {
      const requestBody = `username=${encodeURIComponent(
        username
      )}&data=${encodeURIComponent(replyText)}`;

      fetch(`http://localhost:8080/addReply/${postId}/${replyId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: requestBody,
      })
        .then((response) => response.json())
        .then(() => {
          console.log("Reply added successfully");
          getReplies();
        })
        .catch((error) => console.error("Error adding reply:", error));
    }
  };

  const getReplies = () => {
    fetch(`http://localhost:8080/getReplies/${postId}`)
      .then((response) => response.json())
      .then((data) => {
        const filteredReplies = data.filter(
          (reply) => reply.reply_id === replyId
        );
        setReplies(filteredReplies);
      })
      .catch((error) => console.error("Error fetching replies:", error));
  };

  useEffect(() => {
    getReplies();
  }, []);

  return (
    <>
      {isReplying ? (
        <Card>
          <Card.Body>
            <Form>
              <Form.Control
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="small-text"
              />
              <Button onClick={handleSubmit} size="sm" className="mr-1">
                Submit
              </Button>
              <Button variant="secondary" onClick={handleCancelClick} size="sm">
                Cancel
              </Button>
            </Form>
          </Card.Body>
        </Card>
      ) : (
        <ListGroup className="mt-3">
          <ListGroup.Item>
            <Button onClick={handleReplyClick} size="sm">
              Reply
            </Button>
          </ListGroup.Item>
          {replies.map((reply) => (
            <ListGroup.Item key={reply.id}>
              <Card>
                <Card.Body>
                  <h2 className="small-text">{reply.time}</h2>
                  <h2 className="small-text">[{reply.user}]</h2>
                  <h3 className="small-text">{reply.data}</h3>
                  <Button onClick={handleReplyClick} size="sm">
                    Reply
                  </Button>
                </Card.Body>
              </Card>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </>
  );
}

export default ReplyToReply;
