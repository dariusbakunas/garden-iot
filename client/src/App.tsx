import React, { useState } from 'react';
import { Camera } from './components/Camera/Camera';
import { Tile, Toggle, ToggleProps } from 'carbon-components-react';
import { useIOContext } from './context/useIo';
import { LiquidGauge } from './components/LiquidGauge/LiquidGauge';

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
          <h2>Garden</h2>
        </div>
      </div>
      <div className="bx--row">
        <div className="bx--col camera-frame">
          <Camera url={`http://${window.location.hostname}:8081/`} />
        </div>
        <div className="bx--col">
          <Toggle id="pump-toggle" checked={pumpOn} onToggle={handleTogglePump} labelText="Water Pump"/>
          <div>
            {/* TODO: make min/max configurable */}
            <LiquidGauge min={5} max={14} value={gardenLevel} label="Garden Level" id="garden-level" inverse={true}/>
          </div>
          <div>
            {/* Cutoff pump at 34.22 */}
            <LiquidGauge min={5.3} max={38.15} value={reservoirLevel} label="Reservoir Level" id="reservoir-level" inverse={true}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
