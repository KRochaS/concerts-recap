'use client';

import React, { useState } from 'react';
import {
  FaBatteryEmpty,
  FaBatteryFull,
  FaBatteryHalf,
  FaBatteryQuarter,
  FaBatteryThreeQuarters,
} from 'react-icons/fa6';

import { BatteryIcons, BatteryProps } from '../../ui-model/shared.model';

export function Battery({ id, label, ...props }: BatteryProps) {
  const [level, setLevel] = useState(0);

  const batteryIcons: BatteryIcons = {
    0: FaBatteryEmpty,
    1: FaBatteryQuarter,
    2: FaBatteryHalf,
    3: FaBatteryThreeQuarters,
    4: FaBatteryFull,
  };

  const handleClick = () => {
    if (level < 4) {
      setLevel(level + 1);
    }

    if (level === 4) {
      setLevel(0);
    }
  };

  const BatteryIcon = batteryIcons[level];

  return (
    <>
      <label htmlFor={id} className="uppercase">
        {label}
      </label>
      <button onClick={handleClick} type="button">
        <BatteryIcon
          {...props}
          style={{
            fill: 'currentColor',
          }}
        />
      </button>
    </>
  );
}
