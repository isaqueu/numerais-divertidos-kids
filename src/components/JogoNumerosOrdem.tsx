
import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isTouchDevice } from '@/utils/detectarToque';
import AreaNumero from './AreaNumero';
import CartaoNumero from './CartaoNumero';
import { Button } from '@/components/ui/button';
import { Nivel, ConfigJogo } from '@/types/jogo';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Confetti,
  Star,
  ArrowRight
} from 'lucide-react';

type JogoNumerosOrdemProps = {
  nivel: Nivel;
  config: ConfigJogo;
  aoPassarNivel: () => void;
  aoVoltarMenu: () => void;
};

// Função para embaralhar array (algoritmo de Fisher-Yates)
const embaralharArray = <T,>(array: T[]): T[] => {
  const novoArray = [...array];
  for (let i = novoArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [novoArray[i], novoArray[j]] = [novoArray[j], novoArray[i]];
  }
  return novoArray;
};

// Componente principal do jogo
const JogoNumerosOrdem: React.FC<JogoNumerosOrdemProps> = ({ 
  nivel, 
  config, 
  aoPassarNivel, 
  aoVoltarMenu 
}) => {
  const [numerosDisponiveis, setNumerosDisponiveis] = useState<number[]>([]);
  const [numerosPosicionados, setNumerosPosicionados] = useState<(number | null)[]>([]);
  const [respostasCorretas, setRespostasCorretas] = useState<boolean[]>([]);
  const [jogoCompleto, setJogoCompleto] = useState<boolean>(false);
  const [tentativas, setTentativas] = useState<number>(0);
  const [comemorando, setComemorando] = useState<boolean>(false);
  
  const isMobile = useIsMobile();
  const backendForDND = isTouchDevice() ? TouchBackend : HTML5Backend;

  // Inicializar jogo com números aleatórios do intervalo do nível
  useEffect(() => {
    iniciarJogo();
  }, [nivel]);

  // Verificar se todos os números estão na posição correta
  useEffect(() => {
    if (numerosPosicionados.length === 0) return;
    
    const todosCorretos = respostasCorretas.every(correto => correto);
    
    if (todosCorretos && !jogoCompleto && numerosPosicionados.every(num => num !== null)) {
      // Todos os números estão corretos!
      setJogoCompleto(true);
      setComemorando(true);
      
      setTimeout(() => {
        toast("Parabéns!", { 
          description: `Você completou o nível ${nivel.titulo}!`,
          icon: "🎉",
        });
      }, 500);
    }
  }, [respostasCorretas, numerosPosicionados]);

  // Iniciar um novo jogo com números aleatórios
  const iniciarJogo = () => {
    // Gerar array com números dentro do intervalo do nível
    const intervaloPossivel = Array.from(
      { length: (nivel.maximo - nivel.minimo) + 1 }, 
      (_, i) => nivel.minimo + i
    );
    
    // Pegar uma quantidade aleatória de números do intervalo
    const numerosAleatorios = embaralharArray(intervaloPossivel)
      .slice(0, config.quantidadeNumeros);
      
    // Ordenar para saber a posição correta
    const numerosOrdenados = [...numerosAleatorios].sort((a, b) => a - b);
    
    // Números que o jogador irá arrastar
    setNumerosDisponiveis(embaralharArray(numerosAleatorios));
    
    // Posições vazias para colocar os números
    setNumerosPosicionados(Array(numerosAleatorios.length).fill(null));
    
    // Array para controlar quais posições estão corretas
    setRespostasCorretas(Array(numerosAleatorios.length).fill(false));
    
    setJogoCompleto(false);
    setTentativas(0);
    setComemorando(false);
  };

  // Função para lidar com soltar um número em uma posição
  const handleSoltar = (indice: number, numero: number) => {
    // Se já existe um número nesse lugar, não faz nada
    if (numerosPosicionados[indice] !== null) return;
    
    // Atualiza números disponíveis e posicionados
    const novoNumerosPosicionados = [...numerosPosicionados];
    novoNumerosPosicionados[indice] = numero;
    setNumerosPosicionados(novoNumerosPosicionados);
    
    // Remove o número dos disponíveis
    setNumerosDisponiveis(prev => prev.filter(n => n !== numero));
    
    // Verifica se o número está na posição correta
    const numerosOrdenados = [...numerosPosicionados.filter(n => n !== null), numero]
      .sort((a, b) => a! - b!);
      
    const novasRespostas = [...respostasCorretas];
    novasRespostas[indice] = numerosOrdenados[indice] === numero;
    setRespostasCorretas(novasRespostas);
    
    setTentativas(prev => prev + 1);
    
    // Verifica se a posição está correta e dá feedback
    if (novasRespostas[indice]) {
      toast("Muito bem!", { 
        description: `O número ${numero} está no lugar certo!`,
        icon: "👍",
      });
    }
  };

  // Reiniciar posições sem mudar os números
  const reiniciarPosicoes = () => {
    // Junta todos os números (posicionados + disponíveis)
    const todosNumeros = [...numerosPosicionados.filter(n => n !== null), ...numerosDisponiveis];
    
    // Reseta posições e disponibiliza todos os números novamente
    setNumerosPosicionados(Array(numerosPosicionados.length).fill(null));
    setNumerosDisponiveis(embaralharArray(todosNumeros));
    setRespostasCorretas(Array(numerosPosicionados.length).fill(false));
    
    toast("Jogo reiniciado", { 
      description: "Tente novamente organizar os números!" 
    });
  };

  // Próximo nível ou voltar ao menu
  const handleProximoNivel = () => {
    aoPassarNivel();
  };

  return (
    <DndProvider backend={backendForDND}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {nivel.titulo}
          </h2>
          <p className="text-lg">
            Organize os números de {nivel.minimo} a {nivel.maximo} em ordem crescente
          </p>
        </div>

        {/* Área do trem */}
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

        {/* Área dos números disponíveis */}
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

        {/* Botões de ação */}
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={aoVoltarMenu}
            className="border-infantil-roxo text-infantil-roxo hover:bg-infantil-roxo hover:text-white"
          >
            Menu
          </Button>

          {!jogoCompleto ? (
            <Button
              variant="outline"
              onClick={reiniciarPosicoes}
              className="border-infantil-laranja text-infantil-laranja hover:bg-infantil-laranja hover:text-white"
              disabled={numerosPosicionados.every(n => n === null)}
            >
              Reiniciar
            </Button>
          ) : (
            <Button
              onClick={handleProximoNivel}
              className="bg-infantil-verde hover:bg-green-600 gap-2"
            >
              Próximo Nível
              <ArrowRight size={16} />
            </Button>
          )}
        </div>

        {/* Efeito de comemoração */}
        {comemorando && (
          <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
            {Array(20).fill(0).map((_, i) => (
              <div 
                key={i}
                className="absolute animate-comemorar text-3xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${1 + Math.random() * 2}s`
                }}
              >
                {['🎉', '⭐', '🎊', '🏆', '✨'][Math.floor(Math.random() * 5)]}
              </div>
            ))}
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default JogoNumerosOrdem;
