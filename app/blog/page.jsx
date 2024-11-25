'use client'
import {useEffect, useState} from 'react';
import axios from 'axios';
import Post from '../components/Blog/Post';
import c from './blog.module.css';


export default function Page() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
      const getPosts = async () => {
        const res = await axios.get('/api/posts');
        setPosts(res.data.posts);
        // console.log('res.data', res.data.posts);
      }
      getPosts();
  }, []);


  
  return (
    <div className={c.cont}>
      <h1>Blog</h1>
      {posts.length > 0 && posts.map((post, index)=> {
        return <a href={`/blog/${post.postId}`} key={index}>
        <div className={c.postCont}>
          <img
            className={`${c.img} `}
            src={post.image}
            alt="gift idea, wooden box with paper qr code"
          />
          <div className={c.description}>
            <h2>{post.title}</h2>
            <p>{post.description} </p>
          </div>
        </div>
      </a>
      })}

    </div>
  );
}
