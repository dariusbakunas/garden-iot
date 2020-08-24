import React, { useCallback } from "react";

export interface IIOContext {
  turnPumpOn: () => void;
  turnPumpOff: () => void;
}

export const IOContext = React.createContext<IIOContext | undefined>(undefined);
const { Provider } = IOContext;

export const IOProvider: React.FC = ({ children }) => {
  const turnPumpOn = useCallback(() => {
    console.log('pump on');
  }, []);

  const turnPumpOff = useCallback(() => {
    console.log('pump off');
  }, []);

  return (
    <Provider value={{ turnPumpOn, turnPumpOff }}>
      {children}
    </Provider>
  )
};
