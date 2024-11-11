import React from 'react';

import WelcomeButton from '../WelcomeButton/WelcomeButton';

import './PopUpQuestion.scss';

interface PopUpQuestionProps {
  question: string;
  leftButtonText: string;
  leftButtonHandler: () => void;
  rightButtonText: string;
  rightButtonHandler: () => void;
}

const PopUpQuestion: React.FC<PopUpQuestionProps> = ({
  question,
  leftButtonText,
  leftButtonHandler,
  rightButtonText,
  rightButtonHandler,
}) => {
  return (
    <div className="pop-up-question">
      <div className="pop-up-question__content">
        <div className="pop-up-question__header">{question}</div>
        <div className="pop-up-question__buttons">
          <WelcomeButton onClick={leftButtonHandler} version="outlined">
            {leftButtonText}
          </WelcomeButton>
          <WelcomeButton onClick={rightButtonHandler} version="filled">
            {rightButtonText}
          </WelcomeButton>
        </div>
      </div>
    </div>
  );
};

export default PopUpQuestion;
