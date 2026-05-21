import "./App.css";
import Header from "./Header";
import Nav from "./Nav";
import Home from "./Home";
import NewPost from "./NewPost";
import PostPage from "./PostPage";
import About from "./About";
import Missing from "./Missing";
import Footer from "./Footer";
import EditPost from "./EditPost";

import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { format } from "date-fns";

function App() {
  const navigate = useNavigate();

  // ✅ LOCAL STATE (NO API)
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Getting Started with React",
      datetime: "May 21, 2026 10:15:00 AM",
      body: "Today I started learning React. Components and hooks are interesting!",
    },
    {
      id: 2,
      title: "My Second Post",
      datetime: "May 21, 2026 11:30:45 AM",
      body: "Practicing useState and useEffect. Slowly getting confidence in React.",
    },
    {
      id: 3,
      title: "Deployment Practice",
      datetime: "May 21, 2026 12:48:20 PM",
      body: "Trying to deploy my React app. Fixing bugs and improving UI step by step.",
    },
  ]);

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");

  // 🔍 SEARCH
  useEffect(() => {
    const results = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.body.toLowerCase().includes(search.toLowerCase())
    );

    setSearchResult(results.reverse());
  }, [posts, search]);

  // ➕ ADD POST
  const handleSubmit = (e) => {
    e.preventDefault();

    const newId = posts.length ? posts[posts.length - 1].id + 1 : 1;

    const datetime = format(new Date(), "MMMM dd, yyyy pp");

    const newPost = {
      id: newId,
      title: postTitle,
      datetime,
      body: postBody,
    };

    setPosts([...posts, newPost]);

    setPostTitle("");
    setPostBody("");

    navigate("/");
  };

  // ❌ DELETE POST
  const handleDelete = (id) => {
    const updatedPosts = posts.filter((post) => post.id !== id);
    setPosts(updatedPosts);

    navigate("/");
  };

  // ✏️ EDIT POST
  const handleEdit = (id, updatedPost) => {
    const updatedPosts = posts.map((post) =>
      post.id === id ? updatedPost : post
    );

    setPosts(updatedPosts);

    navigate(`/post/${id}`);
  };

  return (
    <div className="App">
      <Header title="social media" />

      <Nav search={search} setSearch={setSearch} />

      <Routes>
        {/* HOME */}
        <Route path="/" element={<Home posts={searchResult} />} />

        {/* NEW POST */}
        <Route path="/post">
          <Route
            index
            element={
              <NewPost
                postTitle={postTitle}
                setPostTitle={setPostTitle}
                postBody={postBody}
                setPostBody={setPostBody}
                handleSubmit={handleSubmit}
              />
            }
          />

          {/* SINGLE POST */}
          <Route
            path=":id"
            element={
              <PostPage posts={posts} handleDelete={handleDelete} />
            }
          />
        </Route>

        {/* EDIT */}
        <Route
          path="/edit/:id"
          element={
            <EditPost posts={posts} handleEdit={handleEdit} />
          }
        />

        {/* ABOUT */}
        <Route path="/about" element={<About />} />

        {/* 404 */}
        <Route path="*" element={<Missing />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;