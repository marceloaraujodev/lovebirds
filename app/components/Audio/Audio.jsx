'use client'
import { useState, useEffect, useRef } from 'react'
import c from './Audio.module.css'
export default function Audio({ musicLink, isPlaying }) {
  const [videoId, setVideoId] = useState('');
  const [playerReady, setPlayerReady] = useState(false); 
  const playerRef = useRef(null);


// Load YouTube API and initialize player
useEffect(() => {
  if (!videoId) return;

  const loadPlayer = () => {
    new window.YT.Player('youtube-player', {
      height: '300',
      width: '400',
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        controls: 1,
        mute: 0,
        loop: 1,
        playlist: videoId,
        origin: 'https://www.qrcodelove.com',
      },
      events: {
        onReady: (event) => {
          playerRef.current = event.target; // Set player reference
          setPlayerReady(true); // Mark player as ready
          console.log('Player initialized:', playerRef.current); // Log player reference
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

  useEffect(() => {
    console.log('isPlaying state changed:', isPlaying);
  
    if (playerReady && playerRef.current) { // Ensure player is ready before reacting to isPlaying
      if (isPlaying) {
        console.log('Playing video...');
        playerRef.current.playVideo();
      } else {
        console.log('Pausing video...');
        playerRef.current.pauseVideo();
      }
    } else {
      console.log('Player ref is not set yet, waiting for initialization...');
    }
  }, [isPlaying, playerReady]);

  return (
    <div>

      {musicLink && (
            <>
              <div id="youtube-player" className={c.player}></div>
            </>
      )}
      
    </div>
  )
}