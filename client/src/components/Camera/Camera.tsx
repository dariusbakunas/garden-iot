import React from 'react';

export const Camera: React.FC<{ url: string }> = ({ url }) => {
  return (
    <div>
      <img src={url} width={640} height={480}/>
    </div>
  )
};
