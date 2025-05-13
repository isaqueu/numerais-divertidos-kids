
import React from 'react';
import AreaNumero from '@/components/AreaNumero';

/**
 * Props para o componente AreaTrem
 * @property {(number|null)[]} numerosPosicionados - Array dos números posicionados em cada vagão (null = vazio)
 * @property {boolean[]} respostasCorretas - Array indicando quais posições têm números corretos
 * @property {Function} handleSoltar - Callback para quando um número é solto em um vagão
 */
type AreaTremProps = {
  numerosPosicionados: (number | null)[];
  respostasCorretas: boolean[];
  handleSoltar: (indice: number, numero: number, numeroAnterior: number | null) => void;
};

/**
 * Componente que representa o trem completo com todos os vagões
 * Organiza os vagões (AreaNumero) em sequência horizontal
 */
const AreaTrem: React.FC<AreaTremProps> = ({ 
  numerosPosicionados, 
  respostasCorretas, 
  handleSoltar 
}) => {
  return (
    <div className="mb-10">
      <div className="flex flex-row items-center">
        {/* Locomotiva do trem (parte visual) */}
        <div className="bg-infantil-azul w-24 h-16 rounded-l-full flex items-center justify-center">
          <span className="text-white font-bold">🚂</span>
        </div>

        {/* Área dos vagões (gerados dinamicamente) */}
        <div className="flex justify-center items-end gap-1 md:gap-2">
          {numerosPosicionados.map((numero, indice) => (
            <AreaNumero
              key={indice}
              indice={indice}
              posicaoEsperada={indice}
              numeroAtual={numero}
              emPosicaoCorreta={respostasCorretas[indice]}
              aoSoltar={handleSoltar}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AreaTrem;
