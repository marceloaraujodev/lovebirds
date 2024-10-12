

import React from 'react';
import c from './Modal.module.css'

export default function Modal({ isModalOpen, setIsModalOpen, qrCodeUrl}) {
  
  return (
    <div className={c.modalOverlay} onClick={() => setIsModalOpen(false)}>
    <div className={c.modalContent} onClick={(e) => e.stopPropagation()}>
      <h2>qrcodelove.com</h2>
      <img src={qrCodeUrl} alt="QR Code" className={c.modalImage} />
      <button className={c.closeButton} onClick={() => setIsModalOpen(false)}>
        Close
      </button>
    </div>
  </div>
  )
}
