import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`rounded-lg border border-gray-700 bg-gray-900 ${className}`}>
    {children}
  </div>
);

export const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`p-4 pb-2 ${className}`}>
    {children}
  </div>
);

export const CardTitle: React.FC<CardProps> = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-white ${className}`}>
    {children}
  </h3>
);

export const CardDescription: React.FC<CardProps> = ({ children, className = '' }) => (
  <p className={`text-sm text-gray-400 ${className}`}>
    {children}
  </p>
);

export const CardContent: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`p-4 pt-2 ${className}`}>
    {children}
  </div>
);

export const CardFooter: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`p-4 pt-0 ${className}`}>
    {children}
  </div>
);