'use client'
import { useState, useEffect} from 'react';
import Preview from "../../components/Preview/Preview";
import axios from 'axios'
import c from './couplesPage.module.css'
import Error from '../../error/page';
import { BeatLoader } from 'react-spinners';

export default function page({params}) {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { couplesName, id } = params;
  // console.log(couplesName, id)

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`http://localhost:3000/api/${couplesName}/${id}`);
      console.log(res)
      setData(res.data.user);
      setIsLoading(false);
    }
    fetchData();
  },[])

  function printQrCode(qrCodeUrl){
    console.log(qrCodeUrl)
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

  // there will be a axios request to get the message and url links from the db
  // const dumbData = {
  //   message: 'vc esta me enlouquecendo e me estrassando muito. Mas mesmo assim vc e show',
  //   url: 'joe-e-ana',
  //   date: "2024-09-07",
  //   time: '15:03',
  //   // photos: ['/img1.jpg', '/img2.jpg', '/img3.jpg'] // array of urls
  // }

  // this might have a blinking  of the error page keep an eye for it
  if(!data){
    return <Error />
  }

  return (
    <div className={c.cont}>
      
      {isLoading ? <div className={c.loader}>
        <BeatLoader 
        color='#ffffff'
        size={20}
        aria-label="Loading Spinner"
        data-testid="loader"
        speedMultiplier={1}
      />
      </div> : 
      <>
      <Preview date={data.date} time={data.time} startCounting={true} url={data.url} couplesName={data.name} photos={data.photos} />
      <div className={c.messageCont}>
        <h2>Mensagem</h2>
        <div className={c.message}>
          <p>{data.message}</p>
        </div>
      </div>
        <div onClick={() => printQrCode(data.qrCode)} className={c.qrCode}>
          <img className={c.img} src={data.qrCode} alt='qr code' />
        </div>
          <p onClick={() => printQrCode(data.qrCode)}>imprimir</p>
      </>
      }
      
    </div>
  )
}