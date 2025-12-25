'use client';

import { useState } from 'react';
import Image from 'next/image';

interface BattleCardProps {
  imageUrl: string;
  imageId: string;
  onVote: (winnerId: string) => void;
  disabled: boolean;
}

export default function BattleCard({ 
  imageUrl, 
  imageId, 
  onVote, 
  disabled 
}: BattleCardProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 200);
    onVote(imageId);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative w-full h-full overflow-hidden rounded-lg
        transition-all duration-200
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105'}
        ${isPressed ? 'scale-95' : ''}
        bg-gray-100
      `}
    >
      <Image
        src={imageUrl}
        alt="Vote option"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
        priority
      />
      
      {!disabled && (
        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200" />
      )}
    </button>
  );
}