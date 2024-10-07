import React from 'react';
import "./InputLoading.scss";


const InputLoading: React.FC = () => {
  return (
      <span id="chat-input__loading">
        <div className="chat-input__loading-square"></div>
        <div className="chat-input__loading-square"></div>
        <div className="chat-input__loading-square"></div>
      </span>
  )
}

export default InputLoading;

// 8x8 négyzetek
// 4px helyköz
// nincs lekerekítés
// e4 szürke
// 