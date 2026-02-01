import React from 'react'
import { LucideIcon } from 'lucide-react'

interface BadgeProps {
  label: string
  icon: LucideIcon
  color: string
  isSelected?: boolean
  onClick?: () => void
}

export function Badge({ 
  label, 
  icon: Icon, 
  color, 
  isSelected, 
  onClick 
}: BadgeProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center gap-2 
        rounded-xl border-2 p-3 transition-all duration-200 
        /* Definimos um aspecto quadrado mas com limites de tamanho */
        aspect-square w-full max-w-[100px] mx-auto
        ${isSelected 
          ? 'border-purple-500 bg-[#13102f] shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
          : 'border-white/5 bg-[#0f0f11] hover:border-white/10'
        }
      `}
    >
      <Icon 
        size={24}
        strokeWidth={1.5}
        style={{ color: isSelected ? color : color + 'CC' }}
        className={isSelected ? 'scale-110' : 'opacity-80'}
      />
      
      <span className={`
        text-[10px] leading-tight font-medium text-center
        ${isSelected ? 'text-white' : 'text-zinc-500'}
      `}>
        {label}
      </span>

      {isSelected && (
        <div className="absolute inset-x-3 top-0 h-px bg-linear-to-r from-transparent via-purple-400 to-transparent" />
      )}
    </button>
  )
}