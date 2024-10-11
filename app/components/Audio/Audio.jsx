'use client'
import { useState, useEffect, useRef } from 'react'
import c from './Audio.module.css'
export default function Audio({ musicLink, isPreviewing}) {
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
    // // the coment out is one the works with shorts but not in the couples page.
    // const regExp = /^.*((youtu.be\/|v\/|embed\/|watch\?v=|\&v=))([^#\&\?]*).*/;
    // const match = url.match(regExp);
    // return (match && match[3].length === 11) ? match[3] : null;
    const regExp = /(?:youtube\.com\/(?:shorts\/|watch\?v=|embed\/|v\/|.+\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return (match && match[1]) ? match[1] : null;
  };


  return (
    <div>
          {musicLink && (
            <>
              <div id="youtube-player" className={c.player}></div>
            </>
          )}

    {isPreviewing ? 
          videoId && (
            <iframe
              className={c["hidden-video"]}
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}`}
              allow="autoplay"
              title="YouTube audio player"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          )
    :  null}

    </div>
  )
}