"use client";
import React, { useState, useEffect } from "react";
import { SlPicture } from "react-icons/sl";
import Counter from "./Counter/Counter";
import HeartAnimation from "./Hearts/Hearts";
import Audio from "../Audio/Audio";
import Shaka from "./Shaka/Shaka";
import c from "./Preview.module.css";

// const test = ['/img1.jpg', '/img2.jpg', '/img3.jpg'] // , '/img3.jpg'

export default function Preview({
  date,
  time,
  startCounting,
  url,
  photos,
  couplesName,
  musicLink,
  isPreviewing,
  clearPhotos,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isFading, setIsFading] = useState(false);
  const [imgsArray, setImgsArray] = useState([]);
  const [link, setLink] = useState("");

  // PHOTOS ARRAY
  useEffect(() => {
    setImgsArray(photos);
  }, [photos]);

  useEffect(() => {
    setLink(musicLink);
  }, [musicLink]);

  // LOOP
  useEffect(() => {
    // if only one image not fade in and out need
    if (!imgsArray || imgsArray.length <= 1) return;

    const intervalId = setInterval(() => {
      setIsFading(true); // Start fading out
      setTimeout(() => {
        if (!imgsArray || imgsArray.length === 0) return;

        setCurrentIndex((prev) => (prev + 1) % imgsArray.length);
        setNextIndex((prev) => (prev + 1) % imgsArray.length);
        setIsFading(false); // Stop fading out
      }, 2000);
    }, 6000); // Interval for image change

    return () => clearInterval(intervalId); // Cleanup the interval
  }, [imgsArray]);

  return (
    <div className={c.cont}>
      {couplesName ? (
        <div className={c.couplesName}>{couplesName}</div>
      ) : (
        <div className={c.url}>qrcodelove.com/{url}</div>
      )}

      {isPreviewing && <div className={c.previewDisplay}>Preview</div>}

      <div className={c.imgs}>
        {imgsArray.length > 0 ? (
          <>
            <HeartAnimation />
            {/* <Shaka /> */}
            {musicLink ? <Audio className={c.video} musicLink={link} isPreviewing={isPreviewing} /> : null}

            {imgsArray.length === 1 ? (
              <img
                src={imgsArray[0]} // Next image this will be live urls strings
                alt="next photo"
                width={300}
                height={450}
                className={`${c.photos} `} // Show next image while current fades out
              />
            ) : (
              <>
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
                  className={`${c.photos} ${isFading ? c.fadeOut : ""} `}
                />
              </>
            )}
            {/* <div className={`${c.animatedText} ${isFading ? c.moveUp : ''}`}>
              Slide Text
            </div> */}
          </>
        ) : (
          <SlPicture size={30} />
        )}
      </div>
      <Counter date={date} time={time} startCounting={startCounting} />
      {isPreviewing && (
        <button className={c.clearPhotosBtn} onClick={clearPhotos}>
          Limpar fotos
        </button>
      )}
    </div>
  );
}
