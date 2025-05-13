
import React from 'react';
import { useDrop } from 'react-dnd';
import CartaoNumero from './CartaoNumero';
import { cn } from '@/lib/utils';

type AreaNumeroProps = {
  indice: number;
  posicaoEsperada: number;
  numeroAtual: number | null;
  emPosicaoCorreta: boolean;
  aoSoltar: (indice: number, numero: number, numeroAnterior: number | null) => void;
};

const AreaNumero: React.FC<AreaNumeroProps> = ({ 
  indice, 
  posicaoEsperada, 
  numeroAtual, 
  emPosicaoCorreta, 
  aoSoltar 
}) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'numero',
    drop: (item: { numero: number }) => {
      // Quando um número é solto aqui, passamos o indice desta área,
      // o número que está sendo solto e o número que estava aqui antes (se houver)
      aoSoltar(indice, item.numero, numeroAtual);
      return { destino: indice };
    },
    canDrop: () => true,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  // Classes condicionais para o container
  const areaClasses = cn(
    'area-soltavel w-20 h-20 md:w-24 md:h-24 flex items-center justify-center border-2 border-dashed',
    isOver && 'bg-gray-100 border-blue-500',
    numeroAtual !== null && emPosicaoCorreta ? 'border-green-500 bg-green-100' : 
    numeroAtual !== null && !emPosicaoCorreta ? 'border-red-500 bg-red-100' : 
    'border-gray-300',
    'cursor-pointer transition-all duration-200'
  );

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        ref={drop}
        className={areaClasses}
        data-testid={`area-soltar-${indice}`}
      >
        {numeroAtual !== null && (
          <CartaoNumero 
            numero={numeroAtual} 
            emPosicaoCorreta={emPosicaoCorreta} 
            posicaoAtual={indice}
          />
        )}
      </div>
      <div className="h-2 w-16 bg-gray-400 rounded-full"></div> {/* Trilho do trem */}
    </div>
  );
};

export default AreaNumero;
