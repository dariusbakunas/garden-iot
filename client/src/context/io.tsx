import React, { useCallback } from "react";
import io from 'socket.io-client';

export interface IIOContext {
  turnPumpOn: () => void;
  turnPumpOff: () => void;
}

const socket = io("http://localhost:3001", { forceNew: true });

export const IOContext = React.createContext<IIOContext | undefined>(undefined);
const { Provider } = IOContext;

export const IOProvider: React.FC = ({ children }) => {
  const turnPumpOn = useCallback(() => {
    socket.emit("turn-pump-on");
  }, []);

  const turnPumpOff = useCallback(() => {
    socket.emit("turn-pump-off");
  }, []);

  return (
    <Provider value={{ turnPumpOn, turnPumpOff }}>
      {children}
    </Provider>
  )
};
