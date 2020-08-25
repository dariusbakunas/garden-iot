import React, { useEffect, useMemo, useState } from 'react';
import { color } from 'd3-color';
import { interpolateRgb } from 'd3-interpolate';
// @ts-ignore
import LiquidFillGauge from 'react-liquid-gauge';

interface ILiquidGauge {
  id: string;
  label?: string;
  value: number;
  max: number;
  min: number;
  inverse?: boolean;
}

export const LiquidGauge: React.FC<ILiquidGauge> = ({ label, value, id , max, min, inverse}) => {
  const percent = useMemo(() => {
    const normalizedValue = (value - min) / (max - min);
    return inverse ? 100 - normalizedValue * 100 : normalizedValue * 100;
  }, [value, inverse]);

  const radius = 50;
  const startColor = '#00a8ed';
  const endColor = '#0000dc';
  const interpolate = interpolateRgb(startColor, endColor);
  const fillColor = interpolate(percent / 100);

  const gradientStops = [
    {
      key: '0%',
      stopColor: color(fillColor)?.darker(0.5).toString(),
      stopOpacity: 1,
      offset: '0%'
    },
    {
      key: '50%',
      stopColor: fillColor,
      stopOpacity: 0.75,
      offset: '50%'
    },
    {
      key: '100%',
      stopColor: color(fillColor)?.brighter(0.5).toString(),
      stopOpacity: 0.5,
      offset: '100%'
    }
  ];

  return (
    <div className="liquid-gauge">
      {label && <div>{label}:</div>}
      <LiquidFillGauge
        style={{ margin: '0 auto' }}
        width={radius * 2}
        height={radius * 2}
        value={value > 0 ? percent : 0}
        percent="%"
        textSize={1.2}
        textOffsetX={4}
        textOffsetY={10}
        textRenderer={(props: { value: number, height: number, width: number,  textSize: number, percent: number }) => {
          const value = Math.round(props.value);
          const radius = Math.min(props.height / 2, props.width / 2);
          const textPixels = (props.textSize * radius / 2);
          const valueStyle = {
            fontSize: textPixels
          };
          const percentStyle = {
            fontSize: textPixels * 0.6
          };

          return (
            <tspan>
              <tspan className="value" style={valueStyle}>{value}</tspan>
              <tspan style={percentStyle}>{props.percent}</tspan>
            </tspan>
          );
        }}
        riseAnimation
        waveAnimation
        waveFrequency={1}
        waveAmplitude={1.5}
        gradient
        gradientStops={gradientStops}
        circleStyle={{
          fill: fillColor
        }}
        waveStyle={{
          fill: fillColor
        }}
        textStyle={{
          fill: color('#fff')?.toString(),
        }}
        waveTextStyle={{
          fill: color('#fff')?.toString(),
        }}
      />
    </div>
  )
};