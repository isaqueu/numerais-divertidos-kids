
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { obterHistoricoUsuario } from '@/utils/historicoUtils';
import { HistoricoPartida } from '@/types/jogo';
import { useUsuarioAtual } from '@/hooks/use-usuario';
import { History, ChevronLeft, Clock, Award, ArrowRight } from 'lucide-react';

const HistoricoUsuario: React.FC = () => {
  const { nome } = useParams<{ nome: string }>();
  const { usuario, carregando } = useUsuarioAtual();
  const navigate = useNavigate();
  const [historico, setHistorico] = useState<HistoricoPartida[]>([]);
  const [partidasSelecionado, setPartidasSelecionado] = useState<HistoricoPartida[]>([]);
  const [nivelSelecionado, setNivelSelecionado] = useState<number | null>(null);
  
  // Redirecionar se não estiver logado
  useEffect(() => {
    if (!carregando && !usuario) {
      navigate('/');
    }
  }, [carregando, usuario, navigate]);
  
  // Carregar histórico ao montar o componente
  useEffect(() => {
    if (nome) {
      const historicoUsuario = obterHistoricoUsuario(nome);
      setHistorico(historicoUsuario);
    }
  }, [nome]);
  
  // Agrupar partidas por nível
  const niveis = React.useMemo(() => {
    const niveisUnicos = Array.from(new Set(historico.map(p => p.nivelId)))
      .sort((a, b) => a - b);
      
    return niveisUnicos.map(id => {
      const partidas = historico.filter(p => p.nivelId === id);
      const tituloNivel = partidas[0]?.tituloNivel || `Nível ${id}`;
      const acertos = partidas.filter(p => p.resultado === 'acerto').length;
      const erros = partidas.filter(p => p.resultado === 'erro').length;
      
      return {
        id,
        titulo: tituloNivel,
        acertos,
        erros,
        partidas: partidas.length
      };
    });
  }, [historico]);
  
  // Função para formatar data
  const formatarData = (dataString: string): string => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR') + ' ' + 
           data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };
  
  // Função para selecionar nível e mostrar partidas
  const selecionarNivel = (nivelId: number) => {
    setNivelSelecionado(nivelId);
    const partidasDoNivel = historico.filter(p => p.nivelId === nivelId);
    setPartidasSelecionado(partidasDoNivel);
  };
  
  // Voltar para a lista de níveis
  const voltarParaNiveis = () => {
    setNivelSelecionado(null);
    setPartidasSelecionado([]);
  };

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Carregando...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard">
              <Button variant="ghost" className="flex items-center gap-1 text-blue-600">
                <ChevronLeft size={18} />
                Voltar ao Dashboard
              </Button>
            </Link>
            
            <h1 className="text-xl md:text-2xl font-bold text-blue-600">
              Histórico de {nome}
            </h1>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {nivelSelecionado === null ? (
          <div className="space-y-6">
            <Card>
              <CardHeader className="bg-infantil-roxo text-white">
                <CardTitle className="flex items-center gap-2">
                  <History size={18} />
                  Histórico por Níveis
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {niveis.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-lg text-gray-500">
                      Nenhum histórico encontrado para {nome}.
                    </p>
                    <Link to="/jogo" className="mt-4 inline-block">
                      <Button className="bg-infantil-verde">
                        Começar a Jogar!
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nível</TableHead>
                        <TableHead className="text-center">Partidas</TableHead>
                        <TableHead className="text-center">Acertos</TableHead>
                        <TableHead className="text-center">Erros</TableHead>
                        <TableHead>Ação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {niveis.map((nivel) => (
                        <TableRow key={nivel.id}>
                          <TableCell className="font-medium">{nivel.titulo}</TableCell>
                          <TableCell className="text-center">{nivel.partidas}</TableCell>
                          <TableCell className="text-center font-medium text-green-600">
                            {nivel.acertos}
                          </TableCell>
                          <TableCell className="text-center font-medium text-red-500">
                            {nivel.erros}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-blue-500"
                              onClick={() => selecionarNivel(nivel.id)}
                            >
                              <ArrowRight size={16} className="mr-1" />
                              Ver Detalhes
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader className="bg-infantil-azul text-white">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Clock size={18} />
                    Partidas de {partidasSelecionado[0]?.tituloNivel || `Nível ${nivelSelecionado}`}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={voltarParaNiveis}
                    className="bg-white text-infantil-azul hover:bg-blue-100"
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    Voltar aos Níveis
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data e Hora</TableHead>
                      <TableHead className="text-center">Resultado</TableHead>
                      <TableHead className="text-center">Tentativas</TableHead>
                      <TableHead className="text-center">Tempo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {partidasSelecionado.map((partida) => (
                      <TableRow key={partida.id}>
                        <TableCell>
                          {formatarData(partida.dataHora)}
                        </TableCell>
                        <TableCell className="text-center">
                          {partida.resultado === 'acerto' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded">
                              <Award size={14} />
                              Acerto
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded">
                              Erro
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {partida.tentativas}
                        </TableCell>
                        <TableCell className="text-center">
                          {partida.tempoTotal} segundos
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoricoUsuario;
