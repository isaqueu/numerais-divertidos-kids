
import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isTouchDevice } from '@/utils/detectarToque';
import { Nivel, ConfigJogo, HistoricoPartida } from '@/types/jogo';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import RegrasJogo from './RegrasJogo';
import { salvarHistoricoPartida } from '@/utils/historicoUtils';
import { useUsuarioAtual } from '@/hooks/use-usuario';
import { embaralharArray } from '@/utils/jogoUtils';

// Componentes refatorados
import CabecalhoJogo from './jogo/CabecalhoJogo';
import AreaTrem from './jogo/AreaTrem';
import NumerosDisponiveis from './jogo/NumerosDisponiveis';
import BotoesAcaoJogo from './jogo/BotoesAcaoJogo';
import EfeitoComemorar from './jogo/EfeitoComemorar';

type JogoNumerosOrdemProps = {
  nivel: Nivel;
  config: ConfigJogo;
  aoPassarNivel: () => void;
  aoVoltarMenu: () => void;
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
  const [numerosOrdenados, setNumerosOrdenados] = useState<number[]>([]);
  const [respostasCorretas, setRespostasCorretas] = useState<boolean[]>([]);
  const [jogoCompleto, setJogoCompleto] = useState<boolean>(false);
  const [tentativas, setTentativas] = useState<number>(0);
  const [comemorando, setComemorando] = useState<boolean>(false);
  const [tempoInicial, setTempoInicial] = useState<number>(Date.now());
  const [mostrarRegras, setMostrarRegras] = useState<boolean>(false);
  
  const { usuario } = useUsuarioAtual();
  const isMobile = useIsMobile();
  const backendForDND = isTouchDevice() ? TouchBackend : HTML5Backend;

  // Inicializar jogo com números aleatórios do intervalo do nível
  useEffect(() => {
    iniciarJogo();
    setTempoInicial(Date.now());
  }, [nivel]);

  // Verificar se todos os números estão na posição correta
  useEffect(() => {
    if (numerosPosicionados.length === 0) return;
    
    // Verificar se todos os espaços foram preenchidos
    const todosPreenchidos = numerosPosicionados.every(num => num !== null);
    
    if (todosPreenchidos) {
      // Verificar se todos estão na ordem correta
      const estaoOrdenados = [...numerosPosicionados].every((num, index) => num === numerosOrdenados[index]);
      
      if (estaoOrdenados && !jogoCompleto) {
        // Todos os números estão corretos!
        const tempoFinal = Math.floor((Date.now() - tempoInicial) / 1000);
        setJogoCompleto(true);
        setComemorando(true);
        
        // Salvar histórico da partida
        if (usuario) {
          const historicoPartida: HistoricoPartida = {
            id: `${Date.now()}`,
            usuario: usuario.nome,
            nivelId: nivel.id,
            tituloNivel: nivel.titulo,
            dataHora: new Date().toISOString(),
            resultado: 'acerto',
            tentativas: tentativas,
            tempoTotal: tempoFinal
          };
          
          salvarHistoricoPartida(historicoPartida);
        }
        
        setTimeout(() => {
          toast("Parabéns!", { 
            description: `Você completou o nível ${nivel.titulo}!`,
            icon: "🎉",
          });
        }, 500);
      } else if (todosPreenchidos && !jogoCompleto) {
        // Todos os espaços preenchidos, mas ordem incorreta
        toast("Tente novamente!", { 
          description: "Os números não estão na ordem correta.",
          icon: "🤔",
        });
        
        // Registrar tentativa com erro
        if (usuario) {
          const historicoPartida: HistoricoPartida = {
            id: `${Date.now()}`,
            usuario: usuario.nome,
            nivelId: nivel.id,
            tituloNivel: nivel.titulo,
            dataHora: new Date().toISOString(),
            resultado: 'erro',
            tentativas: tentativas,
            tempoTotal: Math.floor((Date.now() - tempoInicial) / 1000)
          };
          
          salvarHistoricoPartida(historicoPartida);
        }
        
        // Reiniciar posições após um breve delay
        setTimeout(() => {
          reiniciarPosicoes();
        }, 1500);
      }
    }
  }, [numerosPosicionados]);

  // Iniciar um novo jogo com números aleatórios
  const iniciarJogo = () => {
    // Gerar array com números dentro do intervalo do nível
    const intervaloPossivel = Array.from(
      { length: (nivel.maximo - nivel.minimo) + 1 }, 
      (_, i) => nivel.minimo + i
    );
    
    // Pegar a quantidade configurada de números do intervalo
    const quantidadeNumeros = config.quantidadeNumeros;
    const numerosAleatorios = embaralharArray(intervaloPossivel)
      .slice(0, quantidadeNumeros);
      
    // Ordenar para saber a posição correta
    const ordenados = [...numerosAleatorios].sort((a, b) => a - b);
    setNumerosOrdenados(ordenados);
    
    // Números que o jogador irá arrastar
    setNumerosDisponiveis(embaralharArray(numerosAleatorios));
    
    // Posições vazias para colocar os números
    setNumerosPosicionados(Array(quantidadeNumeros).fill(null));
    
    // Array para controlar quais posições estão corretas
    setRespostasCorretas(Array(quantidadeNumeros).fill(false));
    
    setJogoCompleto(false);
    setTentativas(0);
    setComemorando(false);
    setTempoInicial(Date.now());
  };

  // Função para lidar com soltar um número em uma posição
  const handleSoltar = (indice: number, numero: number) => {
    // Se já existe um número nesse lugar, não faz nada
    if (numerosPosicionados[indice] !== null) return;
    
    // Atualiza números posicionados
    const novoNumerosPosicionados = [...numerosPosicionados];
    novoNumerosPosicionados[indice] = numero;
    
    setNumerosPosicionados(novoNumerosPosicionados);
    
    // Remove o número dos disponíveis
    setNumerosDisponiveis(prev => prev.filter(n => n !== numero));
    
    // Verifica se o número está na posição correta (comparando com array ordenado)
    const novasRespostas = [...respostasCorretas];
    novasRespostas[indice] = numero === numerosOrdenados[indice];
    setRespostasCorretas(novasRespostas);
    
    setTentativas(prev => prev + 1);
    
    // Verifica se a posição está correta e dá feedback
    if (novasRespostas[indice]) {
      toast("Muito bem!", { 
        description: `O número ${numero} está no lugar certo!`,
        icon: "👍",
      });
    } else {
      toast("Hmm...", { 
        description: `O número ${numero} não parece estar no lugar certo.`,
        icon: "🤔",
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

  return (
    <DndProvider backend={backendForDND}>
      <div className="max-w-4xl mx-auto">
        <CabecalhoJogo 
          nivel={nivel} 
          onAbrirRegras={() => setMostrarRegras(true)} 
        />

        <AreaTrem 
          numerosPosicionados={numerosPosicionados}
          respostasCorretas={respostasCorretas}
          handleSoltar={handleSoltar}
        />

        <NumerosDisponiveis
          numerosDisponiveis={numerosDisponiveis}
          jogoCompleto={jogoCompleto}
        />

        <BotoesAcaoJogo
          jogoCompleto={jogoCompleto}
          numerosPosicionados={numerosPosicionados}
          onVoltarMenu={aoVoltarMenu}
          onReiniciarPosicoes={reiniciarPosicoes}
          onProximoNivel={aoPassarNivel}
        />

        {/* Modal de Regras */}
        <RegrasJogo 
          nivel={nivel}
          aberto={mostrarRegras}
          aoFechar={() => setMostrarRegras(false)} 
        />

        <EfeitoComemorar comemorando={comemorando} />
      </div>
    </DndProvider>
  );
};

export default JogoNumerosOrdem;
