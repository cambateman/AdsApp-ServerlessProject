import { useCallback, useEffect, useRef, useState } from "react";
import "../Styles/Homepage.scss";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { categories } from "../Assets/categories.json";
const Homepage = ({ location }) => {
  const [category, setCategory] = useState();
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [post, setPost] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const history = useHistory();
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [expend, setExpend] = useState();
  const uploadInput = useRef(null);
  const [delating, setDelating] = useState("");
  const user = location.state;

  const uploadCover = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading("Uploading...");
      const bodyFormData = new FormData();
      bodyFormData.append("image", file);
      axios
        .post("/upload", bodyFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(async (res) => {
          setImage(res.data);
          setLoading("");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handlePost = async () => {
    const error = (err) => {
      setError(err);
      setTimeout(() => {
        setError();
      }, 3000);
    };

    if (image) {
      if (title) {
        if (post) {
          if (category) {
            setLoading("Posting...");
            await axios
              .post("/addpost", {
                id: String(new Date().getTime()),
                userid: user.sub,
                username: user.email,
                title,
                post,
                image,
                category,
              })
              .then(() => {
                setCategory("");
                uploadInput.current.value = "";
                setTitle("");
                setPost("");
                setCategory("");
                setLoading();
                getPosts();
              })
              .catch((err) => console.log(err));
          } else {
            error("Please select category");
          }
        } else {
          error("Please provide description");
        }
      } else {
        error("Please provide title");
      }
    } else {
      error("Please upload image");
    }
  };

  const handleDelete = async (id) => {
    setDelating(id);
    if (!delating) {
      await axios.delete(`/delete/${id}`).then(() => {
        setDelating();
        getPosts();
      });
    }
  };

  const getPosts = useCallback(async () => {
    setLoadingPosts(true);
    await axios.get("/getposts").then((res) => {
      setAllPosts(res.data);
      setLoadingPosts(false);
    });
  }, []);

  const handleExpend = (id) => {
    if (user) {
      setExpend(id);
    } else {
      history.push("/login");
    }
  };

  useEffect(() => {
    getPosts();
    console.log("looping");
  }, [getPosts]);

  useEffect(() => {
    if (selectedCategory === "All") {
      setPosts(allPosts);
    } else if (selectedCategory === "My Posts") {
      user
        ? setPosts(allPosts.filter((x) => x.userid === user.sub))
        : history.push("/login");
    } else {
      setPosts(allPosts.filter((x) => x.category === selectedCategory));
    }
  }, [selectedCategory, allPosts, history, user]);

  return (
    <>
      <div className="newsfeed">
        <div className="profile_info">
          <div className="profile_cont">
            {user ? (
              user.email
            ) : (
              <h1 className="name" onClick={() => history.push("/login")}>
                Login
              </h1>
            )}
          </div>
          <div className="categories">
            <ul>
              <li
                style={{
                  background: selectedCategory === "My Posts" && "#2d9fc2",
                  color: selectedCategory === "My Posts" && "white",
                }}
                onClick={() => setSelectedCategory("My Posts")}>
                <h3>My Posts</h3>
              </li>
              {categories.map((x) => (
                <li
                  key={x}
                  style={{
                    background: selectedCategory === x && "#2d9fc2",
                    color: selectedCategory === x && "white",
                  }}
                  onClick={() => setSelectedCategory(x)}>
                  <h3>{x}</h3>
                  <i className="fas fa-chevron-circle-right" />
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="post_info">
          <div className="feeds">
            {loadingPosts ? (
              <h2 style={{ textAlign: "center" }}>Loading...</h2>
            ) : posts.length > 0 ? (
              posts.map((x) => (
                <div className="convo">
                  <div className="body">
                    <h1 className="title">
                      <span>{x.title}</span>
                      {selectedCategory === "My Posts" && (
                        <span
                          className="delete"
                          onClick={() => handleDelete(x.id)}>
                          {delating === x.id ? "Deleting..." : "Delete Post"}
                        </span>
                      )}
                    </h1>
                    {expend === x.id ? (
                      <article>{x.post}</article>
                    ) : (
                      <article
                        onClick={() => handleExpend(x.id)}
                        style={{
                          cursor: "pointer",
                          textDecoration: "underline",
                          color: "blue",
                        }}>
                        View post
                      </article>
                    )}
                    <div className="thumb">
                      <img src={x.image} alt="" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <h2 style={{ textAlign: "center" }}>No posts available</h2>
            )}
          </div>
        </div>
        <div className="post_ad">
          {user ? (
            <>
              <h1 className="main_title">Post ad</h1>
              <input type="file" onChange={uploadCover} ref={uploadInput} />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title"
              />
              <textarea
                placeholder="Description"
                value={post}
                onChange={(e) => setPost(e.target.value)}
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}>
                <option disabled selected>
                  Choose category
                </option>
                {[...categories.filter((x) => x !== "All")].map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
              {error && <h3 style={{ color: "red" }}>{error}</h3>}
              {loading ? (
                <h3>{loading}</h3>
              ) : (
                <button onClick={handlePost}>Post</button>
              )}
            </>
          ) : (
            <h1
              onClick={() => history.push("/login")}
              style={{ textDecoration: "underline", color: "blue" }}>
              Login to post Ad
            </h1>
          )}
        </div>
      </div>
    </>
  );
};

export default Homepage;
