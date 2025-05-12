
import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { Nivel } from '@/types/jogo';

type CabecalhoJogoProps = {
  nivel: Nivel;
  onAbrirRegras: () => void;
};

const CabecalhoJogo: React.FC<CabecalhoJogoProps> = ({ nivel, onAbrirRegras }) => {
  return (
    <div className="text-center mb-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-2">
        {nivel.titulo}
      </h2>
      <p className="text-lg">
        Organize os números de {nivel.minimo} a {nivel.maximo} em ordem crescente
      </p>
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
