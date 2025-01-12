import { useState, useEffect, useRef } from 'react';
import Preview from '../Preview/Preview';
import { FaCameraRetro } from 'react-icons/fa6';
import c from './Form.module.css';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import { BeatLoader } from 'react-spinners';
import { MODE } from '@/config';
import isEmail from 'is-email';
import {addPhotoToBucket, listFilesInBucket} from '../../utils/uploadSingleImageToBucket';
import firebaseInit from '@/app/utils/firebaseInit';




// sanitize name
function sanitizeName(name) {
  // Normalize the string and remove accents/diacritics (e.g., 'é' becomes 'e')
  return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// will use hash for the test change it to email later to retrieve user information in the 
// will have a button to edit that will retirect to this page
// load the data from the database and populate in the fields and let user edit
// will click on the button in the couples page redirect to login 
// after login the user will be redirected to this page


// Todo first from list above and more
// 1. pull info from db and loaded on the form fields
// 2. create a image display square icons
// 3. when deleting image also delete from database urls and firebase folderpath

export default function EditPage() {
  const [couplesName, setName] = useState(''); // "e test"
  const [email, setEmail] = useState(''); 
  const [date, setDate] = useState(''); // "2024-10-17"
  const [time, setTime] = useState(''); // "10:41"
  const [photos, setPhotos] = useState([]); // [File, File]
  const [musicLink, setMusicLink] = useState(''); // youtube url
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [photoPreviews, setPhotoPreviews] = useState([]); // ["blob:http://localhost:3000/f...
  const [startCounting, setStartCounting] = useState(false);

  const fileRef = useRef(null);

  const hash = '900e1c14-88d9-46a6-afbd-7152b3b64006'; // hash and or email - 900e1c14-88d9-46a6-afbd-7152b3b64006 hash

  // gets user information to populate fields
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`/api/userprofile/getuser/${hash}`);

      console.log(res.data.user)
      if(res.status === 200 && res.data.user){
        setName(res.data.user.name);
        setDate(res.data.user.date);
        setTime(res.data.user.time);
        setMusicLink(res.data.user.musicLink);
        setMessage(res.data.user.message);
        console.log(res.data.user.name)

        // not all users have email this feature was added later on
        if(res.data.user.email){
          setEmail(res.data.user.email);
        }
      }
    };
    fetchData()
  }, [])

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
    const maxPhotos = 3;
    const previews = [];
    const validPhotos = [];
    const maxSize = 900 * 1024;

    // const previews = files.map((file) => URL.createObjectURL(file)); // Create Blob URLs for each file

    // checks the amount of photos allowed
    if (photos.length + files.length > maxPhotos) {
      alert('Maximum 3 photos allowed!');
      setIsLoadingPhotos(false);
      return;
    }

    // checks size of files if biggern than 1.5mb alerts and clears previews else add to preview
    for (let file of files) {
      if (file.size > maxSize) {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1, // Set the max size limit in MB
          maxWidthOrHeight: 1920, // Optionally resize image
          useWebWorker: true, // Enable multi-threading for faster compression
        });

        // Check the size of the compressed image
        // const compressedSizeMB = compressedFile.size / (1024 * 1024);
        // console.log(`Compressed file size: ${compressedSizeMB.toFixed(2)} MB`);

        const objectUrl = URL.createObjectURL(compressedFile);
        validPhotos.push(compressedFile);
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
      return updatedPhotos;
    });
    setIsPreviewing(true);
    setIsLoadingPhotos(false);
  }

  // click for the file picker
  function handlePhotosPick(e) {
    e.preventDefault();
    if (fileRef.current) {
      fileRef.current.click();
    }
  }

 
  async function handleSubmit(e) {
    e.preventDefault();
    // // Validate the name field
    // if (!couplesName.trim()) {
    //   alert('Por favor, insira um nome válido!');
    //   setIsLoading(false);
    //   return;
    // }
    // // validates date
    // if (!date.trim()) {
    //   alert('Por favor, insira uma data válida!');
    //   setIsLoading(false);
    //   return;
    // }

    // if(!message){
    //   alert('Por favor, insira uma mensagem!');
    //   setIsLoading(false);
    //   return;
    // }

    // // validates time
    // if (!time.trim()) {
    //   alert('Por favor, insira um horário válido!');
    //   setIsLoading(false);
    //   return;
    // }

    setIsLoading(true);
    if (photos.length > 3) {
      alert('Maximum 3 photos allowed!');
      return;
    }
    // // validates email
    // if (!isEmail(email)) {
    //   alert("Email is not valid!");
    //   return;
    // } 


    // const hash = uuidv4();
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();

    //Append fields do formData
    formData.append('name', couplesName);
    formData.append('email', email);
    formData.append('date', date);
    formData.append('time', time);
    formData.append('musicLink', musicLink);
    formData.append('message', message);
    // formData.append('url', `${path}/${hash}`);
    photos.forEach((file) => formData.append('photos', file));

    // submit edited data  instead of post use use patch
    try {
      // // call the api 
      // const res = await axios.post(`/api/userProfile/${userId}/update`, formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data', // If you're sending files
      //   },
      // });



    // // // Example usage - using only this for testing now need to see if image goes to this bucket
    // // const files = photos // Array of file objects
    // // remove the hardcoded path and comment out the addPhotoToBucket function for now
    // const folderPath = "purchases/Fernanda Patricia da Silva-04d946a5-df1c-47cb-8505-5804f231670d";
    // const name = "additional-photo";

    // // adds one or more photos to the bucket - folder path iss the firebase folder structure like above
    // addPhotoToBucket(photos, folderPath, name)
    //  .then((url) => {
    //   console.log("Photo URL -> this is the one that I want:", url);
    // })
    // .catch((error) => {
    //   console.error("Failed to upload photo:", error);
    //   console.log("Error details:", error.response ? error.response.data : error.message);
    // });

    // listFilesInBucket()


    } catch (error) {
      console.log(error);
    }


    setIsLoading(false);
    setIsPreviewing(false);
  }

  function createPageSubmit(e) {
    setIsLoading(true);
    handleSubmit(e);
  }

  return (
    <>
    <div className={c.cont}>
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
      {/* <div>
        <Preview
          date={date}
          time={time}
          startCounting={startCounting}
          url={path}
          photos={photoPreviews}
          musicLink={musicLink}
          isPreviewing={isPreviewing}
          clearPhotos={clearPhotos}
        />
      </div> */}
    </div>
    </>
  );
}
