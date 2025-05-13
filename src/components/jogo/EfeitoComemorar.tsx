
import React from 'react';

/**
 * Props para o componente EfeitoComemorar
 * @property {boolean} comemorando - Controla se a animação está ativa
 */
type EfeitoComoracaoProps = {
  comemorando: boolean;
};

/**
 * Componente que exibe uma animação de comemoração
 * Cria emojis festivos que "caem" na tela quando o jogador completa um nível
 */
const EfeitoComemorar: React.FC<EfeitoComoracaoProps> = ({ comemorando }) => {
  // Se não estiver comemorando, não renderiza nada
  if (!comemorando) return null;
  
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
      {/* Cria 20 elementos de comemoração com posições e animações aleatórias */}
      {Array(20).fill(0).map((_, i) => (
        <div 
          key={i}
          className="absolute animate-comemorar text-3xl"
          style={{
            // Posição inicial aleatória na tela
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            // Timing da animação aleatório para cada emoji
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${1 + Math.random() * 2}s`
          }}
        >
          {/* Emoji aleatório de uma lista pré-definida */}
          {['🎉', '⭐', '🎊', '🏆', '✨'][Math.floor(Math.random() * 5)]}
        </div>
      ))}
    </div>
  );
};

export default EfeitoComemorar;
