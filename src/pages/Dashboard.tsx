
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { calcularRanking } from '@/utils/historicoUtils';
import { useUsuarioAtual } from '@/hooks/use-usuario';
import { Trophy, Star, User, Clock, LogOut } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { usuario, fazerLogout, carregando } = useUsuarioAtual();
  const navigate = useNavigate();
  const ranking = calcularRanking();
  
  // Redirecionar se não estiver logado
  useEffect(() => {
    if (!carregando && !usuario) {
      navigate('/');
    }
  }, [usuario, carregando, navigate]);
  
  if (carregando || !usuario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Carregando...</p>
      </div>
    );
  }
  
  // Manipulador para logout
  const handleLogout = () => {
    fazerLogout();
    navigate('/');
  };
  
  // Manipulador para iniciar jogo
  const iniciarJogo = () => {
    navigate('/jogo');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-blue-600">
              Numerais Divertidos
            </h1>
            
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium hidden md:inline">
                Olá, {usuario.nome}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center gap-1"
              >
                <LogOut size={16} />
                <span className="hidden md:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Seção do usuário atual */}
          <Card className="md:col-span-1">
            <CardHeader className="bg-infantil-azul text-white">
              <CardTitle className="flex items-center gap-2">
                <User size={18} />
                Seu Desempenho
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="text-center">
                  <span className="text-5xl font-bold text-infantil-roxo">{usuario.nome}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <span className="text-3xl font-bold text-green-600">
                      {usuario.acertos}
                    </span>
                    <p className="text-sm font-medium mt-1">Acertos</p>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <span className="text-3xl font-bold text-red-500">
                      {usuario.erros}
                    </span>
                    <p className="text-sm font-medium mt-1">Erros</p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Link to={`/historico/${usuario.nome}`}>
                    <Button variant="outline" className="w-full border-infantil-roxo text-infantil-roxo hover:bg-infantil-roxo hover:text-white">
                      Ver Meu Histórico
                    </Button>
                  </Link>
                </div>
                
                <div className="pt-2">
                  <Button onClick={iniciarJogo} className="w-full bg-infantil-verde hover:bg-green-600">
                    Jogar Agora
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Seção de Ranking */}
          <Card className="md:col-span-2">
            <CardHeader className="bg-infantil-amarelo text-white">
              <CardTitle className="flex items-center gap-2">
                <Trophy size={18} />
                Ranking de Jogadores
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Posição</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead className="text-center">Acertos</TableHead>
                    <TableHead className="text-center">Erros</TableHead>
                    <TableHead>Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ranking.map((jogador, index) => (
                    <TableRow key={jogador.nome} className={jogador.nome === usuario.nome ? "bg-blue-50" : ""}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          {index === 0 ? <Trophy size={16} className="text-yellow-500 mr-1" /> : 
                           index === 1 ? <Trophy size={16} className="text-gray-400 mr-1" /> : 
                           index === 2 ? <Trophy size={16} className="text-amber-700 mr-1" /> : null}
                          {index + 1}º
                        </div>
                      </TableCell>
                      <TableCell className="font-bold">
                        {jogador.nome}
                        {jogador.nome === usuario.nome && (
                          <span className="ml-2 text-xs bg-infantil-roxo text-white px-2 py-0.5 rounded">
                            Você
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-center font-medium text-green-600">
                        {jogador.acertos}
                      </TableCell>
                      <TableCell className="text-center font-medium text-red-500">
                        {jogador.erros}
                      </TableCell>
                      <TableCell>
                        <Link to={`/historico/${jogador.nome}`}>
                          <Button variant="ghost" size="sm" className="text-blue-500">
                            <Clock size={16} className="mr-1" />
                            Histórico
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
