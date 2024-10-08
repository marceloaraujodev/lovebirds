'use client'
import { useState, useEffect, useRef } from 'react'
import c from './Audio.module.css'
export default function Audio({ musicLink }) {
  const [videoId, setVideoId] = useState('');

  const playerRef = useRef(null);

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

  // Load YouTube API and initialize player
useEffect(() => {
  if (!videoId) return;

  const loadPlayer = () => {
    new window.YT.Player('youtube-player', {
      height: '300',
      width: '200',
      videoId: videoId,
      playerVars: {
        autoplay: 0,
        controls: 1,
        mute: 0,
        loop: 1,
        playlist: videoId,
      },
      events: {
        onReady: (event) => {
          playerRef.current = event.target;
          // Don't autoplay here, let the user control playback
        },
        onError: (event) => console.error("Error with YouTube player:", event),
      },
    });
  };

  if (window.YT && window.YT.Player) {
    loadPlayer();
  } else {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    window.onYouTubeIframeAPIReady = loadPlayer;
  }
}, [videoId]);


//  console.log(videoId) // eVTXPUF4Oz4
  return (
    <div>
          {musicLink && (
            <>
              <div id="youtube-player" className={c.player}></div>

            </>
          )}


      
      {/* {videoId && (
      <iframe
        className={c["hidden-video"]}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}`}
        allow="autoplay"
        title="YouTube audio player"
        frameBorder="0"
        allowFullScreen
      ></iframe>
    )} */}
    </div>
  )
}