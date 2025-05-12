
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isTouchDevice } from '@/utils/detectarToque';
import { niveis as niveisIniciais, configPadrao } from "@/data/niveis";
import JogoNumerosOrdem from '@/components/JogoNumerosOrdem';
import SelecaoNivel from '@/components/SelecaoNivel';
import { Nivel } from '@/types/jogo';
import { toast } from 'sonner';
import { useUsuarioAtual } from '@/hooks/use-usuario';

const Index = () => {
  const [niveis, setNiveis] = useState(niveisIniciais);
  const [nivelAtual, setNivelAtual] = useState<Nivel | null>(null);
  const [jogoEmAndamento, setJogoEmAndamento] = useState(false);
  const { usuario, carregando } = useUsuarioAtual();
  const navigate = useNavigate();
  
  // Usar backend apropriado para DnD com base no dispositivo
  const backendForDND = isTouchDevice() ? TouchBackend : HTML5Backend;

  // Verificar se usuário está logado
  useEffect(() => {
    if (!carregando && !usuario) {
      navigate('/');
    }
  }, [carregando, usuario, navigate]);

  // Carregar progresso do jogador do localStorage
  useEffect(() => {
    if (usuario) {
      const progressoSalvo = localStorage.getItem(`numerais-divertidos-progresso-${usuario.nome}`);
      if (progressoSalvo) {
        try {
          const niveisCarregados = JSON.parse(progressoSalvo);
          setNiveis(niveisCarregados);
        } catch (e) {
          console.error("Erro ao carregar progresso:", e);
        }
      }
    }
  }, [usuario]);

  // Salvar progresso do jogador no localStorage
  useEffect(() => {
    if (usuario && niveis !== niveisIniciais) {
      localStorage.setItem(`numerais-divertidos-progresso-${usuario.nome}`, JSON.stringify(niveis));
    }
  }, [niveis, usuario]);

  // Selecionar um nível para jogar
  const handleSelecionarNivel = (nivel: Nivel) => {
    setNivelAtual(nivel);
    setJogoEmAndamento(true);
  };

  // Voltar para a seleção de níveis
  const handleVoltarMenu = () => {
    setJogoEmAndamento(false);
    setNivelAtual(null);
  };

  // Passar para o próximo nível
  const handlePassarNivel = () => {
    if (!nivelAtual) return;

    // Atualizar estado do nível atual como concluído
    const niveisAtualizados = niveis.map(nivel => 
      nivel.id === nivelAtual.id 
        ? { ...nivel, concluido: true } 
        : nivel
    );

    // Desbloquear próximo nível, se existir
    const proximoNivelId = nivelAtual.id + 1;
    const existeProximoNivel = niveisAtualizados.some(nivel => nivel.id === proximoNivelId);
    
    if (existeProximoNivel) {
      const niveisComProximoDesbloqueado = niveisAtualizados.map(nivel => 
        nivel.id === proximoNivelId 
          ? { ...nivel, desbloqueado: true } 
          : nivel
      );
      setNiveis(niveisComProximoDesbloqueado);
      
      // Encontrar o próximo nível
      const proximoNivel = niveisComProximoDesbloqueado.find(nivel => nivel.id === proximoNivelId);
      
      if (proximoNivel) {
        toast("Novo nível desbloqueado!", {
          description: proximoNivel.titulo,
          icon: "🎮",
        });
        
        // Perguntar se quer jogar o próximo nível
        const querJogar = window.confirm("Parabéns! Deseja jogar o próximo nível?");
        if (querJogar) {
          setNivelAtual(proximoNivel);
          return;
        }
      }
    } else {
      setNiveis(niveisAtualizados);
      toast("Parabéns!", {
        description: "Você completou todos os níveis do jogo!",
        icon: "🏆",
      });
    }
    
    // Voltar ao menu se não for jogar o próximo nível
    setJogoEmAndamento(false);
    setNivelAtual(null);
  };

  // Resetar todo o progresso do jogo
  const handleResetarProgresso = () => {
    if (window.confirm("Tem certeza que deseja resetar todo o seu progresso? Isso não pode ser desfeito!")) {
      if (usuario) {
        localStorage.removeItem(`numerais-divertidos-progresso-${usuario.nome}`);
      }
      setNiveis(niveisIniciais);
      setJogoEmAndamento(false);
      setNivelAtual(null);
      toast("Progresso resetado", {
        description: "Todo o seu progresso foi apagado.",
      });
    }
  };

  // Voltar para o Dashboard
  const voltarDashboard = () => {
    navigate('/dashboard');
  };

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Carregando...</p>
      </div>
    );
  }

  return (
    <DndProvider backend={backendForDND}>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-purple-50">
        {/* Cabeçalho */}
        <header className="bg-white shadow-md py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl md:text-3xl font-bold text-blue-600">
                Numerais Divertidos
              </h1>
              
              <div className="flex gap-2">
                <button 
                  onClick={voltarDashboard}
                  className="text-sm text-infantil-roxo hover:text-infantil-azul border border-infantil-roxo hover:border-infantil-azul px-2 py-1 rounded"
                >
                  Dashboard
                </button>
                
                {!jogoEmAndamento && (
                  <button 
                    onClick={handleResetarProgresso}
                    className="text-sm text-gray-400 hover:text-gray-600"
                  >
                    Resetar Progresso
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo principal */}
        <main className="container mx-auto px-4 py-8 flex-grow">
          {jogoEmAndamento && nivelAtual ? (
            <JogoNumerosOrdem
              nivel={nivelAtual}
              config={configPadrao}
              aoPassarNivel={handlePassarNivel}
              aoVoltarMenu={handleVoltarMenu}
            />
          ) : (
            <SelecaoNivel 
              niveis={niveis} 
              aoSelecionarNivel={handleSelecionarNivel}
            />
          )}
        </main>

        {/* Rodapé */}
        <footer className="bg-white shadow-inner py-4">
          <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
            &copy; 2023 Numerais Divertidos - Jogo educativo para crianças
          </div>
        </footer>
      </div>
    </DndProvider>
  );
};

export default Index;
