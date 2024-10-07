// youtubeApi.js

// export function loadYouTubeAPI() {
//   return new Promise((resolve, reject) => {
//     if (window.YT) {
//       resolve(window.YT); // Already loaded
//       return;
//     }

//     // Set up the global callback
//     window.onYouTubeIframeAPIReady = () => {
//       resolve(window.YT);
//     };

//     // Load the YouTube API script
//     const script = document.createElement('script');
//     script.src = "https://www.youtube.com/iframe_api";
//     script.async = true;
//     script.onerror = () => reject(new Error("YouTube API failed to load"));
//     document.body.appendChild(script);
//   });
// }
