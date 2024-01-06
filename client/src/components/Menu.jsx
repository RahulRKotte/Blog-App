import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Menu = ({ cat, paramPostId }) => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/posts/?cat=${cat}`);
        setPosts(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [cat]);

  const handleReadMore = (postId) => {
    navigate(`/post/${postId}`);
  };



  const filteredPosts = posts.filter((post) => post.id !== parseInt(paramPostId));

  return (
    <div className="menu">
      <h1>Other posts you may like</h1>
      {filteredPosts.map((post) => {
        return (
          <div className="post" key={post.id}>
            <img src={`../upload/${post.img}`} alt={post.title} />
            <h2>{post.title}</h2>
            <button onClick={() => handleReadMore(post.id)}>Read More</button>
          </div>
        );
      })}
    </div>
  );
};

export default Menu;
