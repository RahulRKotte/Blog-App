import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const cat = useLocation().search;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/posts${cat}`);
        setPosts(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [cat]);

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
  };

  const handleReadMore = (postId) => {
    navigate(`/post/${postId}`);
  };

  return (
    <div className="home">
      <div className="posts">
        {posts.map((post) => (
          <div className="post" key={post.id}>
            <div className="img">
            <img src={post.img && post.img !== '' ? `/upload/${post.img}` : '/upload/defaultimg.png'} alt="post-img" />
            </div>
            <div className="content">
              <Link className="link" to={`/post/${post.id}`}>
                <h1>{post.title}</h1>
              </Link>
              <div>{getText(post.desc).slice(0,150)+ '...'}</div>
              <button onClick={() => handleReadMore(post.id)}>Read More</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
