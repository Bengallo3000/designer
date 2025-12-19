import React from 'react';

interface SliderProps {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({ 
  value, 
  onValueChange, 
  min = 0, 
  max = 100, 
  step = 1,
  className = ''
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(Number(e.target.value));
  };

  return (
    <div className={`relative w-full h-6 flex items-center ${className}`}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        style={{
          background: `linear-gradient(to right, #00ffff 0%, #00ffff ${((value - min) / (max - min)) * 100}%, #374151 ${((value - min) / (max - min)) * 100}%, #374151 100%)`
        }}
      />
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: #00ffff;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #00ffff;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};