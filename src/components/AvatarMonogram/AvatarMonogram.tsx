import React from 'react';
import "./AvatarMonogram.scss";

interface AvatarMonogramProps {
    letters: string;
    backgroundColor: string;
}

const AvatarMonogram: React.FC<AvatarMonogramProps> = ({
    letters,
}) => {
  return (
    <div className="avatar-monogram">
      {letters}
    </div>
  )
}

export default AvatarMonogram;