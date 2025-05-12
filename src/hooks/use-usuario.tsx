
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Usuario } from '@/types/jogo';
import { verificarUsuario, atualizarAcessoUsuario, inicializarUsuarios } from '@/utils/historicoUtils';
import { toast } from 'sonner';

type ContextoUsuario = {
  usuario: Usuario | null;
  carregando: boolean;
  fazerLogin: (nome: string) => boolean;
  fazerLogout: () => void;
};

const UsuarioContext = createContext<ContextoUsuario>({
  usuario: null,
  carregando: true,
  fazerLogin: () => false,
  fazerLogout: () => {},
});

export const ProvedorUsuario = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState<boolean>(true);

  // Verificar se há um usuário logado no localStorage
  useEffect(() => {
    inicializarUsuarios();
    const usuarioSalvo = localStorage.getItem('numerais-divertidos-usuario-atual');
    
    if (usuarioSalvo) {
      const nomeUsuario = JSON.parse(usuarioSalvo);
      const usuarioAtualizado = atualizarAcessoUsuario(nomeUsuario);
      
      if (usuarioAtualizado) {
        setUsuario(usuarioAtualizado);
      }
    }
    
    setCarregando(false);
  }, []);

  // Função para fazer login
  const fazerLogin = (nome: string): boolean => {
    if (verificarUsuario(nome)) {
      const usuarioLogado = atualizarAcessoUsuario(nome);
      
      if (usuarioLogado) {
        setUsuario(usuarioLogado);
        localStorage.setItem('numerais-divertidos-usuario-atual', JSON.stringify(nome));
        toast.success(`Bem-vindo(a), ${nome}!`);
        return true;
      }
    }
    
    toast.error('Usuário não encontrado!');
    return false;
  };

  // Função para fazer logout
  const fazerLogout = () => {
    setUsuario(null);
    localStorage.removeItem('numerais-divertidos-usuario-atual');
    toast('Você saiu com sucesso!');
  };

  return (
    <UsuarioContext.Provider value={{ usuario, carregando, fazerLogin, fazerLogout }}>
      {children}
    </UsuarioContext.Provider>
  );
};

// Hook para usar o contexto do usuário
export const useUsuarioAtual = () => useContext(UsuarioContext);
