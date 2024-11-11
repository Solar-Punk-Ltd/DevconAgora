import React from 'react';

import './ProfileAlert.scss';
// import miniProfileIcon from "../../assets/mini-profile-icon.png";

interface ProfileAlertProps {
  value: number;
}

const ProfileAlert: React.FC<ProfileAlertProps> = ({ value }) => {
  return (
    <div
      style={{
        width: '18px',
        height: '18px',
        backgroundColor: 'red',
        borderRadius: '50%',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '8px',
        position: 'relative',
        top: '-15px',
        right: '-28px',
      }}
    >
      {value}
    </div>
  );
};

export default ProfileAlert;
