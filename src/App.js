import "./App.css";
import Header from "./Header";
import Nav from "./Nav";
import Home from "./Home";
import NewPost from "./NewPost";
import PostPage from "./PostPage";
import About from "./About";
import Missing from "./Missing";
import Footer from "./Footer";
import { Route, Routes, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { format } from "date-fns";

import api from "./api/post";
import EditPost from "./EditPost";

function App() {

  // STATES
  const [posts, setPosts] = useState([ {
    id: 1,
    title: "Getting Started with React",
    datetime: "May 21, 2026 10:15:00 AM",
    body: "Today I started learning React. Components and hooks are interesting!"
  },
  {
    id: 2,
    title: "My Second Post",
    datetime: "May 21, 2026 11:30:45 AM",
    body: "Practicing useState and useEffect. Slowly getting confidence in React."
  },
  {
    id: 3,
    title: "Deployment Practice",
    datetime: "May 21, 2026 12:48:20 PM",
    body: "Trying to deploy my React app. Fixing bugs and improving UI step by step."
  },
  {
    id: 4,
    title: "Learning API Integration",
    datetime: "May 21, 2026 1:10:05 PM",
    body: "Started using Axios to fetch data from JSON server. Feeling powerful 😄"
  }]);
  const [searchResult, setSearchResult] = useState([]);
  const [search, setSearch] = useState("");

  const [postTitle, setPostTitle] = useState("");
  const [PostBody, setPostBody] = useState("");

  const navigate = useNavigate();

  // FETCH POSTS
  useEffect(() => {

    const fetchPosts = async () => {

      try {

        const response = await api.get("/posts");

        setPosts(response.data);

      } catch (err) {

        console.log(err.message);

      }
    };

    fetchPosts();

  }, []);

  // SEARCH POSTS
  useEffect(() => {

    const filterResults = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.body.toLowerCase().includes(search.toLowerCase())
    );

    setSearchResult([...filterResults].reverse());

  }, [posts, search]);

  // ADD NEW POST
  const handleSubmit = async (e) => {

    e.preventDefault();

    const id =
      posts.length
        ? Number(posts[posts.length - 1].id) + 1
        : 1;

    const datetime = format(
      new Date(),
      "MMMM dd, yyyy pp"
    );

    const newPost = {
      id,
      title: postTitle,
      datetime,
      body: PostBody
    };

    try {

      const response = await api.post(
        "/posts",
        newPost
      );

      setPosts((prevPosts) => [
        ...prevPosts,
        response.data
      ]);

      setPostTitle("");
      setPostBody("");

      navigate("/");

    } catch (err) {

      console.log(err.message);

    }
  };

  // DELETE POST
  const handleDelete = async (id) => {

    try {

      await api.delete(`/posts/${id}`);

      const postList = posts.filter(
        (post) =>
          post.id.toString() !== id.toString()
      );

      setPosts(postList);

      navigate("/");

    } catch (err) {

      console.log(err.message);

    }
  };

  // EDIT POST
  const handleEdit = async (id, updatedPost) => {

    try {

      const response = await api.put(
        `/posts/${id}`,
        updatedPost
      );

      setPosts(
        posts.map((post) =>
          post.id.toString() === id.toString()
            ? response.data
            : post
        )
      );

      setSearch("");

      navigate(`/post/${id}`);

    } catch (err) {

      console.log(err.message);

    }
  };

  return (

    <div className="App">

      <Header title="social media" />

      <Nav
        search={search}
        setSearch={setSearch}
      />

      <Routes>

        <Route
          path="/"
          element={
            <Home posts={searchResult} />
          }
        />

        <Route path="/post">

          <Route
            index
            element={
              <NewPost
                postTitle={postTitle}
                setPostTitle={setPostTitle}
                PostBody={PostBody}
                setPostBody={setPostBody}
                handleSubmit={handleSubmit}
              />
            }
          />

          <Route
            path=":id"
            element={
              <PostPage
                posts={posts}
                handleDelete={handleDelete}
              />
            }
          />

        </Route>

        <Route
          path="/edit/:id"
          element={
            <EditPost
              posts={posts}
              handleEdit={handleEdit}
            />
          }
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="*"
          element={<Missing />}
        />

      </Routes>

      <Footer />

    </div>
  );
}

export default App