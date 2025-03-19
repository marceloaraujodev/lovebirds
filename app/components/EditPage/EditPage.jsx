'use client'
import { useState, useEffect, useRef } from 'react';
import { FaCameraRetro } from 'react-icons/fa6';
import { BeatLoader, FadeLoader } from 'react-spinners';
import c from './Form.module.css';
import axios from 'axios';
import Preview from '../Preview/Preview';
import imageCompression from 'browser-image-compression';
import { MODE } from '@/config';
import isEmail from 'is-email';
import {addPhotoToBucket, listFilesInBucket} from '../../utils/uploadSingleImageToBucket';
import firebaseInit from '@/app/utils/firebaseInit';
import uploadImages from '@/app/utils/uploadToBucket';


// sanitize name
function sanitizeName(name) {
  // Normalize the string and remove accents/diacritics (e.g., 'é' becomes 'e')
  return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export default function EditPage({ data }) {
  const [couplesName, setName] = useState(''); // "e test"
  const [email, setEmail] = useState(''); 
  const [date, setDate] = useState(''); // "2024-10-17"
  const [time, setTime] = useState(''); // "10:41"
  const [musicLink, setMusicLink] = useState(''); // youtube url
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
  const [path, setPath] = useState('');
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [photos, setPhotos] = useState([]); // [File, File]
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [photoPreviews, setPhotoPreviews] = useState([]); // ["blob:http://localhost:3000/f...
  const [startCounting, setStartCounting] = useState(false);

  const fileRef = useRef(null);

  // // UNCOMMENT THE HASH! ⚠️⚠️
  // const hash = '2a183a4d-0f72-48e6-8801-a351f913240d'; // hash and or email - 900e1c14-88d9-46a6-afbd-7152b3b64006 hash


  // gets user information to populate fields
  useEffect(() => {
    // setIsPageLoading(true)

    if(data){
      console.log(data)
      // setIsPageLoading(false);
      setName(data.user.name);
      setDate(data.user.date);
      setTime(data.user.time);
      setMusicLink(data.user.musicLink);
      setMessage(data.user.message);
      setPhotos(data.user.photos)
      // not all users have email this feature was added later on
      if(data?.user?.email){
        
        setEmail(data.user.email);
      }
    }
  }, [data])

  // starts counting Timer
  useEffect(() => {
      if (date && time) {
        setStartCounting(true); // Start counting when the user submits date and time
      }
  }, [date, time]);

  function clearPhotos() {
    setPhotos([]);
    setPhotoPreviews([]);
    setIsPreviewing(false);
  }

  async function handleFileChange(e) {
    setIsLoadingPhotos(true);
    const files = Array.from(e.target.files); // Convert FileList to array
    const maxPhotos = 4;
    const previews = [];
    const validPhotos = [];
    const maxSize = 900 * 1024;

    console.log('files', files)

    // checks the amount of photos allowed
    if (photos.length + files.length > maxPhotos) {
      alert('Maximum 3 photos allowed!');
      setIsLoadingPhotos(false);
      return;
    }

    // checks size of files if biggern than 1.5mb alerts and clears previews else add to preview
    for (let file of files) {
      if (file.size > maxSize) {
        console.log('file in loop', file)
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1, // Set the max size limit in MB
          maxWidthOrHeight: 1920, // Optionally resize image
          useWebWorker: true, // Enable multi-threading for faster compression
        });

        // Check the size of the compressed image
        const compressedSizeMB = compressedFile.size / (1024 * 1024);
        console.log(`Compressed file size: ${compressedSizeMB.toFixed(2)} MB`);

        const objectUrl = URL.createObjectURL(compressedFile);
        validPhotos.push(compressedFile);
        console.log('vaildphotos added, ', validPhotos)
        previews.push(objectUrl);
      } else {
        const objecUrl = URL.createObjectURL(file);
        validPhotos.push(file);
        previews.push(objecUrl);
      }
    }

    setPhotoPreviews((prevPreviews) => {
      const updatedPreviews = [...prevPreviews, ...previews].slice(
        0,
        maxPhotos
      );
      return updatedPreviews;
    });

    setPhotos((prevPhotos) => {
      const updatedPhotos = [...prevPhotos, ...validPhotos].slice(0, maxPhotos);
      console.log('updated photos', updatedPhotos);
      return updatedPhotos;
    });
    // setIsPreviewing(true);
    setIsLoadingPhotos(false);
  }

  // click for the file picker
  function handlePhotosPick(e) {
    e.preventDefault();
    if (fileRef.current) {
      fileRef.current.click();
    }
  }

  function formatUrl(nameInput) {
    const nameArr = nameInput.split(' ');
    const formattedName = nameArr.map((word) => word.split(',')).join('-');
    setPath(sanitizeName(formattedName));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true); 

    // Validate the name field
    if (!couplesName.trim()) {
      alert('Por favor, insira um nome válido!');
      setIsLoading(false);
      return;
    }
    // validates date
    if (!date.trim()) {
      alert('Por favor, insira uma data válida!');
      setIsLoading(false);
      return;
    }

    if(!message){
      alert('Por favor, insira uma mensagem!');
      setIsLoading(false);
      return;
    }

    // validates time
    if (!time.trim()) {
      alert('Por favor, insira um horário válido!');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    if (photos.length > 3) {
      alert('Maximum 3 photos allowed!');
      return;
    }
    
    // validates email
    if (!isEmail(email)) {
      alert("Email is not valid!");
      return;
    } 

    const formData = new FormData();

    formData.append('name', couplesName);
    formData.append('email', email);
    formData.append('date', date);
    formData.append('time', time);
    formData.append('musicLink', musicLink);
    formData.append('message', message);
    formData.append('url', `${path}/${hash}`);
    photos.forEach((file) => formData.append('photos', file));  

    console.log(formData);

    // submit edited data  instead of post use use patch
    try {

      // call the api 
      const res = await axios.patch(`http://localhost:3000/api/userprofile/edit/${hash}`, 
      formData ,
        {
        headers: {
          'Content-Type': 'multipart/form-data', // If you're sending files
        },
      }
    );

      // console.log('this is my res after trying to update:', res);
      if(res.status === 200) {
        alert('Conta atualizada com sucesso!');
        clearFields();
        clearPhotos();
        setIsPreviewing(false);
        setIsPageLoading(false);
        history.push('/');
      }


    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
    // setIsPreviewing(false);
  }

  function createPageSubmit(e) {
    setIsLoading(true);
    handleSubmit(e);
  }

  return (
    <>
    <div className={c.cont}>
      {/* {isPageLoading && <BeatLoader color='white' size={40} className={c.grow} />} */}

      <form className={c.form} onSubmit={(e) => handleSubmit(e)} id="form">

        <label className={c.musicLink}>
          Música do youtube:
          <input
            className={c.musicLinkInput}
            onChange={(e) => {
              setMusicLink(e.target.value);
            }}
            value={musicLink}
            type="text"
            name="musicLink"
            placeholder="Link da música"
          />
        </label>

        <div className={c.detailsCont}>
          <label className={c.couplesName}>
            Nome:
            <input
              onChange={(e) => {
                const updatedName = e.target.value;
                setName(sanitizeName(updatedName));
                formatUrl(updatedName);
              }}
              value={couplesName}
              type="text"
              required
              name="name"
              placeholder="Name"
            />
          </label>
          <label className={c.couplesName}>
            Email:
            <input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
              type="text"
              // required
              name="email"
              placeholder="Email"
            />
          </label>

          <label className={c.startDate}>
            Data:
            <input
              type="date"
              name="date"
              // required
              onChange={(e) => setDate(e.target.value)}
              value={date}
            />
          </label>

          <label className={c.timer}>
            Insira um horário
            <input
              type="time"
              name="timer"
              // required
              onChange={(e) => setTime(e.target.value)}
              value={time}
            />
          </label>

        </div>

        <div className={c.messageCont}>
          <label className={c.message}>
            Mensagem:
            <textarea
              onChange={(e) => setMessage(e.target.value)}
              name="message"
              placeholder="Demostre seu amor!"
              value={message}
            />
          </label>
        </div>

        {/* Photos button */}
        <button
          type="button"
          onClick={handlePhotosPick}
          className={`${c.btn} ${c.cameraCont}`}>
          <div>
            <FaCameraRetro size={20} />
          </div>{' '}
          {isLoadingPhotos ? (
            <>
              <BeatLoader color="#ffffff" /> <p>comprimindo suas fotos...</p>
            </>
          ) : (
            <span>Escolha as fotos (Max 3)</span>
          )}
        </button>

        {/* file picker */}
        <input
          className={c.filePicker}
          type="file"
          name="photos"
          multiple
          ref={fileRef}
          onChange={handleFileChange}
        />

          <button
            onClick={createPageSubmit}
            className={`${c.btn} ${c.create}`}
            type="submit"
            disabled={isLoading}>
            {isLoading ? <BeatLoader color="#ffffff" /> : 'Editar Página'}
          </button>
      </form>
      <div>
        <Preview
          date={date}
          time={time}
          startCounting={startCounting}
          url={path ? path : ''}
          photos={photoPreviews}
          musicLink={musicLink}
          isPreviewing={isPreviewing}
          clearPhotos={clearPhotos}
        />
      </div>
    </div>
    </>
  );
}
