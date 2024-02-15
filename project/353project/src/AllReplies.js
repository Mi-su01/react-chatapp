import React from "react";
import { Card, Button } from "react-bootstrap";
import ReplyToReply from "./ReplyToReply";

function AllReplies({ grabReply, grabPostId }) {
  if (!Array.isArray(grabReply) || grabReply.length === 0) {
    return <p>No replies available</p>;
  }

  return (
    <div className="mt-4">
      <h2>Replies</h2>
      {grabReply
        .filter((reply) => reply.reply_id === 0)
        .map((reply) => (
          <Card key={reply.id} className="mb-3">
            <Card.Body>
              <Card.Title>{reply.time}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                [{reply.user}]
              </Card.Subtitle>
              <Card.Title>{reply.topic}</Card.Title>
              <Card.Text>{reply.data}</Card.Text>
              <ReplyToReply replyId={reply.id} postId={grabPostId} />
            </Card.Body>
          </Card>
        ))}
    </div>
  );
}

export default AllReplies;
