
import React from 'react';

type BotoesAcaoJogoProps = {
  jogoCompleto: boolean;
  jogoCorreto?: boolean;
  numerosPosicionados: (number | null)[];
  onVoltarMenu: () => void;
  onReiniciarPosicoes: () => void;
  onProximoNivel: () => void;
};

const BotoesAcaoJogo: React.FC<BotoesAcaoJogoProps> = ({ 
  jogoCompleto, 
  jogoCorreto = false,
  numerosPosicionados, 
  onVoltarMenu, 
  onReiniciarPosicoes, 
  onProximoNivel 
}) => {
  const todosPosicoesPreenchidas = numerosPosicionados.every(num => num !== null);
  
  return (
    <div className="flex justify-center mt-6 space-x-4">
      <button
        onClick={onVoltarMenu}
        className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition-colors"
      >
        Voltar ao Menu
      </button>
      
      {!jogoCompleto || (jogoCompleto && !jogoCorreto) ? (
        <button
          onClick={onReiniciarPosicoes}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Reiniciar Posições
        </button>
      ) : null}
      
      {jogoCompleto && jogoCorreto && (
        <button
          onClick={onProximoNivel}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          Próximo Nível
        </button>
      )}
    </div>
  );
};

export default BotoesAcaoJogo;
