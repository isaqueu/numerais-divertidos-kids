
/**
 * Define o tipo de nível do jogo
 * @property {number} id - Identificador único do nível
 * @property {string} titulo - Nome do nível exibido para o jogador
 * @property {number} minimo - Valor mínimo do intervalo de números
 * @property {number} maximo - Valor máximo do intervalo de números
 * @property {boolean} desbloqueado - Se o jogador tem acesso ao nível
 * @property {boolean} concluido - Se o jogador já completou o nível
 */
export type Nivel = {
  id: number;
  titulo: string;
  minimo: number;
  maximo: number;
  desbloqueado: boolean;
  concluido: boolean;
};

/**
 * Define as configurações do jogo
 * @property {number} quantidadeNumeros - Quantidade de números exibidos por vez
 * @property {number} tempoLimite - Tempo limite em segundos (0 = sem limite)
 * @property {boolean} mostrarDicas - Se o jogo deve mostrar dicas para o jogador
 */
export type ConfigJogo = {
  quantidadeNumeros: number;
  tempoLimite: number;
  mostrarDicas: boolean;
};

/**
 * Define o registro de uma partida finalizada
 * @property {string} id - Identificador único da partida
 * @property {string} usuario - Nome do usuário que jogou
 * @property {number} nivelId - Identificador do nível jogado
 * @property {string} tituloNivel - Nome do nível para exibição
 * @property {string} dataHora - Data e hora da partida em formato ISO
 * @property {string} resultado - Resultado da partida ('acerto' ou 'erro')
 * @property {number} tentativas - Quantidade de tentativas feitas
 * @property {number} tempoTotal - Tempo total da partida em segundos
 */
export type HistoricoPartida = {
  id: string;
  usuario: string;
  nivelId: number;
  tituloNivel: string;
  dataHora: string;
  resultado: 'acerto' | 'erro';
  tentativas: number;
  tempoTotal: number;
};

/**
 * Define um usuário do sistema
 * @property {string} nome - Nome do usuário
 * @property {number} acertos - Total de partidas com acerto
 * @property {number} erros - Total de partidas com erro
 * @property {string} ultimoAcesso - Data e hora do último acesso em formato ISO
 */
export type Usuario = {
  nome: string;
  acertos: number;
  erros: number;
  ultimoAcesso: string;
};
