import { useState, useEffect, useRef } from 'react';
import Preview from '../Preview/Preview';
import { FaCameraRetro } from "react-icons/fa6";
import c from './Form.module.css';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';



export default function Form() {
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [photos, setPhotos] = useState([])
  const [musicLink, setMusicLink] = useState('');
  const [photoPreviews, setPhotoPreviews] = useState([]) // for the blobs
  const [startCounting, setStartCounting] = useState(false);
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState('');
  const [qrcode, setQrcode] = useState('');
  const fileRef = useRef(null);


  // starts counting Timer
  useEffect(() => {
    if (date && time) {
      setStartCounting(true); // Start counting when the user submits date and time
      console.log(date, time)
    }
  },[date, time]);


  function handleFileChange(e){
    // const files = Array.from(e.target.files);
    const files = Array.from(e.target.files); // Convert FileList to array
    const previews = files.map((file) => URL.createObjectURL(file)); // Create Blob URLs for each file

    setPhotos(files);
    setPhotoPreviews(previews);
  }

  // click for the file picker
  function handleClick(e){
    e.preventDefault();
    fileRef.current.click();
  };

  function formatUrl(nameInput){
    const nameArr = nameInput.split(' ');
    const formattedName = nameArr.map(word => word.split(',')).join('-');
    setUrl(formattedName)
  }

  // need to change to send the submittion to stripe api then use webhook
  async function handleSubmit(e){
    if (photos.length > 3){
      alert('Maximum 3 photos allowed!')
      return;
    }

    const hash = uuidv4();
    e.preventDefault(); 
    const formData = new FormData();

    //Append fields do formData
    formData.append('name', name);
    formData.append('date', date);
    formData.append('time', time);
    formData.append('musicLink', musicLink);
    formData.append('message', message);
    formData.append('hash', hash);
    formData.append('url', `${url}/${hash}`);
    photos.forEach((file) => formData.append('photos', file));

    try {
      const res = await axios.post('/api/create-checkout-session', formData,
        {
          headers: {
        'Content-Type': 'multipart/form-data', // Important for file uploads
      }
    })
      console.log(res)
      if(res.status === 200) {
        setQrcode(res.data.qrcode)
      }
      if (res.status === 200) {
        // Redirect to Stripe Checkout
        window.location.href = res.data.url; // Redirect the user to the Stripe checkout URL
      }
       
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <div className={c.cont}>
      {/* <button type='button' onClick={callTime}>test</button> */}
      <form className={c.form} onSubmit={(e) => handleSubmit(e)} id='form'>
        <h1>O presente perfeito para o seu amor!</h1>
        <p>Crie uma linda animação com suas melhores memórias. Selecione suas fotos e receba seu site personalizado + QR Code para compartilhar com quem você ama ❤️!</p>
        
        <div className={c.prices}> 
          <button>1 ano, 3 fotos com música - R$15,99</button>
        </div>
        <label className={c.musicLink}>
            Música do youtube:
            <input onChange={(e) => {setMusicLink(e.target.value)}} value={musicLink} type="text" name="musicLink" placeholder="Link da música" />
          </label>
        
        <div className={c.detailsCont}>
          <label className={c.couplesName}>
            Nome do Casal:
            <input onChange={(e) => {
              const updatedName = e.target.value;
              setName(updatedName)
              formatUrl(updatedName);
            }} value={name} type="text" name="name" placeholder="Name" />
          </label>
        
          <label className={c.startDate}>
            Início do relacionamento:
            <input type="date" name="date" required onChange={(e) => setDate(e.target.value)} value={date} />
          </label>

          <label className={c.timer}>
          <input type="time" name="timer" required onChange={(e) => setTime(e.target.value)} value={time} />
          </label>
          </div>
        

        <div className={c.messageCont}>
          <label className={c.message}>
            Mensagem:
            <textarea onChange={(e) => setMessage(e.target.value)} name="message" placeholder="Show your love here!" />
          </label>
        </div>
        <button type='button' onClick={handleClick} className={`${c.btn} ${c.cameraCont}`}>
          <div>
          <FaCameraRetro size={20} />
          </div> <span>Escolha as fotos (Max 3)</span>
        </button>
        <input className={c.filePicker} type="file" name="files" multiple ref={fileRef} onChange={handleFileChange} />
        <button className={`${c.btn} ${c.create}`} type="submit">Criar Pagina</button>
      </form>
      <div>

      <Preview date={date} time={time} startCounting={startCounting} url={url} photos={photoPreviews} musicLink={musicLink}/>
      </div>
      
    </div>
  );
}
