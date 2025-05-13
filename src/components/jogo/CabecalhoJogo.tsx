
import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { Nivel } from '@/types/jogo';

/**
 * Props para o componente CabecalhoJogo
 * @property {Nivel} nivel - Nível atual do jogo
 * @property {Function} onAbrirRegras - Callback para abrir o modal de regras
 */
type CabecalhoJogoProps = {
  nivel: Nivel;
  onAbrirRegras: () => void;
};

/**
 * Componente de cabeçalho para a tela do jogo
 * Exibe o título do nível, informações sobre o intervalo de números
 * e botão para acessar as regras
 */
const CabecalhoJogo: React.FC<CabecalhoJogoProps> = ({ nivel, onAbrirRegras }) => {
  return (
    <div className="text-center mb-6">
      {/* Título do nível atual */}
      <h2 className="text-2xl md:text-3xl font-bold mb-2">
        {nivel.titulo}
      </h2>
      
      {/* Descrição do intervalo de números para este nível */}
      <p className="text-lg">
        Organize os números de {nivel.minimo} a {nivel.maximo} em ordem crescente
      </p>
      
      {/* Botão para acessar as regras do jogo */}
      <Button
        variant="outline"
        size="sm"
        className="mt-2 border-infantil-roxo text-infantil-roxo hover:bg-infantil-roxo hover:text-white"
        onClick={onAbrirRegras}
      >
        <HelpCircle size={16} className="mr-1" />
        Ver Regras
      </Button>
    </div>
  );
};

export default CabecalhoJogo;
