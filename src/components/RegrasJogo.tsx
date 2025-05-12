
import React from 'react';
import { Nivel } from '@/types/jogo';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, ListOrdered, ArrowRight, Clock } from 'lucide-react';

type RegrasJogoProps = {
  nivel: Nivel;
  aberto: boolean;
  aoFechar: () => void;
};

const RegrasJogo: React.FC<RegrasJogoProps> = ({ 
  nivel, 
  aberto, 
  aoFechar 
}) => {
  return (
    <Dialog open={aberto} onOpenChange={aoFechar}>
      <DialogContent className="max-w-md md:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-infantil-azul flex items-center gap-2">
            <ListOrdered size={22} />
            Regras do {nivel.titulo}
          </DialogTitle>
          <DialogDescription className="text-lg">
            Aprenda como jogar e organizar seus números!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div className="border-l-4 border-infantil-azul pl-3 py-1">
            <h3 className="text-lg font-medium mb-1">Objetivo:</h3>
            <p>Organizar os números de {nivel.minimo} a {nivel.maximo} em ordem crescente (do menor para o maior) nos vagões do trem.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2 flex items-center gap-1">
              <ArrowRight size={18} className="text-infantil-verde" />
              Como Jogar:
            </h3>
            <ol className="list-decimal ml-5 space-y-3">
              <li>Observe os <strong className="text-infantil-azul">números disponíveis</strong> na área inferior.</li>
              <li>Clique e arraste cada número para um <strong className="text-infantil-roxo">vagão do trem</strong> na ordem correta.</li>
              <li>Os números devem ser organizados do <strong>menor para o maior</strong>, da esquerda para a direita.</li>
              <li>Quando um número for colocado na posição correta, o vagão ficará <strong className="text-green-500">verde</strong>.</li>
              <li>Se todos os números forem colocados corretamente, você completa o nível!</li>
            </ol>
          </div>
          
          <div className="border-l-4 border-infantil-laranja pl-3 py-1">
            <h3 className="text-lg font-medium mb-1 flex items-center gap-1">
              <Star size={18} className="text-infantil-amarelo" />
              Dicas Importantes:
            </h3>
            <ul className="list-disc ml-5 space-y-2">
              <li>Um vagão <strong className="text-green-500">verde</strong> significa que o número está na posição correta.</li>
              <li>Um vagão <strong className="text-red-500">vermelho</strong> significa que o número está na posição errada.</li>
              <li>O botão "Reiniciar" permite começar de novo, mas conta como um erro.</li>
              <li>Seu desempenho é registrado para mostrar seu progresso!</li>
            </ul>
          </div>
          
          <div className="border-l-4 border-infantil-verde pl-3 py-1">
            <h3 className="text-lg font-medium mb-1 flex items-center gap-1">
              <Clock size={18} className="text-infantil-roxo" />
              Lembre-se:
            </h3>
            <p>Não há limite de tempo, mas seu tempo é registrado. Quanto mais rápido você completar corretamente, melhor será sua pontuação!</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={aoFechar} className="bg-infantil-verde">
            Entendi, Vamos Jogar!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RegrasJogo;
