import React, { useCallback, useState } from "react";
import io from 'socket.io-client';

export interface IIOContext {
  turnPumpOn: () => void;
  turnPumpOff: () => void;
  pumpOn: boolean;
}

const socket = io("http://localhost:3001", { forceNew: true });

export const IOContext = React.createContext<IIOContext | undefined>(undefined);
const { Provider } = IOContext;

export const IOProvider: React.FC = ({ children }) => {
  const [pumpOn, setPumpOn] = useState(false);

  socket.on("pump-status", (payload: { status: 1 | 0 }) => {
    setPumpOn(payload.status === 1);
  });

  socket.on("distance", (payload: string) => {
    console.log(payload);
  });

  const turnPumpOn = useCallback(() => {
    socket.emit("turn-pump-on");
  }, []);

  const turnPumpOff = useCallback(() => {
    socket.emit("turn-pump-off");
  }, []);

  return (
    <Provider value={{ turnPumpOn, turnPumpOff, pumpOn }}>
      {children}
    </Provider>
  )
};
