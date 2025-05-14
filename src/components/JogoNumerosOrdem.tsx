
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

/**
 * Props para o componente JogoNumerosOrdem
 * @property {Nivel} nivel - Nível atual do jogo com informações como intervalo de números
 * @property {ConfigJogo} config - Configurações gerais do jogo como quantidade de números
 * @property {Function} aoPassarNivel - Callback executado quando o jogador completa o nível
 * @property {Function} aoVoltarMenu - Callback para retornar ao menu de seleção de níveis
 */
type JogoNumerosOrdemProps = {
  nivel: Nivel;
  config: ConfigJogo;
  aoPassarNivel: () => void;
  aoVoltarMenu: () => void;
};

/**
 * Componente principal do jogo de ordenação de números
 * Gerencia toda a lógica do jogo, incluindo arrastar e soltar números,
 * verificar posições corretas, controlar o fluxo do jogo e registrar progresso
 */
const JogoNumerosOrdem: React.FC<JogoNumerosOrdemProps> = ({ 
  nivel, 
  config, 
  aoPassarNivel, 
  aoVoltarMenu 
}) => {
  // Array de números disponíveis para o jogador arrastar
  const [numerosDisponiveis, setNumerosDisponiveis] = useState<number[]>([]);
  
  // Array que guarda os números posicionados em cada vagão (null = vazio)
  const [numerosPosicionados, setNumerosPosicionados] = useState<(number | null)[]>([]);
  
  // Array com a sequência correta de números para este nível
  const [numerosOrdenados, setNumerosOrdenados] = useState<number[]>([]);
  
  // Controla quais posições têm números colocados corretamente
  const [respostasCorretas, setRespostasCorretas] = useState<boolean[]>([]);
  
  // Indica se todos os vagões estão preenchidos (jogo completo)
  const [jogoCompleto, setJogoCompleto] = useState<boolean>(false);
  
  // Indica se o jogo está completado corretamente (sequência correta)
  const [jogoCorreto, setJogoCorreto] = useState<boolean>(false);
  
  // Contador de tentativas do jogador (cada vez que arrasta um número)
  const [tentativas, setTentativas] = useState<number>(0);
  
  // Controla a exibição da animação de comemoração
  const [comemorando, setComemorando] = useState<boolean>(false);
  
  // Timestamp do início da partida (para calcular tempo total)
  const [tempoInicial, setTempoInicial] = useState<number>(Date.now());
  
  // Controla a exibição do modal de regras
  const [mostrarRegras, setMostrarRegras] = useState<boolean>(false);
  
  // Obtém informações do usuário logado
  const { usuario } = useUsuarioAtual();
  
  // Verifica se a tela é móvel para ajustes de layout
  const isMobile = useIsMobile();
  
  // Define o backend apropriado para DnD (HTML5 ou Touch) baseado no dispositivo
  const backendForDND = isTouchDevice() ? TouchBackend : HTML5Backend;

  /**
   * Inicializa o jogo quando o nível muda
   * Gera números aleatórios baseados no intervalo do nível
   */
  useEffect(() => {
    console.log('[LIFECYCLE] useEffect para iniciar jogo - nível alterado', nivel);
    iniciarJogo();
    setTempoInicial(Date.now());
  }, [nivel]);

  /**
   * Verifica se todos os números estão posicionados corretamente
   * e atualiza o estado do jogo quando completo
   */
  useEffect(() => {
    if (numerosPosicionados.length === 0) return;
    
    console.log('[LIFECYCLE] useEffect para verificar jogo completo após mudança nos numerosPositionados', numerosPosicionados);
    
    // Verificar se todos os espaços foram preenchidos
    const todosPreenchidos = numerosPosicionados.every(num => num !== null);
    
    if (todosPreenchidos) {
      // Verificar se todos estão na ordem correta
      const estaoOrdenados = numerosPosicionados.every((num, index) => 
        num === numerosOrdenados[index]
      );
      
      setJogoCompleto(true);
      setJogoCorreto(estaoOrdenados);
      
      if (estaoOrdenados) {
        // Todos os números estão corretos!
        const tempoFinal = Math.floor((Date.now() - tempoInicial) / 1000);
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
      } else {
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
      }
    }
  }, [numerosPosicionados]);

  /**
   * Inicializa um novo jogo com números aleatórios
   * Gera todos os arrays necessários para o jogo funcionar
   */
  const iniciarJogo = () => {
    console.log('[INICIAR JOGO] Iniciando novo jogo para o nível', nivel);
    // Gerar array com números dentro do intervalo do nível
    const intervaloPossivel = Array.from(
      { length: (nivel.maximo - nivel.minimo) + 1 }, 
      (_, i) => nivel.minimo + i
    );
    
    // Pegar a quantidade configurada de números do intervalo
    const quantidadeNumeros = config.quantidadeNumeros;
    const numerosAleatorios = embaralharArray(intervaloPossivel)
      .slice(0, quantidadeNumeros);
      
    console.log('[INICIAR JOGO] Números aleatórios gerados:', numerosAleatorios);
    
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
    setJogoCorreto(false);
    setTentativas(0);
    setComemorando(false);
    setTempoInicial(Date.now());
    
    console.log('[INICIAR JOGO] Estado inicial do jogo:', {
      numerosOrdenados: ordenados,
      numerosDisponiveis: embaralharArray(numerosAleatorios),
      numerosPosicionados: Array(quantidadeNumeros).fill(null)
    });
  };

  /**
   * Função auxiliar para registrar o estado atual do jogo nos logs (depuração)
   * @param {string} mensagem - Mensagem descritiva sobre o momento do log
   */
  const logEstadoAtual = (mensagem: string) => {
    console.log(`[LOG_ESTADO] ${mensagem}:`, {
      numerosDisponiveis,
      numerosPosicionados,
      respostasCorretas,
      jogoCompleto,
      jogoCorreto
    });
  };

  /**
   * Manipula o evento quando um número é solto em uma posição
   * Atualiza o estado do jogo e fornece feedback visual ao usuário
   * 
   * @param {number} indice - Índice do vagão onde o número foi solto
   * @param {number} numero - O número que foi arrastado e solto
   * @param {number|null} numeroAnterior - Número que estava no vagão antes (se houver)
   */
  const handleSoltar = (indice: number, numero: number, numeroAnterior: number | null) => {
    console.log(`[HANDLE_SOLTAR] Início: Soltar número ${numero} no vagão ${indice}`, {
      numeroAnterior,
      estadoAntes: {
        numerosDisponiveis: [...numerosDisponiveis],
        numerosPosicionados: [...numerosPosicionados]
      }
    });
    
    // Incrementa tentativas
    setTentativas(prev => prev + 1);
    
    // Atualiza números posicionados
    const novoNumerosPosicionados = [...numerosPosicionados];
    novoNumerosPosicionados[indice] = numero;
    setNumerosPosicionados(novoNumerosPosicionados);
    console.log(`[HANDLE_SOLTAR] Atualizou numerosPosicionados:`, novoNumerosPosicionados);
    
    // Atualiza números disponíveis - CORREÇÃO AQUI
    // Cria uma cópia do array atual de números disponíveis
    const novosNumerosDisponiveis = [...numerosDisponiveis];
    
    // 1. Remover o número que acabou de ser colocado no vagão da área disponível
    const indexNumeroSolto = novosNumerosDisponiveis.indexOf(numero);
    if (indexNumeroSolto !== -1) {
      console.log(`[HANDLE_SOLTAR] Removendo número ${numero} da posição ${indexNumeroSolto} em numerosDisponiveis`);
      novosNumerosDisponiveis.splice(indexNumeroSolto, 1);
    } else {
      // Se o número não está nos disponíveis, precisamos verificar de onde ele veio
      console.log(`[HANDLE_SOLTAR] Número ${numero} não encontrado em numerosDisponiveis, verificando posições anteriores`);
      
      // Verifica se o número estava em outra posição e remove de lá
      const posicaoAnterior = numerosPosicionados.findIndex((num, idx) => num === numero && idx !== indice);
      if (posicaoAnterior !== -1) {
        console.log(`[HANDLE_SOLTAR] Número ${numero} encontrado no vagão ${posicaoAnterior}, removendo de lá`);
        novoNumerosPosicionados[posicaoAnterior] = null;
        // Não precisamos adicionar aos disponíveis, pois está sendo movido para outra posição
      }
    }
    
    // 2. Se tinha um número anterior no vagão, devolvê-lo para a área disponível
    if (numeroAnterior !== null) {
      console.log(`[HANDLE_SOLTAR] Devolvendo número anterior ${numeroAnterior} para numerosDisponiveis`);
      novosNumerosDisponiveis.push(numeroAnterior);
    }
    
    console.log(`[HANDLE_SOLTAR] Novos numerosDisponiveis:`, novosNumerosDisponiveis);
    setNumerosDisponiveis(novosNumerosDisponiveis);
    
    // Verifica se o número está na posição correta
    const novasRespostas = [...respostasCorretas];
    const estaCorreto = numero === numerosOrdenados[indice];
    novasRespostas[indice] = estaCorreto;
    setRespostasCorretas(novasRespostas);
    console.log(`[HANDLE_SOLTAR] Número ${numero} na posição ${indice} está correto? ${estaCorreto}`);
    
    // Log estado final
    console.log(`[HANDLE_SOLTAR] Estado final após soltar:`, {
      numerosDisponiveis: novosNumerosDisponiveis,
      numerosPosicionados: novoNumerosPosicionados,
      respostasCorretas: novasRespostas
    });
    
    // Feedback para o usuário
    if (estaCorreto) {
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

  /**
   * Reinicia as posições dos números sem mudar o conjunto de números
   * Limpa os vagões e devolve todos os números para a área disponível
   */
  const reiniciarPosicoes = () => {
    console.log('[REINICIAR_POSICOES] Iniciando reinício das posições');
    // Junta todos os números (posicionados + disponíveis)
    const todosNumeros = [
      ...numerosPosicionados.filter(n => n !== null) as number[], 
      ...numerosDisponiveis
    ];
    
    console.log('[REINICIAR_POSICOES] Todos os números disponíveis após reset:', todosNumeros);
    
    // Reseta posições e disponibiliza todos os números novamente
    setNumerosPosicionados(Array(numerosPosicionados.length).fill(null));
    setNumerosDisponiveis(embaralharArray(todosNumeros));
    setRespostasCorretas(Array(numerosPosicionados.length).fill(false));
    setJogoCompleto(false);
    setJogoCorreto(false);
    
    // Log estado final
    logEstadoAtual('Estado após reiniciar posições');
    
    toast("Jogo reiniciado", { 
      description: "Tente novamente organizar os números!" 
    });
  };

  /**
   * Wrapper da função handleSoltar para passar para o componente AreaTrem
   * Mantém a assinatura da função esperada pelo componente
   */
  const handleSoltarAreaTrem = (indice: number, numero: number, numeroAnterior: number | null) => {
    console.log(`[HANDLE_SOLTAR_AREA_TREM] Delegando soltar número ${numero} no vagão ${indice} (anterior: ${numeroAnterior})`);
    handleSoltar(indice, numero, numeroAnterior);
  };

  // Logamos estado a cada renderização para depuração
  console.log('[RENDER] JogoNumerosOrdem renderizando com estado:', {
    nivel: nivel.titulo,
    numerosDisponiveis: numerosDisponiveis,
    numerosPosicionados: numerosPosicionados,
    jogoCompleto,
    jogoCorreto
  });

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
          handleSoltar={handleSoltarAreaTrem}
        />

        <NumerosDisponiveis
          numerosDisponiveis={numerosDisponiveis}
          jogoCompleto={jogoCompleto}
        />
        
        {jogoCompleto && (
          <div className={`mb-4 p-4 rounded-md text-center ${jogoCorreto ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <h3 className="text-xl font-bold">
              {jogoCorreto ? '🎉 Parabéns! Sequência correta!' : '❌ Sequência incorreta!'}
            </h3>
            <p>
              {jogoCorreto 
                ? 'Você organizou todos os números na ordem certa!' 
                : 'Os números não estão na ordem correta. Tente novamente.'}
            </p>
          </div>
        )}

        <BotoesAcaoJogo
          jogoCompleto={jogoCompleto}
          jogoCorreto={jogoCorreto}
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
