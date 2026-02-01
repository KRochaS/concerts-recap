"use client";

import React, { useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { IconBaseProps } from "react-icons";

export default function Stars({ ...props }: IconBaseProps) {
  const [filledStars, setFilledStars] = useState<number>(0);

  const handleClick = (index: number) => {
    setFilledStars(index + 1);
  };

  return (
    <div className="flex gap-3 size-10 w-full items-center uppercase">
   
    <div className="flex gap-3">
    {Array.from({ length: 5 }, (_, index) => {
        const StarIcon = index < filledStars ? FaStar : FaRegStar;
        return (
          <button type="button" key={index} onClick={() => handleClick(index)}>
            <StarIcon {...props} />
          </button>
        );
      })}
    </div>
 
  </div>
   
  );
}
