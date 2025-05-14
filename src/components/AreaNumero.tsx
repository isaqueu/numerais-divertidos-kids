
import React from 'react';
import { useDrop } from 'react-dnd';
import CartaoNumero from './CartaoNumero';
import { cn } from '@/lib/utils';

/**
 * Props para o componente AreaNumero
 * @property {number} indice - Posição deste vagão na sequência do trem
 * @property {number} posicaoEsperada - Posição esperada no array ordenado (geralmente igual ao índice)
 * @property {number|null} numeroAtual - Número atual no vagão ou null se vazio
 * @property {boolean} emPosicaoCorreta - Indica se o número está na posição correta
 * @property {Function} aoSoltar - Callback executado quando um número é solto nesta área
 */
type AreaNumeroProps = {
  indice: number;
  posicaoEsperada: number;
  numeroAtual: number | null;
  emPosicaoCorreta: boolean;
  aoSoltar: (indice: number, numero: number, numeroAnterior: number | null, posicaoOrigem?: number) => void;
};

/**
 * Componente que representa um vagão do trem onde os números podem ser posicionados
 * Implementa a funcionalidade de "soltar" do react-dnd
 */
const AreaNumero: React.FC<AreaNumeroProps> = ({ 
  indice, 
  posicaoEsperada, 
  numeroAtual, 
  emPosicaoCorreta, 
  aoSoltar 
}) => {
  // Hook useDrop do react-dnd para aceitar itens arrastáveis
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    // Tipo de item que esta área aceita
    accept: 'numero',
    
    // Verifica se pode soltar (sempre true aqui, pode substituir números)
    canDrop: (item: { numero: number, posicaoOrigem?: number }, monitor) => {
      console.log(`[CAN_DROP] Verificando se pode soltar ${item.numero} no vagão ${indice} (contém: ${numeroAtual})`, {
        posicaoOriginalItem: item.posicaoOrigem, 
      });
      return true;
    },
    
    // Função executada quando um número entra na área de soltura
    hover: (item: { numero: number, posicaoOrigem?: number }, monitor) => {
      if (monitor.isOver({ shallow: true })) {
        console.log(`[HOVER] Número ${item.numero} sobre o vagão ${indice} (contém: ${numeroAtual})`);
      }
    },
    
    // Função executada quando um item é solto nesta área
    drop: (item: { numero: number, posicaoOrigem?: number }) => {
      console.log(`[DROP] Número ${item.numero} solto no vagão ${indice}`, {
        numeroAnterior: numeroAtual,
        posicaoOriginalItem: item.posicaoOrigem
      });
      
      // Quando um número é solto aqui, passamos o indice desta área,
      // o número que está sendo solto, o número que estava aqui antes (se houver),
      // e a posição de origem do número (se estiver vindo de outro vagão)
      aoSoltar(indice, item.numero, numeroAtual, item.posicaoOrigem);
      return { destino: indice };
    },
    
    // Coletor de propriedades para controle visual
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  // Classes condicionais para o container baseado no estado atual
  const areaClasses = cn(
    'area-soltavel w-20 h-20 md:w-24 md:h-24 flex items-center justify-center border-2 border-dashed',
    // Destaque visual quando um item está sobre a área
    isOver && 'bg-gray-100 border-blue-500',
    // Cores baseadas no estado do vagão (vazio, correto, incorreto)
    numeroAtual !== null && emPosicaoCorreta ? 'border-green-500 bg-green-100' : 
    numeroAtual !== null && !emPosicaoCorreta ? 'border-red-500 bg-red-100' : 
    'border-gray-300',
    'cursor-pointer transition-all duration-200'
  );

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        // Referência para o hook useDrop (torna o div uma área de soltura)
        ref={drop}
        className={areaClasses}
        data-testid={`area-soltar-${indice}`}
        onClick={() => {
          console.log(`[CLICK_ÁREA] Clique no vagão ${indice} (contém: ${numeroAtual})`);
        }}
      >
        {/* Se tiver um número, renderiza o cartão (não arrastável) */}
        {numeroAtual !== null && (
          <CartaoNumero 
            numero={numeroAtual} 
            emPosicaoCorreta={emPosicaoCorreta} 
            posicaoAtual={indice}
          />
        )}
      </div>
      {/* Elemento visual representando o trilho do trem */}
      <div className="h-2 w-16 bg-gray-400 rounded-full"></div>
    </div>
  );
};

export default AreaNumero;
