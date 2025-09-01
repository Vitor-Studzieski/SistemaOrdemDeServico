// src/components/landingpage/HigyeLogoSmall.tsx

import React from 'react';

interface HigyeLogoSmallProps {
  className?: string;
}

export function HigyeLogoSmall({ className }: HigyeLogoSmallProps) {
  return (
    <img 
      src="/Higye_600px.png" // O caminho para sua logo
      alt="Logo Higye" 
      className={`h-16 ${className}`} // Tamanho padrão e classes adicionais
    />
  );
}