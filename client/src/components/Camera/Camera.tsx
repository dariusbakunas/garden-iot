import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');
export const Camera: React.FC = () => {
  const [imageData, setImageData] = useState<string>();

  useEffect(() => {
    socket.on('frame', (payload: { data: string }) => {
      setImageData(payload.data);
    });
  }, []);

  return (
    <div>
      { imageData && <img src={imageData} width={1024} /> }
    </div>
  )
};
