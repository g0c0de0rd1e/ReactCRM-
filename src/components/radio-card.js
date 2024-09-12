import React from 'react';

import '../assets/scss/components/radio-card.scss';

export function InputCard({ title, checked, imgPath }) {
  return (
    <div className={checked ? 'radio-card radio-checked' : 'radio-card'}>
      <div className='header'>{title}</div>
      <img src={imgPath} alt='regular focus'></img>
    </div>
  );
}
