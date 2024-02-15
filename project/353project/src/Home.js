import React from "react";
import Navbar from "./Navbar";
import { Container } from "react-bootstrap";

function Home() {
  return (
    <>
      <Navbar />
      <Container className="mt-5">
        <h1 className="text-center mb-4">Welcome to Our Chatroom</h1>
        <h2 className="text-center mb-4">HOME PAGE</h2>
        <p className="text-center">
          Welcome to our buzzing chatroom—where diverse minds collide! Dive into
          <br />
          themed channels, spark convos with epic posts, and keep the chat alive
          <br />
          with wicked replies. This is your space to share, connect, and vibe
          with
          <br />
          like-minded peeps. Let's make every post count and turn this chatroom
          <br />
          into a hub of cool conversations and connections! 🚀✨
        </p>
      </Container>
    </>
  );
}

export default Home;
