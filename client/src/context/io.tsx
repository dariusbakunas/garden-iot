import React, { useCallback, useState } from "react";
import io from 'socket.io-client';

export interface IIOContext {
  turnPumpOn: () => void;
  turnPumpOff: () => void;
  pumpOn: boolean;
  gardenLevel: number;
  reservoirLevel: number;
}

const socket = io("http://localhost:3001", { forceNew: true });

export const IOContext = React.createContext<IIOContext | undefined>(undefined);
const { Provider } = IOContext;

export const IOProvider: React.FC = ({ children }) => {
  const [pumpOn, setPumpOn] = useState(false);
  const [gardenLevel, setGardenLevel] = useState<number>(0);
  const [reservoirLevel, setReservoirLevel] = useState<number>(0);

  socket.on("pump-status", (payload: { status: 1 | 0 }) => {
    setPumpOn(payload.status === 1);
  });

  socket.on("garden-level", (payload: string) => {
    setGardenLevel(Number.parseFloat(payload));
  });

  socket.on("reservoir-level", (payload: string) => {
    setReservoirLevel(Number.parseFloat(payload));
  });

  const turnPumpOn = useCallback(() => {
    socket.emit("turn-pump-on");
  }, []);

  const turnPumpOff = useCallback(() => {
    socket.emit("turn-pump-off");
  }, []);

  return (
    <Provider value={{ turnPumpOn, turnPumpOff, pumpOn, gardenLevel, reservoirLevel }}>
      {children}
    </Provider>
  )
};
