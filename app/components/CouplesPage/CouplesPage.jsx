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

// const MODE = 'dev'  // if comment out url is production 
const siteUrl = typeof MODE !== 'undefined' ? 'http://localhost:3000' : 'https://www.qrcodelove.com';
console.log(siteUrl);



export default function CouplesPage({ couplesName, id }) {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [videoId, setVideoId] = useState('');
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const playerRef = useRef(null);
  const btnRef = useRef(null);

  // fetch couples data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${siteUrl}/api/${couplesName}/${id}`
        );
        setData(res.data.user);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [couplesName, id]);

// Load YouTube API and initialize player
useEffect(() => {
  if (!videoId) return;

  loadYouTubeAPI()
    .then(YT => {
      playerRef.current = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          mute: 1,
          loop: 1,
          playlist: videoId,
        },
        events: {
          // onReady: (event) => event.target.playVideo(),
          onError: (event) => console.error("Error with YouTube player:", event),
        },
      });
    })
    .catch(error => console.error("Error loading YouTube API:", error));
}, [videoId]);

  // Extract videoId from the URL and set it
  useEffect(() => {
    if (data.musicLink) {
      const videoId = extractVideoId(data.musicLink);
      setVideoId(videoId);
    }
  }, [data]);

  // extract videoId function
  const extractVideoId = (url) => {
    const regExp = /(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=))([^&\n]{11})/;
    const match = url.match(regExp);
    const videoId = (match && match[1]) ? match[1] : null; // Capture group 1
    console.log("Extracted video ID:", videoId); // Log the extracted video ID
    return videoId;
  };

  function printQrCode(qrCodeUrl) {
    console.log(qrCodeUrl);
    const qrWindow = window.open('', '_blank', 'width=600,height=600');
    qrWindow.document.write(`
      <html>
        <head>
          <title>Print QR Code</title>
          <style>
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background-color: white;
            }
            img {
              width: 600px;
              height: 600px;
            }
          </style>
        </head>
        <body>
          <img src="${qrCodeUrl}" alt="QR Code" />
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
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo(); 
      } else {
        playerRef.current.playVideo(); 
        playerRef.current.unMute()
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
              <p>{data.message}</p>
            </div>
          </div>
          <div onClick={() => printQrCode(data.qrCode)} className={c.qrCode}>
            <img className={c.img} src={data.qrCode} alt="qr code" />
          </div>
          <p className={c.print} onClick={() => printQrCode(data.qrCode)}>imprimir</p>


          {data.musicLink && (
            <>
              <div id="youtube-player" className={c.player}></div>

            </>
          )}
        </>
      )}
    </div>
  );
}














// 'use client';
// import { useState, useEffect, useRef } from 'react';
// import Preview from '../Preview/Preview';
// import Audio from '../Audio/Audio';
// import axios from 'axios';
// import c from './CouplesPage.module.css';
// import Error from '../../error/page';
// import { BeatLoader } from 'react-spinners';
// // import { loadYouTubeAPI } from '@/app/utils/youtube';
// import { FaPlay } from "react-icons/fa";
// import { FaPause } from "react-icons/fa6";

// const MODE = 'dev'  // if comment out url is production 
// const siteUrl = typeof MODE !== 'undefined' ? 'http://localhost:3000' : 'https://www.qrcodelove.com';
// console.log(siteUrl);

// export default function CouplesPage({ couplesName, id }) {
//   const [data, setData] = useState({});
//   const [isLoading, setIsLoading] = useState(true);
//   const [videoId, setVideoId] = useState('');
//   const [isPlaying, setIsPlaying] = useState(false);

//   const btnRef = useRef(null);

//   // fetch couples data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await axios.get(
//           `${siteUrl}/api/${couplesName}/${id}`
//         );
//         setData(res.data.user);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchData();
//   }, [couplesName, id]);

//   // Extract videoId from the URL and set it
//   useEffect(() => {
//     if (data.musicLink) {
//       const videoId = extractVideoId(data.musicLink);
//       setVideoId(videoId);
//     }
//   }, [data]);

//   // extract videoId function
//   const extractVideoId = (url) => {
//     const regExp = /(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=))([^&\n]{11})/;
//     const match = url.match(regExp);
//     const videoId = (match && match[1]) ? match[1] : null; // Capture group 1
//     console.log("Extracted video ID:", videoId); // Log the extracted video ID
//     return videoId;
//   };

//   function printQrCode(qrCodeUrl) {
//     console.log(qrCodeUrl);
//     const qrWindow = window.open('', '_blank', 'width=600,height=600');
//     qrWindow.document.write(`
//       <html>
//         <head>
//           <title>Print QR Code</title>
//           <style>
//             body {
//               display: flex;
//               justify-content: center;
//               align-items: center;
//               height: 100vh;
//               margin: 0;
//               background-color: white;
//             }
//             img {
//               width: 600px;
//               height: 600px;
//             }
//           </style>
//         </head>
//         <body>
//           <img src="${qrCodeUrl}" alt="QR Code" />
//         </body>
//       </html>
//     `);

//     qrWindow.document.close();
//     qrWindow.focus();
//     qrWindow.print();

//     qrWindow.onafterprint = () => {
//       qrWindow.close();
//     };
//   }

//   // Toggle play and pause for the video
//   const togglePlay = () => {
//     // if (playerRef.current) {
//     //   if (isPlaying) {
//     //     playerRef.current.pauseVideo();
//     //   } else {
//     //     playerRef.current.playVideo();
//     //   }
//       setIsPlaying(!isPlaying);
//     // }
//   };

//   // Handle error when data is not present
//   if (!data) {
//     return <Error />;
//   }

//   return (
//     <div className={c.cont}>

//       <button ref={btnRef} onClick={() => togglePlay()} className={c.play}>
//         {isPlaying ?  (
//           <>
//           <span className={c.btnText}>Pausar música</span>
//           <FaPause /> 
//         </>)  : (
//           <>
//           <span className={c.btnText}> Play música</span>
//           <FaPlay />
//           </>
//         )
//         }
//       </button>

//       {isLoading ? (
//         <div className={c.loader}>
//           <BeatLoader
//             color="#ffffff"
//             size={20}
//             aria-label="Loading Spinner"
//             data-testid="loader"
//             speedMultiplier={1}
//           />
//         </div>
//       ) : (
//         <>
//           <Preview
//             date={data.date}
//             time={data.time}
//             startCounting={true}
//             url={data.url}
//             couplesName={data.name}
//             photos={data.photos}
//             musicLink={data.musicLink}
//             isPlaying={isPlaying}
//           />
          
//           <div className={c.messageCont}>
//             <h2>Mensagem</h2>
//             <div className={c.message}>
//               <p>{data.message}</p>
//             </div>
//           </div>
//           <div onClick={() => printQrCode(data.qrCode)} className={c.qrCode}>
//             <img className={c.img} src={data.qrCode} alt="qr code" />
//           </div>
//           <p className={c.print} onClick={() => printQrCode(data.qrCode)}>imprimir</p>


//           {/* {data.musicLink && (
//             <>
//               <div id="youtube-player" className={c.player}></div>

//             </>
//           )} */}
//         </>
//       )}
//     </div>
//   );
// }
