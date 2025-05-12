
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useUsuarioAtual } from '@/hooks/use-usuario';

const Login: React.FC = () => {
  const [nome, setNome] = useState('');
  const { fazerLogin, usuario } = useUsuarioAtual();
  const navigate = useNavigate();
  
  // Redirecionar se já estiver logado
  useEffect(() => {
    if (usuario) {
      navigate('/dashboard');
    }
  }, [usuario, navigate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;
    
    const sucesso = fazerLogin(nome);
    if (sucesso) {
      navigate('/dashboard');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        <Card className="border-4 border-infantil-azul shadow-xl">
          <CardHeader className="bg-infantil-azul text-white text-center py-6">
            <CardTitle className="text-3xl font-bold">Numerais Divertidos</CardTitle>
            <CardDescription className="text-white text-lg mt-2">
              Aprenda os números de forma divertida!
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="nome" className="text-lg font-medium">
                  Qual é o seu nome?
                </label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Digite seu nome aqui"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  className="text-lg py-6"
                  autoComplete="off"
                  required
                />
                <p className="text-sm text-gray-500">
                  Usuários disponíveis: ISAQUEU, KLEDJANE, BELLY, GABI
                </p>
              </div>
              
              <Button type="submit" className="w-full py-6 text-lg bg-infantil-verde hover:bg-green-600">
                Começar a Jogar!
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-center pb-6">
            <div className="flex gap-2">
              {['🚂', '🎮', '🎯', '🎨', '🎭'].map((emoji, i) => (
                <span key={i} className="text-2xl animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}>
                  {emoji}
                </span>
              ))}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
