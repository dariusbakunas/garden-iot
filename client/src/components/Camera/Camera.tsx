import React from 'react';

export const Camera: React.FC<{ url: string }> = ({ url }) => {
  return (
    <div>
      <img src={url} />
    </div>
  )
};
