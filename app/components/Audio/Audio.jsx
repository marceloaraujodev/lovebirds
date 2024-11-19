'use client'
import { useState, useEffect} from 'react'
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

    // extracts video id from normal videos and shorts videos.
    const extractVideoId = (url) => {
    const regExp = /(?:youtube\.com\/(?:shorts\/|watch\?v=|embed\/|v\/|.+\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return (match && match[1]) ? match[1] : null;
  };

  return (
    <div>
          {musicLink && (
            <>
              <div id="youtube-player" className={c.hidden}></div>
            </>
          )}

    {isPreviewing ? 
          videoId && (
            <div className={c.hidden}>
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}`}
                allow="autoplay"
                title="YouTube audio player"
                allowFullScreen
              ></iframe>
            </div>
          )
    :  null}

    </div>
  )
}