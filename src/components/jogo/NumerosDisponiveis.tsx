
import React from 'react';
import CartaoNumero from '@/components/CartaoNumero';

type NumerosDisponiveisProps = {
  numerosDisponiveis: number[];
  jogoCompleto: boolean;
};

const NumerosDisponiveis: React.FC<NumerosDisponiveisProps> = ({ 
  numerosDisponiveis, 
  jogoCompleto 
}) => {
  return (
    <div className="bg-blue-50 p-4 rounded-xl">
      <h3 className="text-lg font-medium mb-2">Números Disponíveis:</h3>
      <div className="flex flex-wrap gap-3 justify-center">
        {numerosDisponiveis.map((numero) => (
          <CartaoNumero key={numero} numero={numero} />
        ))}
        {numerosDisponiveis.length === 0 && !jogoCompleto && (
          <p className="text-gray-500">Todos os números já foram usados!</p>
        )}
      </div>
    </div>
  );
};

export default NumerosDisponiveis;
