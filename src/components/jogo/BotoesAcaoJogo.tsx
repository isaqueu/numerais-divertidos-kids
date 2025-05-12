
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

type BotoesAcaoJogoProps = {
  jogoCompleto: boolean;
  numerosPosicionados: (number | null)[];
  onVoltarMenu: () => void;
  onReiniciarPosicoes: () => void;
  onProximoNivel: () => void;
};

const BotoesAcaoJogo: React.FC<BotoesAcaoJogoProps> = ({
  jogoCompleto,
  numerosPosicionados,
  onVoltarMenu,
  onReiniciarPosicoes,
  onProximoNivel,
}) => {
  return (
    <div className="flex justify-between mt-6">
      <Button 
        variant="outline" 
        onClick={onVoltarMenu}
        className="border-infantil-roxo text-infantil-roxo hover:bg-infantil-roxo hover:text-white"
      >
        Menu
      </Button>

      {!jogoCompleto ? (
        <Button
          variant="outline"
          onClick={onReiniciarPosicoes}
          className="border-infantil-laranja text-infantil-laranja hover:bg-infantil-laranja hover:text-white"
          disabled={numerosPosicionados.every(n => n === null)}
        >
          Reiniciar
        </Button>
      ) : (
        <Button
          onClick={onProximoNivel}
          className="bg-infantil-verde hover:bg-green-600 gap-2"
        >
          Próximo Nível
          <ArrowRight size={16} />
        </Button>
      )}
    </div>
  );
};

export default BotoesAcaoJogo;
