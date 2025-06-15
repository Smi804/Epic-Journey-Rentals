import React from 'react'
import {logo} from '../assets/logo.png'

export default function Logo() {
  return (
    <div className='logo w-16 h-16 '>
        <img src={logo} alt="logo"  />
    </div>
  );
}
