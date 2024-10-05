'use client';
import { useState } from 'react';
import c from './test.module.css';
export default function page() {
  const [input, setInput] = useState('');
  const [videoId, setVideoId] = useState('');

  function handleInput(e) {
    const youtubeUrl = e.target.value;
    setInput(youtubeUrl);
    const id = extractVideoId(youtubeUrl);
    if (id) {
      setVideoId(id);
    }
  }

  const extractVideoId = (url) => {
    const regExp = /^.*((youtu.be\/|v\/|embed\/|watch\?v=|\&v=))([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[3].length === 11) ? match[3] : null;
  };
  
  return (
    <div>
      <input type='text' value={input} onChange={(e) => handleInput(e)}/>
      {videoId && (
        <iframe
        className={c["hidden-video"]}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}`}
        allow="autoplay"
        title="YouTube audio player"
        frameBorder="0"
        allowFullScreen
        ></iframe>
            )}
    <button onClick={(e) => handleInput(e)}>test</button>
    </div>
  )
}