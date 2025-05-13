
import React from 'react';

/**
 * Props para o componente BotoesAcaoJogo
 * @property {boolean} jogoCompleto - Indica se todos os vagões estão preenchidos
 * @property {boolean} jogoCorreto - Indica se a sequência está correta
 * @property {(number|null)[]} numerosPosicionados - Array dos números posicionados em cada vagão
 * @property {Function} onVoltarMenu - Callback para voltar ao menu principal
 * @property {Function} onReiniciarPosicoes - Callback para reiniciar as posições dos números
 * @property {Function} onProximoNivel - Callback para avançar ao próximo nível
 */
type BotoesAcaoJogoProps = {
  jogoCompleto: boolean;
  jogoCorreto?: boolean;
  numerosPosicionados: (number | null)[];
  onVoltarMenu: () => void;
  onReiniciarPosicoes: () => void;
  onProximoNivel: () => void;
};

/**
 * Componente que exibe os botões de ação do jogo
 * Controla quais botões são exibidos dependendo do estado atual do jogo
 */
const BotoesAcaoJogo: React.FC<BotoesAcaoJogoProps> = ({ 
  jogoCompleto, 
  jogoCorreto = false,
  numerosPosicionados, 
  onVoltarMenu, 
  onReiniciarPosicoes, 
  onProximoNivel 
}) => {
  // Verifica se todos os vagões estão preenchidos (sem nulls)
  const todosPosicoesPreenchidas = numerosPosicionados.every(num => num !== null);
  
  return (
    <div className="flex justify-center mt-6 space-x-4">
      {/* Botão para voltar ao menu (sempre visível) */}
      <button
        onClick={onVoltarMenu}
        className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition-colors"
      >
        Voltar ao Menu
      </button>
      
      {/* Botão para reiniciar posições (visível durante o jogo ou ao final se estiver errado) */}
      {!jogoCompleto || (jogoCompleto && !jogoCorreto) ? (
        <button
          onClick={onReiniciarPosicoes}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Reiniciar Posições
        </button>
      ) : null}
      
      {/* Botão para próximo nível (visível apenas quando o jogo estiver completo e correto) */}
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
