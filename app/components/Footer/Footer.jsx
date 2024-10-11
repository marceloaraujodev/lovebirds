import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { AiFillTikTok } from "react-icons/ai";
import c from './Footer.module.css';

export default function Footer() {
  return (
    <div className={c.cont}>
      <FaInstagram className={c.icon} size={25}/>
      <FaXTwitter className={c.icon} size={25}/>
      <AiFillTikTok className={c.icon} size={25}/>
      <a href="mailto:qrcodelovebr@gmail.com"><span className={c.contact}>Contato</span></a>
    </div>
  )
}