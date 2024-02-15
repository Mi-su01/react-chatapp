import React from "react";
import { ListGroup } from "react-bootstrap";

const AllChannels = ({ Channels, title }) => {
  return (
    <div className="mt-4">
      <h2>{title}</h2>
      <ListGroup>
        {Channels.map((channel) => (
          <ListGroup.Item key={channel.id}>
            <a href={`/channel/${channel.id}`} className="chan-link">
              {channel.name}
            </a>
            <p>Number of Posts: {channel.num_posts}</p>
            <p>Number of Replies: {channel.num_replies}</p>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default AllChannels;
