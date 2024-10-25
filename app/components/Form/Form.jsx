import { useState, useEffect, useRef } from 'react';
import Preview from '../Preview/Preview';
import { FaCameraRetro } from "react-icons/fa6";
import c from './Form.module.css';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import { BeatLoader } from 'react-spinners';

// sanitize name
function sanitizeName(name) {
  // Normalize the string and remove accents/diacritics (e.g., 'é' becomes 'e')
  return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export default function Form() {
  const [couplesName, setName] = useState('') // "e test"
  const [date, setDate] = useState('') // "2024-10-17"
  const [time, setTime] = useState('') // "10:41"
  const [photos, setPhotos] = useState([]) // [File, File]
  const [musicLink, setMusicLink] = useState(''); // youtube url
  const [photoPreviews, setPhotoPreviews] = useState([]) // ["blob:http://localhost:3000/f...
  const [startCounting, setStartCounting] = useState(false);
  const [url, setUrl] = useState('') // "e-test" how part of the url will be. url/hash 
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
  const fileRef = useRef(null);
  // const [qrcode, setQrcode] = useState('');

  useEffect(() => {
    console.log('Current NODE_ENV:', process.env.NODE_ENV); // Logs NODE_ENV in the browser console
  }, []);

  // starts counting Timer
  useEffect(() => {
    if (date && time) {
      setStartCounting(true); // Start counting when the user submits date and time
    }
  },[date, time]);


  async function handleFileChange(e){
    setIsLoadingPhotos(true);
    const files = Array.from(e.target.files); // Convert FileList to array
    const previews = [];
    const validPhotos = [];

    const maxSize = 900 * 1024  
    
    // const previews = files.map((file) => URL.createObjectURL(file)); // Create Blob URLs for each file

    if(files.length > 3){
      alert('Maximum 3 photos allowed!');
      setIsLoadingPhotos(false);
      return;
    }
    // checks size of files if biggern than 1.5mb alerts and clears previews else add to preview
    for(let file of files){
      if(file.size > maxSize){
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
        previews.push(objectUrl);
      }else{
        const objecUrl = URL.createObjectURL(file);
        validPhotos.push(file);
        previews.push(objecUrl);
      }
    }

    setPhotoPreviews(previews);
    setPhotos(validPhotos); 
    setIsPreviewing(true);
    setIsLoadingPhotos(false);
  }

  // click for the file picker
  function handlePhotosPick(e){
    e.preventDefault();
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  function formatUrl(nameInput){
    const nameArr = nameInput.split(' ');
    const formattedName = nameArr.map(word => word.split(',')).join('-');
    setUrl(sanitizeName(formattedName))
  }

  // need to change to send the submittion to stripe api then use webhook
  async function handleSubmit(e){
    e.preventDefault();
      // Validate the name field
      if (!couplesName.trim()) {
        alert('Por favor, insira um nome válido!');
        setIsLoading(false);
        return;
      }
      // validates date
      if(!date.trim()){
        alert('Por favor, insira uma data válida!')
        setIsLoading(false);
        return;
      }

      // validates time
      if(!time.trim()){
        alert('Por favor, insira um horário válido!')
        setIsLoading(false);
        return;
      }

    setIsLoading(true)
    if (photos.length > 3){
      alert('Maximum 3 photos allowed!')
      return;
    }

    const hash = uuidv4();
    e.preventDefault();
    setIsLoading(true); 
    const formData = new FormData();

    //Append fields do formData
    formData.append('name', couplesName);
    formData.append('date', date);
    formData.append('time', time);
    formData.append('musicLink', musicLink);
    formData.append('message', message);
    formData.append('hash', hash);
    formData.append('url', `${url}/${hash}`);
    photos.forEach((file) => formData.append('photos', file));

    const couplesNameEnconded = encodeURIComponent(couplesName)

    console.log('Couples encoded url:', couplesNameEnconded)
    console.log('url being submitted:', `${couplesNameEnconded}/${hash}`)

    formData.append('url', `${couplesNameEnconded}/${hash}`);


    try {
      const res = await axios.post('/api/create-checkout-session', formData,
        {
              headers: {
            'Content-Type': 'multipart/form-data', // Important for file uploads
          }
        });
        
          // Call gtag to report conversion
          window.gtag('event', 'conversion', {
            'send_to': 'AW-16751184617/qI-0COTM4uAZEOmVy7M-', // Your conversion ID
            'value': 1.0,
            'currency': 'BRL',
            'transaction_id': '' // Optionally set a transaction ID if available
          });

          // if(res.status === 200) {
          //   setQrcode(res.data.qrcode) // might not need this
          // }
          if (res.status === 200) {
            // Redirect to Stripe Checkout
            window.location.href = res.data.url; // Redirect the user to the Stripe checkout URL
          }
       
      } catch (error) {
        console.log(error)
      }
      setIsLoading(false)
      setIsPreviewing(false);
  }

  function createPageSubmit(e){
    setIsLoading(true);
    handleSubmit(e);
  }

  return (
    <div className={c.cont}>
      <form className={c.form} onSubmit={(e) => handleSubmit(e)} id='form'>
        <div className={c.textTitle}>
          <p className={c.title}>O presente perfeito <br /> para uma pessoa especial!</p>
        </div>
        <p>Crie uma linda animação com suas melhores memórias. Selecione suas fotos e receba seu site personalizado, um contador de quanto tempo vocês se conhecem + QR Code para compartilhar com aquela pessoa especial ❤️!</p>
        
        <div className={c.prices}> 
          <button className={c.priceBtn}>1 ano, 3 fotos com música - R$15,99</button>
        </div>
        <label className={c.musicLink}>
            Música do youtube:
            <input className={c.musicLinkInput} onChange={(e) => {setMusicLink(e.target.value)}} value={musicLink} type="text" name="musicLink" placeholder="Link da música" />
          </label>
        
        <div className={c.detailsCont}>
          <label className={c.couplesName}>
            Nome:
            <input onChange={(e) => {
              const updatedName = e.target.value;
              setName(sanitizeName(updatedName))
              formatUrl(updatedName);
            }} value={couplesName} type="text" required name="name" placeholder="Name" />
          </label>
        
          <label className={c.startDate}>
            Data:
            <input type="date" name="date" required onChange={(e) => setDate(e.target.value)} value={date} />
          </label>

          <label className={c.timer}>
            Insira um horário
            <input type="time" name="timer" required onChange={(e) => setTime(e.target.value)} value={time} />
          </label>

          {/* <label className={c.emoji}>
            Emoji
            <div className={c.emojiItem}>
              <input type="radio" name="emoji"  />❤️
              <input type="radio" name="emoji"  />🤙
            </div >
          </label> */}
          
          </div>
        

        <div className={c.messageCont}>
          <label className={c.message}>
            Mensagem:
            <textarea onChange={(e) => setMessage(e.target.value)} name="message" placeholder="Demostre seu amor!" />
          </label>
        </div>

        <button type='button' onClick={handlePhotosPick} className={`${c.btn} ${c.cameraCont}`}>
          <div>
          <FaCameraRetro size={20} />
          </div> {isLoadingPhotos ? <><BeatLoader  color="#ffffff"/> <p>comprimindo suas fotos...</p></> : <span>Escolha as fotos (Max 3)</span>} 
        </button>

        <input className={c.filePicker} type="file" name="photos" multiple ref={fileRef} onChange={handleFileChange} />
        <button onClick={createPageSubmit} className={`${c.btn} ${c.create}`} type="submit" disabled={isLoading}>{isLoading ? <BeatLoader color="#ffffff"/> : 'Criar Página'}</button>
      </form>
      <div>

      <Preview 
        date={date} 
        time={time} 
        startCounting={startCounting} 
        url={url} 
        photos={photoPreviews} 
        musicLink={musicLink}
        isPreviewing={isPreviewing}
      />
      </div>
      
    </div>
  );
}
