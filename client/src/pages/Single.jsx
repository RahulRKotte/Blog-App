import React, { useContext, useEffect, useState } from "react";
import Delete from "../images/delete.png";
import Edit from "../images/edit.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import axios from "axios";
import moment from 'moment';
import {AuthContext} from '../context/authContext';
import HTMLReactParser from "html-react-parser";

const Single = () => {

  const [post, setPost] = useState({});
  const location = useLocation();
  const postId = location.pathname.split("/")[2];
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/posts/${postId}`);
        setPost(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [postId]);

  const handleDelete = async () =>{
    try {
      await axios.delete(`/posts/${postId}`);
      navigate('/')
    } catch (err) {
      console.log(err);
    }
  }


  return (
    <div className="single">
      <div className="content">
      <img src={post.img && post.img !== '' ? `/upload/${post.img}` : '/upload/defaultimg.png'} alt="post-img" />
        <div className="user">
          {post.userImg && <img
            src={post.userImg}
            alt="profile-pic"
          />}
          <div className="info">
            <span>{post.username}</span>
            <p>Posted {moment(post.date).fromNow()}</p>
          </div>
          {currentUser && currentUser.username === post.username && <div className="edit">
            <Link to={`/write?edit=2`} state={post}>
              <img src={Edit} alt="edit-icon" />
            </Link>
            <img onClick={handleDelete} src={Delete} alt="delete-icon" />
          </div>}
        </div>
        <h1>{post.title}</h1>
        <div>{typeof post.desc === 'string' ? HTMLReactParser(post.desc) : post.desc}</div>
      </div>
      <Menu cat={post.cat} paramPostId={postId} />
    </div>
  );
};

export default Single;
