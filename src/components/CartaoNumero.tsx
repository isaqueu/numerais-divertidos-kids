
import React from 'react';
import { useDrag } from 'react-dnd';
import { cn } from '@/lib/utils';

/**
 * Props para o componente CartaoNumero
 * @property {number} numero - Número a ser exibido no cartão
 * @property {boolean} emPosicaoCorreta - Indica se o número está na posição correta
 * @property {number} posicaoAtual - Se definido, indica em qual posição o número está (undefined significa que está na área de disponíveis)
 */
type CartaoNumeroProps = {
  numero: number;
  emPosicaoCorreta?: boolean;
  posicaoAtual?: number;
};

/**
 * Componente que representa um cartão com número arrastável
 * Controla a aparência e comportamento dos números no jogo
 * Usa react-dnd para implementar a funcionalidade de arrastar
 */
const CartaoNumero: React.FC<CartaoNumeroProps> = ({ 
  numero, 
  emPosicaoCorreta = false,
  posicaoAtual
}) => {
  // Hook useDrag do react-dnd para tornar o elemento arrastável
  const [{ isDragging }, drag] = useDrag(() => ({
    // Tipo do item sendo arrastado (para compatibilidade com áreas de soltura)
    type: 'numero',
    // Dados do item que serão passados para o destino quando solto
    item: { numero, posicaoAtual },
    // Só pode arrastar se estiver na área de disponíveis (não posicionado em um vagão)
    canDrag: posicaoAtual === undefined,
    // Coletor de propriedades para controle visual
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Cores alternadas para os vagões (estilo infantil)
  const cores = [
    'bg-infantil-azul',    // Azul - usado para números divisíveis por 6 com resto 0
    'bg-infantil-verde',   // Verde - usado para números divisíveis por 6 com resto 1
    'bg-infantil-amarelo', // Amarelo - usado para números divisíveis por 6 com resto 2
    'bg-infantil-rosa',    // Rosa - usado para números divisíveis por 6 com resto 3
    'bg-infantil-roxo',    // Roxo - usado para números divisíveis por 6 com resto 4
    'bg-infantil-laranja', // Laranja - usado para números divisíveis por 6 com resto 5
  ];
  
  // Seleciona a cor baseada no resto da divisão do número pelo número de cores
  const corIndex = numero % cores.length;
  
  return (
    <div
      // Referência para o hook useDrag (torna o div arrastável)
      ref={drag}
      // Classes condicionais para estilização do cartão
      className={cn(
        // Classe base com a cor do cartão e estilos padrão
        `${cores[corIndex]} dragavel w-16 h-16 md:w-20 md:h-20 rounded-xl shadow-md flex items-center justify-center
        transition-all duration-300 select-none`,
        // Borda verde se estiver na posição correta, vermelha se incorreta
        emPosicaoCorreta ? 'ring-4 ring-green-400' : (posicaoAtual !== undefined && !emPosicaoCorreta ? 'ring-4 ring-red-400' : ''),
        // Transparência quando estiver sendo arrastado
        isDragging ? 'opacity-50' : 'opacity-100',
        // Pulsação para destacar quando estiver correto
        emPosicaoCorreta ? 'animate-pulse' : '',
        // Cursor apropriado baseado se pode ou não ser arrastado
        posicaoAtual === undefined ? 'cursor-grab hover:scale-105' : 'cursor-not-allowed'
      )}
      // Estilos inline para transformação durante o arrasto
      style={{ 
        transform: isDragging ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      <span className="text-3xl md:text-4xl font-bold text-white">{numero}</span>
    </div>
  );
};

export default CartaoNumero;
