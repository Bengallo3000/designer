import React, { useState } from 'react';

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ value, onValueChange, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 px-3 py-2 text-left bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
      >
        {value}
        <span className="absolute right-3 top-3">▼</span>
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg">
          {React.Children.map(children, child => 
            React.isValidElement(child) 
              ? React.cloneElement(child as React.ReactElement<any>, { 
                  onSelect: (val: string) => {
                    onValueChange(val);
                    setIsOpen(false);
                  }
                })
              : child
          )}
        </div>
      )}
    </div>
  );
};

export const SelectContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="py-1">{children}</div>
);

export const SelectItem: React.FC<{ 
  value: string; 
  children: React.ReactNode;
  onSelect?: (value: string) => void;
}> = ({ value, children, onSelect }) => (
  <div
    className="px-3 py-2 text-white hover:bg-gray-700 cursor-pointer"
    onClick={() => onSelect?.(value)}
  >
    {children}
  </div>
);