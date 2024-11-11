import React from 'react';
import clsx from 'clsx';

import './TabPanel.scss';

interface TabPanelProps {
  version?: 'underlined' | 'filled' | 'outlined';
  children: React.ReactNode;
  activeIndex: number;
}

interface TabPanelItemProps {
  label: string;
  active: boolean;
  version?: 'underlined' | 'filled' | 'outlined';
  handleClick?: () => void;
}

const TabPanel: React.FC<TabPanelProps> = ({ version, children, activeIndex }) => {
  return (
    <div
      className={clsx('tab-panel', {
        'tab-panel__outlined': version === 'outlined',
      })}
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement<TabPanelItemProps>(child)) {
          return React.cloneElement(child, {
            active: index === activeIndex,
            version: version,
          });
        }
        return child;
      })}
    </div>
  );
};

export default TabPanel;
