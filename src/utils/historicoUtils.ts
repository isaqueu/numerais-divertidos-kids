
import { HistoricoPartida, Usuario } from '../types/jogo';

// Chaves para armazenar no localStorage
const CHAVE_HISTORICO = 'numerais-divertidos-historico';
const CHAVE_USUARIOS = 'numerais-divertidos-usuarios';

/**
 * Lista de usuários pré-cadastrados no sistema
 * Usado para inicialização quando não há dados salvos
 */
const USUARIOS_PADRAO = [
  { nome: 'ISAQUEU', acertos: 0, erros: 0, ultimoAcesso: '' },
  { nome: 'KLEDJANE', acertos: 0, erros: 0, ultimoAcesso: '' },
  { nome: 'BELLY', acertos: 0, erros: 0, ultimoAcesso: '' },
  { nome: 'GABI', acertos: 0, erros: 0, ultimoAcesso: '' }
];

/**
 * Inicializa a lista de usuários no localStorage se não existir
 * @returns {Usuario[]} - Array de usuários do sistema
 */
export const inicializarUsuarios = (): Usuario[] => {
  const usuariosExistentes = localStorage.getItem(CHAVE_USUARIOS);
  
  if (!usuariosExistentes) {
    localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(USUARIOS_PADRAO));
    return USUARIOS_PADRAO;
  }
  
  return JSON.parse(usuariosExistentes);
};

/**
 * Obtém todos os usuários cadastrados no sistema
 * @returns {Usuario[]} - Array de todos os usuários
 */
export const obterUsuarios = (): Usuario[] => {
  return inicializarUsuarios();
};

/**
 * Verifica se um usuário existe no sistema
 * @param {string} nome - Nome do usuário a verificar
 * @returns {boolean} - true se o usuário existe, false caso contrário
 */
export const verificarUsuario = (nome: string): boolean => {
  const usuarios = obterUsuarios();
  return usuarios.some(usuario => usuario.nome.toUpperCase() === nome.toUpperCase());
};

/**
 * Atualiza o registro de último acesso de um usuário
 * @param {string} nome - Nome do usuário a atualizar
 * @returns {Usuario|null} - Dados do usuário atualizado ou null se não encontrado
 */
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

/**
 * Obtém todo o histórico de partidas do sistema
 * @returns {HistoricoPartida[]} - Array com todas as partidas registradas
 */
export const obterHistoricoPartidas = (): HistoricoPartida[] => {
  const historico = localStorage.getItem(CHAVE_HISTORICO);
  return historico ? JSON.parse(historico) : [];
};

/**
 * Salva uma nova partida no histórico e atualiza estatísticas do usuário
 * @param {HistoricoPartida} partida - Dados da partida a ser salva
 */
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
    // Incrementa contador de acertos ou erros conforme o resultado
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

/**
 * Filtra o histórico de partidas para um usuário específico
 * @param {string} nomeUsuario - Nome do usuário para filtrar
 * @returns {HistoricoPartida[]} - Array das partidas do usuário
 */
export const obterHistoricoUsuario = (nomeUsuario: string): HistoricoPartida[] => {
  const todasPartidas = obterHistoricoPartidas();
  return todasPartidas.filter(
    partida => partida.usuario.toUpperCase() === nomeUsuario.toUpperCase()
  );
};

/**
 * Filtra o histórico de partidas para um nível específico
 * @param {number} nivelId - ID do nível para filtrar
 * @returns {HistoricoPartida[]} - Array das partidas do nível
 */
export const obterHistoricoNivel = (nivelId: number): HistoricoPartida[] => {
  const todasPartidas = obterHistoricoPartidas();
  return todasPartidas.filter(partida => partida.nivelId === nivelId);
};

/**
 * Calcula o ranking dos usuários baseado em acertos e erros
 * @returns {Usuario[]} - Array de usuários ordenados por desempenho
 */
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
