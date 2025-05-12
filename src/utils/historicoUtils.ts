
import { HistoricoPartida, Usuario } from '../types/jogo';

// Chaves para armazenar no localStorage
const CHAVE_HISTORICO = 'numerais-divertidos-historico';
const CHAVE_USUARIOS = 'numerais-divertidos-usuarios';

// Usuários pré-cadastrados
const USUARIOS_PADRAO = [
  { nome: 'ISAQUEU', acertos: 0, erros: 0, ultimoAcesso: '' },
  { nome: 'KLEDJANE', acertos: 0, erros: 0, ultimoAcesso: '' },
  { nome: 'BELLY', acertos: 0, erros: 0, ultimoAcesso: '' },
  { nome: 'GABI', acertos: 0, erros: 0, ultimoAcesso: '' }
];

// Função para inicializar usuários se não existirem
export const inicializarUsuarios = (): Usuario[] => {
  const usuariosExistentes = localStorage.getItem(CHAVE_USUARIOS);
  
  if (!usuariosExistentes) {
    localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(USUARIOS_PADRAO));
    return USUARIOS_PADRAO;
  }
  
  return JSON.parse(usuariosExistentes);
};

// Obter todos os usuários
export const obterUsuarios = (): Usuario[] => {
  return inicializarUsuarios();
};

// Verificar se um usuário existe
export const verificarUsuario = (nome: string): boolean => {
  const usuarios = obterUsuarios();
  return usuarios.some(usuario => usuario.nome.toUpperCase() === nome.toUpperCase());
};

// Atualizar último acesso do usuário
export const atualizarAcessoUsuario = (nome: string): Usuario | null => {
  const usuarios = obterUsuarios();
  const indice = usuarios.findIndex(
    usuario => usuario.nome.toUpperCase() === nome.toUpperCase()
  );
  
  if (indice === -1) return null;
  
  // Atualizar o último acesso
  usuarios[indice].ultimoAcesso = new Date().toISOString();
  
  // Salvar de volta no localStorage
  localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));
  
  return usuarios[indice];
};

// Obter todo o histórico de partidas
export const obterHistoricoPartidas = (): HistoricoPartida[] => {
  const historico = localStorage.getItem(CHAVE_HISTORICO);
  return historico ? JSON.parse(historico) : [];
};

// Salvar uma nova partida no histórico
export const salvarHistoricoPartida = (partida: HistoricoPartida): void => {
  // Obter histórico atual
  const historicoAtual = obterHistoricoPartidas();
  
  // Adicionar nova partida
  historicoAtual.push(partida);
  
  // Atualizar contadores do usuário
  const usuarios = obterUsuarios();
  const indiceUsuario = usuarios.findIndex(
    u => u.nome.toUpperCase() === partida.usuario.toUpperCase()
  );
  
  if (indiceUsuario !== -1) {
    if (partida.resultado === 'acerto') {
      usuarios[indiceUsuario].acertos += 1;
    } else {
      usuarios[indiceUsuario].erros += 1;
    }
    
    localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));
  }
  
  // Salvar no localStorage
  localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(historicoAtual));
};

// Obter histórico de um usuário específico
export const obterHistoricoUsuario = (nomeUsuario: string): HistoricoPartida[] => {
  const todasPartidas = obterHistoricoPartidas();
  return todasPartidas.filter(
    partida => partida.usuario.toUpperCase() === nomeUsuario.toUpperCase()
  );
};

// Obter histórico de um nível específico
export const obterHistoricoNivel = (nivelId: number): HistoricoPartida[] => {
  const todasPartidas = obterHistoricoPartidas();
  return todasPartidas.filter(partida => partida.nivelId === nivelId);
};

// Calcular ranking de usuários
export const calcularRanking = (): Usuario[] => {
  const usuarios = obterUsuarios();
  
  // Ordenar pelo número de acertos (decrescente) e então por erros (crescente)
  return [...usuarios].sort((a, b) => {
    if (a.acertos !== b.acertos) {
      return b.acertos - a.acertos; // Mais acertos primeiro
    }
    return a.erros - b.erros; // Menos erros é melhor
  });
};
