import React from 'react';
import clsx from 'clsx';

import './TabPanelItem.scss';

interface TabPanelItemProps {
  label: string;
  active?: boolean;
  version?: 'underlined' | 'filled' | 'outlined';
  onClick?: () => void;
  handleClick?: () => void;
}

const TabPanelItem: React.FC<TabPanelItemProps> = ({ label, active, version, handleClick }) => {
  return (
    <div
      className={clsx('tab-panel-item', 'flex-center', {
        'tab-panel-item__underlined': version === 'underlined',
        'tab-panel-item__underlined__active': active && version === 'underlined',
        'tab-panel-item__filled': version === 'filled',
        'tab-panel-item__filled__active': active && version === 'filled',
        'tab-panel-item__outlined': version === 'outlined',
        'tab-panel-item__outlined__active': active && version === 'outlined',
      })}
      onClick={handleClick}
    >
      {label}
    </div>
  );
};

export default TabPanelItem;
