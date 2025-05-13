
import React from 'react';
import { useDrag } from 'react-dnd';
import { cn } from '@/lib/utils';

type CartaoNumeroProps = {
  numero: number;
  emPosicaoCorreta?: boolean;
  posicaoAtual?: number;
};

// Componente que representa um cartão com número arrastável
const CartaoNumero: React.FC<CartaoNumeroProps> = ({ 
  numero, 
  emPosicaoCorreta = false,
  posicaoAtual
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'numero',
    item: { numero, posicaoAtual },
    canDrag: posicaoAtual === undefined, // Só pode arrastar se estiver na área de disponíveis
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Cores alternadas para os vagões
  const cores = [
    'bg-infantil-azul',
    'bg-infantil-verde',
    'bg-infantil-amarelo',
    'bg-infantil-rosa',
    'bg-infantil-roxo',
    'bg-infantil-laranja',
  ];
  
  const corIndex = numero % cores.length;
  
  return (
    <div
      ref={drag}
      className={cn(
        `${cores[corIndex]} dragavel w-16 h-16 md:w-20 md:h-20 rounded-xl shadow-md flex items-center justify-center
        transition-all duration-300 select-none`,
        emPosicaoCorreta ? 'ring-4 ring-green-400' : (posicaoAtual !== undefined && !emPosicaoCorreta ? 'ring-4 ring-red-400' : ''),
        isDragging ? 'opacity-50' : 'opacity-100',
        emPosicaoCorreta ? 'animate-pulse' : '',
        posicaoAtual === undefined ? 'cursor-grab hover:scale-105' : 'cursor-not-allowed'
      )}
      style={{ 
        transform: isDragging ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      <span className="text-3xl md:text-4xl font-bold text-white">{numero}</span>
    </div>
  );
};

export default CartaoNumero;
