import React from 'react';
import clsx from 'clsx';

import { LOBBY_TITLE } from '../../utils/constants';
import ActiveVisitors from '../ActiveVisitors/ActiveVisitors';

import './DevConMainBox.scss';

interface DevConMainBoxProps {
  title: string;
  content?: string;
  showActiveVisitors?: boolean;
  activeVisitors?: number;
  bordered?: boolean;
  setSelectedChat: React.Dispatch<React.SetStateAction<string | null>>;
}

const DevConMainBox: React.FC<DevConMainBoxProps> = ({
  title,
  content,
  showActiveVisitors,
  activeVisitors,
  bordered,
  setSelectedChat,
}) => {
  return (
    <div onClick={() => setSelectedChat(LOBBY_TITLE)}>
      <div
        className={clsx('devcon-main-box', {
          'devcon-main-box__border': bordered,
        })}
      >
        <div className="devcon-main-box__title">{title}</div>
        {content ? <div className="devcon-main-box__content">{content}</div> : null}
        {showActiveVisitors ? <ActiveVisitors number={activeVisitors} /> : null}
      </div>
    </div>
  );
};

export default DevConMainBox;
