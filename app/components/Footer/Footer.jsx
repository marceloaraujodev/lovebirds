import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { AiFillTikTok } from "react-icons/ai";
import { IoMdMail } from "react-icons/io";
import c from './Footer.module.css';

export default function Footer() {
  return (
    <div className={c.cont}>
      {/* <FaXTwitter className={c.icon} size={25}/> */}
      <a target="_blank" href="https://www.instagram.com/qrcodelove"><FaInstagram className={c.icon} size={25}/></a>
      <a target="_blank" href="https://www.tiktok.com/@qrcodelove"><AiFillTikTok className={c.icon} size={25}/></a>
      <a target="_blank" href="mailto:qrcodelovebr@gmail.com"><span className={c.contact}><IoMdMail size={25} /></span></a>
    </div>
  )
}