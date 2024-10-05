'use client'
import React, { useState, useEffect, } from 'react';
import { SlPicture } from 'react-icons/sl';
import Counter from './Counter/Counter';
import HeartAnimation from './Hearts/Hearts';
import Audio from '../Audio/Audio';
import c from './Preview.module.css';


// const test = ['/img1.jpg', '/img2.jpg', '/img3.jpg'] // , '/img3.jpg'

export default function Preview({ date, time, startCounting, url, photos, couplesName, musicLink, playBtn }) {
  // const [elapsedTime, setElapsedTime] = useState({
  //   years: 0,
  //   months: 0,
  //   days: 0,
  //   hours: 0,
  //   minutes: 0,
  //   seconds: 0,
  // });
  // console.log('run')
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isFading, setIsFading] = useState(false);
  const [imgsArray, setImgsArray] = useState([]);
  const [videoId, setVideoId] = useState('eVTXPUF4Oz4');
  const [link, setLink] = useState('eVTXPUF4Oz4');
  

  // PHOTOS ARRAY
  useEffect(() => {
    setImgsArray(photos);
  }, [photos]);

  // useEffect(() => {
  //   setLink(musicLink)
  // }, [musicLink]);

  
  // LOOP
  useEffect(() => {

    // if(photos.length === 0) return;

    const intervalId = setInterval(() => {
      setIsFading(true); // Start fading out
      setTimeout(() => {
        if (!imgsArray || imgsArray.length === 0) return;

        if(imgsArray.length > 0){
          setCurrentIndex(prev => (prev + 1) % imgsArray.length)
          setNextIndex((prev) => (prev + 1) % imgsArray.length)
          setIsFading(false); // Stop fading out
        }else{
          return
        }
      },2000)
    }, 6000); // Interval for image change

    return () => clearInterval(intervalId); // Cleanup the interval
  }, [imgsArray]);

 
  return (
    <div className={c.cont}>
      {/* {playBtn ? <button onClick={() => setLink(musicLink)}>play música</button> : null} */}
      {couplesName ? <div className={c.couplesName}>{couplesName}</div> : <div className={c.url}>qrcodelove.com/{url}</div>}
      
      <div className={c.imgs}>
      {imgsArray?.length > 0 ? (
        <>
        <HeartAnimation  />
        {/* {console.log('before sending to Audio in previewComponent:', musicLink)} */}
        <Audio musicLink={link} />
        <img
          src={imgsArray[nextIndex]} // Next image this will be live urls strings
          alt="next photo"
          width={300}
          height={450}
          className={`${c.photos} `} // Show next image while current fades out
        />
      <img
          src={imgsArray[currentIndex]}
          alt="current photo"
          width={300}
          height={450}
          className={`${c.photos} ${isFading? c.fadeOut : ''} `}
        />
         {/* <div className={`${c.animatedText} ${isFading ? c.moveUp : ''}`}>
              Slide Text
            </div> */}
        </>
      ) : <SlPicture size={30} />}
        
      </div>
      <Counter date={date} time={time} startCounting={startCounting} />
    </div>
  );
}
