import React from 'react';

import './InputLoading.scss';

export const InputLoading: React.FC = () => {
  return (
    <span id="comment-input-loading">
      <div className="comment-input-loading-square"></div>
      <div className="comment-input-loading-square"></div>
      <div className="comment-input-loading-square"></div>
    </span>
  );
};
