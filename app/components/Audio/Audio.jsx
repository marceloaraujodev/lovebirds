'use client'
import { useState, useEffect } from 'react'
import c from './Audio.module.css'
export default function Audio({ musicLink }) {
  const [videoId, setVideoId] = useState('');


  useEffect(() => {
    if (musicLink) {
      const id = extractVideoId(musicLink);
      if (id) {
        setVideoId(id);
      }
    }
  }, [musicLink]);

    const extractVideoId = (url) => {
    const regExp = /^.*((youtu.be\/|v\/|embed\/|watch\?v=|\&v=))([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[3].length === 11) ? match[3] : null;
  };



//  console.log(videoId) // eVTXPUF4Oz4
  return (
    <div>
      
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
    </div>
  )
}