import React from "react";
import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AllPosts = ({ grabPosts }) => {
  const navigate = useNavigate();

  const handleReply = (postId) => {
    navigate(`/post/${postId}`, { state: { postId } });
  };

  return (
    <div className="mt-4">
      <h1>All Posts</h1>
      {grabPosts.map((post) => (
        <Card key={post.id} className="mb-3">
          <Card.Body>
            <Card.Title>{post.time}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              [{post.user}]
            </Card.Subtitle>
            <Card.Title>{post.topic}</Card.Title>
            <Card.Text>{post.data}</Card.Text>
            <Button onClick={() => handleReply(post.id)}>Comment</Button>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default AllPosts;
