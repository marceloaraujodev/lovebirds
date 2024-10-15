import React from 'react';
import c from './Prints.module.css'

export default function Prints() {
  return (
    <div className={c.cont}>
      <h2>Surpresas</h2>
      <div className={c.imgsCont}>
        <img className={c.prints} src='/insta-print.jpg' alt='user happy' />
        <img className={c.prints} src='/insta-print.jpg' alt='user happy' />
        <img className={c.prints} src='/insta-print.jpg' alt='user happy' />
      </div>
      xxxx
    </div>
  )
}
