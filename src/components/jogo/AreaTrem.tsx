
import React from 'react';
import AreaNumero from '@/components/AreaNumero';

type AreaTremProps = {
  numerosPosicionados: (number | null)[];
  respostasCorretas: boolean[];
  handleSoltar: (indice: number, numero: number, numeroAnterior: number | null) => void;
};

const AreaTrem: React.FC<AreaTremProps> = ({ 
  numerosPosicionados, 
  respostasCorretas, 
  handleSoltar 
}) => {
  return (
    <div className="mb-10">
      <div className="flex flex-row items-center">
        <div className="bg-infantil-azul w-24 h-16 rounded-l-full flex items-center justify-center">
          <span className="text-white font-bold">🚂</span>
        </div>

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
