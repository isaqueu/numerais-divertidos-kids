
import React from 'react';
import { useDrop } from 'react-dnd';
import CartaoNumero from './CartaoNumero';
import { cn } from '@/lib/utils';

type AreaNumeroProps = {
  indice: number;
  posicaoEsperada: number;
  numeroAtual: number | null;
  emPosicaoCorreta: boolean;
  aoSoltar: (indice: number, numero: number) => void;
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
      aoSoltar(indice, item.numero);
      return { destino: indice };
    },
    canDrop: () => numeroAtual === null, // Só aceita soltar se não tiver número
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  // Classes condicionais para o container
  const areaClasses = cn(
    'area-soltavel w-20 h-20 md:w-24 md:h-24 flex items-center justify-center',
    isOver && 'ativo',
    emPosicaoCorreta && numeroAtual !== null && 'bg-green-100',
    numeroAtual !== null ? 'cursor-not-allowed' : 'cursor-pointer'
  );

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        ref={drop}
        className={areaClasses}
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
