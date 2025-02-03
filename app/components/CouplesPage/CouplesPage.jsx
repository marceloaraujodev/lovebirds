'use client';
import { useState, useEffect, useRef } from 'react';
import Preview from '../Preview/Preview';
import Audio from '../Audio/Audio';
import axios from 'axios';
import c from './CouplesPage.module.css';
import Error from '../../error/page';
import { BeatLoader } from 'react-spinners';
import { loadYouTubeAPI } from '@/app/utils/youtube';
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";
import { siteUrl } from '@/config'; 
import Modal from './Modal/Modal';
import formatText from '@/app/utils/formatText';
import { v4 as uuidv4 } from 'uuid';


// // const MODE = 'dev'  // if comment out url is production 
// const siteUrl = typeof MODE !== 'undefined' ? 'http://localhost:3000' : 'https://www.qrcodelove.com';

export default function CouplesPage({ couplesName, id }) {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [videoId, setVideoId] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const playerRef = useRef(null);
  const btnRef = useRef(null);

  // post use effect to change the firstAccss to true for gtag 
  // fetch couples data

  useEffect(() => {
    // Remove query parameters from mercado pago
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState(null, '', cleanUrl);
  }, []);


  // fetch data for couples page - also sets the firstAccess flag so gtag does not run unnecessaraly 
  useEffect(() => {
    const fetchData = async () => {
      console.log('compares with gtag running')
      try {
        const res = await axios.get(
          `${siteUrl}/api/${couplesName}/${id}`
        );
        setData(res.data.user);
        // google
        if(res.data.user.firstAccess === true && typeof window.gtag === 'function') {
          const transactionId = uuidv4();
          console.log('Gtag should only run on first access')
            // run gtag 
            window.gtag('event', 'conversion', {
              'send_to': 'AW-16751184617/qI-0COTM4uAZEOmVy7M-', // Your conversion ID
              'value': 1.0,
              'currency': 'BRL',
              'transaction_id': transactionId // track a individual transaction
            });
            
            // do a post request to first_access endpoint to change the firstAccess flag
            axios.post("/api/first_access", {
              hash: id,
              firstAccess: false,
            })
            .then(() => {
              console.log("First access updated successfully.");
            })
            .catch((error) => {
              console.error("Error updating first access:", error);
            });
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // calls it first
    fetchData();
  }, [couplesName, id]);

  // Load YouTube API and initialize player
  useEffect(() => {
    if (!videoId) return;

    loadYouTubeAPI()
      .then(YT => {
        playerRef.current = new YT.Player('youtube-player', {
          height: '200',
          width: '400',
          videoId: videoId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            mute: 1,
            loop: 1,
            playlist: videoId,
            host: 'https://www.youtube.com',
            origin: 'https://www.qrcodelove.com'
          },
          events: {
            // onReady: (event) => event.target.playVideo(),
            onError: (event) => console.error("Error with YouTube player:", event),
          },
        });
      })
      .catch(error => console.error("Error loading YouTube API:", error));
  }, [videoId]);

  // videoId comes from database
  useEffect(() => {
    if (data.musicLink) {
      const videoId = extractVideoId(data.musicLink);
      setVideoId(videoId);
    }
  }, [data]);

 

  // extract videoId function from the URL if is normal video or youtube shorts
  const extractVideoId = (url) => {
    const regExp = /(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/; // Standard YouTube
    const matchStandard = url.match(regExp);

    // Check for YouTube Shorts URL format
    const isShorts = url.includes('youtube.com/shorts/');
    const matchShorts = isShorts ? url.split('/').pop() : null; // Extract video id from shorts URL
    const videoId = matchStandard ? matchStandard[1] : matchShorts;

    return videoId;
  };

  function printQrCode(qrCodeUrl, size) { // size = 'Large' or 'Small'

    const qrWindow = window.open('', '_blank', 'width=600,height=600');
    qrWindow.document.write(`
      <html>
        <head>
          <title>Print QR Code</title>
         <style>
          body {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: white;
            font-family: Arial, sans-serif; /* Add a default font */
          }
          .qr-container {
            text-align: center;
          }
          .qr-text {
            font-weight: bold; 
            font-size: ${size === 'Large' ? '35px' : '18px'}; 
          }
          img {
            width: ${size === 'Large' ? '600px' : '200px'};
            height: ${size === 'Large' ? '600px' : '200px'};
          }
        </style>
        </head>
        <body>
        <div class="qr-container">
          <div class="qr-text">qrcodelove.com</div> 
          <img src="${qrCodeUrl}" alt="QR Code" />
          <div class="qr-text">qrcodelove.com</div> 
        </div>
        </body>
      </html>
    `);

    qrWindow.document.close();
    qrWindow.focus();
    qrWindow.print();

    qrWindow.onafterprint = () => {
      qrWindow.close();
    };
  }

   // Function to toggle mute
   const togglePlay = () => {
    
    if (!playerRef.current || typeof playerRef.current.playVideo !== 'function') {
      console.error('YouTube player is not ready yet.');
      return;
    }
    
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo(); 
      } else {
        playerRef.current.playVideo(); 
        playerRef.current.unMute()

        // trying to avois safari bug by delaying the play
        setTimeout(() => {
          if (playerRef.current.getPlayerState() !== YT.PlayerState.PLAYING) {
            playerRef.current.playVideo();
          }
        }, 500);
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle error when data is not present
  if (!data) {
    return <Error />;
  }

  return (
    <div className={c.cont}>
      {data.musicLink ? (
        <button ref={btnRef} onClick={togglePlay} className={c.play}>
        {isPlaying ?  (
          <>
          <span className={c.btnText}>Pausar música</span>
          <FaPause /> 
        </>)  : (
          <>
          <span className={c.btnText}> Play música</span>
          <FaPlay />
          </>
        )
        }
      </button>
      ) : null}
      

      {isLoading ? (
        <div className={c.loader}>
          <BeatLoader
            color="#ffffff"
            size={20}
            aria-label="Loading Spinner"
            data-testid="loader"
            speedMultiplier={1}
          />
        </div>
      ) : (
        <>
          <Preview
            date={data.date}
            time={data.time}
            startCounting={true}
            url={data.url}
            couplesName={data.name}
            photos={data.photos}
            musicLink={data.musicLink}
            playBtn={true}
          />
          
          <div className={c.messageCont}>
            <h2>Mensagem</h2>
            <div className={c.message}>
              <p>{formatText(data.message)}</p>
            </div>
          </div>
          <div onClick={() => setIsModalOpen(true)} className={c.qrCode}>
            <img className={c.img} src={data.qrCode} alt="qr code" />
          </div>
          <div className={c.print}>Imprimir: <div>
          <span onClick={() => printQrCode(data.qrCode, 'Large')}>Grande</span> | <span onClick={() => printQrCode(data.qrCode, 'Small')}>Pequeno</span></div>
            </div>


          {data.musicLink && (
            <>
              <div id="youtube-player" className={c.player}></div>

            </>
          )}

          {isModalOpen && <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} qrCodeUrl={data.qrCode} />}
        </>
      )}
    </div>
  );
}

