import React, { useState } from "react";

const Search = () => {
  const [getChannel, setChannel] = useState([]);
  const [getChannelState, setChannelState] = useState(false);
  const [getPost, setPost] = useState([]);
  const [getPostState, setPostState] = useState(false);
  const [getReplies, setReplies] = useState([]);
  const [getRepliesState, setRepliesState] = useState(false);

  const Searchchannel = (e) => {
    const inputValue = e.target.value.trim();

    if (inputValue === "") {
      setChannel([]);
    } else {
      fetch(
        `http://localhost:8080/search/channels?column=name&target=${inputValue}&order=asc`
      )
        .then((response) => response.json())
        .then((response) => setChannel(response));
    }
  };

  const Searchpost = (e) => {
    const inputValue = e.target.value.trim();

    if (inputValue === "") {
      setPost([]);
    } else {
      fetch(
        `http://localhost:8080/search/posts?column=topic&target=${inputValue}&order=asc`
      )
        .then((response) => response.json())
        .then((response) => setPost(response));
    }
  };

  const Searchreplies = (e) => {
    const inputValue = e.target.value.trim();

    if (inputValue === "") {
      setReplies([]);
    } else {
      fetch(
        `http://localhost:8080/search/replies?column=data&target=${inputValue}&order=asc`
      )
        .then((response) => response.json())
        .then((response) => setReplies(response));
    }
  };

  return (
    <>
      <button
        onClick={() => (
          setChannelState(true),
          setPost([]),
          setPostState(false),
          setReplies([]),
          setRepliesState(false)
        )}
      >
        Search Channels
      </button>
      <button
        onClick={() => (
          setChannel([]),
          setChannelState(false),
          setPostState(true),
          setReplies([]),
          setRepliesState(false)
        )}
      >
        Search Post
      </button>
      <button
        onClick={() => (
          setChannel([]),
          setChannelState(false),
          setPost([]),
          setPostState(false),
          setRepliesState(true)
        )}
      >
        Search Replies
      </button>

      {getChannelState && (
        <form>
          <input placeholder="Search..." onChange={Searchchannel}></input>
          {getChannel.map((channel) => (
            <div key={channel.id}>{channel.name}</div>
          ))}
        </form>
      )}
      {getPostState && (
        <>
          <form>
            <input placeholder="Search..." onChange={Searchpost}></input>
            {getPost.map((post) => (
              <div key={post.id}>
                <p>{post.user}</p>
                <p>{post.time}</p>
                <p>{post.topic}</p>
                <p>{post.data}</p>
              </div>
            ))}
          </form>
        </>
      )}

      {getRepliesState && (
        <form>
          <input placeholder="Search..." onChange={Searchreplies}></input>
          {getReplies.map((reply) => (
            <div key={reply.id}>
              <p>{reply.user}</p>
              <p>{reply.time}</p>
              <p>{reply.data}</p>
            </div>
          ))}
        </form>
      )}
    </>
  );
};

export default Search;
