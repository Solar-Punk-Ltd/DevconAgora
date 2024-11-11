import React, { ReactNode } from 'react';

import './ActionButton.scss';

interface ActionButtonProps {
  children?: ReactNode;
}

const ActionButton: React.FC<ActionButtonProps> = ({ children }) => {
  return <div className="action-button">{children}</div>;
};

export default ActionButton;
