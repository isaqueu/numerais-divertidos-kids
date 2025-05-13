
import React from 'react';
import CartaoNumero from '@/components/CartaoNumero';

/**
 * Props para o componente NumerosDisponiveis
 * @property {number[]} numerosDisponiveis - Array de números disponíveis para arrastar
 * @property {boolean} jogoCompleto - Indica se o jogo está completo (todos os números posicionados)
 */
type NumerosDisponiveisProps = {
  numerosDisponiveis: number[];
  jogoCompleto: boolean;
};

/**
 * Componente que exibe os números disponíveis para o jogador arrastar
 * Mostra uma área com todos os cartões de números que podem ser arrastados
 */
const NumerosDisponiveis: React.FC<NumerosDisponiveisProps> = ({ 
  numerosDisponiveis, 
  jogoCompleto 
}) => {
  return (
    <div className="bg-blue-50 p-4 rounded-xl">
      {/* Título da seção */}
      <h3 className="text-lg font-medium mb-2">Números Disponíveis:</h3>
      
      {/* Área flexível para exibir os cartões de números */}
      <div className="flex flex-wrap gap-3 justify-center">
        {/* Renderiza um cartão para cada número disponível */}
        {numerosDisponiveis.map((numero) => (
          <CartaoNumero key={numero} numero={numero} />
        ))}
        
        {/* Mensagem quando não há mais números disponíveis */}
        {numerosDisponiveis.length === 0 && !jogoCompleto && (
          <p className="text-gray-500">Todos os números já foram usados!</p>
        )}
      </div>
    </div>
  );
};

export default NumerosDisponiveis;
