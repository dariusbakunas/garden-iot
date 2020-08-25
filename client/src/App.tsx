import React, { useState } from 'react';
import { Camera } from './components/Camera/Camera';
import { Tile, Toggle, ToggleProps } from 'carbon-components-react';
import { useIOContext } from './context/useIo';

function App() {
  const { turnPumpOff, turnPumpOn, pumpOn, gardenLevel, reservoirLevel } = useIOContext();

  const handleTogglePump = (checked: boolean, id: string, event: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) => {
    if (checked) {
      turnPumpOn();
    } else {
      turnPumpOff();
    }
  };

  return (
    <div className="bx--grid bx--grid--full-width">
      <div className="bx--row">
        <div className="bx--col">
          <Camera />
        </div>
        <div className="bx--col">
          <Toggle id="pump-toggle" checked={pumpOn} onToggle={handleTogglePump} labelText="Water Pump"/>
          <div>
            Garden Level: {gardenLevel.toLocaleString()}
          </div>
          <div>
            Reservoir Level: {reservoirLevel.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
