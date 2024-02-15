import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import App from "./App";
import Register from "./Register";
import Home from "./Home";
import Channel from "./Channel";
import InsideChannel from "./InsideChannel";
import ReplyToPost from "./ReplyToPost";
import "./Navbar.css";
import Search from "./Search";
import Accounts from "./Accounts";
import Profile from "./Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/channels",
    element: <Channel />,
  },
  {
    path: "/channel/:channelId",
    element: <InsideChannel />,
  },
  {
    path: "/post/:postId",
    element: <ReplyToPost />,
  },
  {
    path: "/accounts",
    element: <Accounts />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
