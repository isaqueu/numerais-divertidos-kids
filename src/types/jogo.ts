
// Definição de tipos para o jogo

export type Nivel = {
  id: number;
  titulo: string;
  minimo: number;
  maximo: number;
  desbloqueado: boolean;
  concluido: boolean;
};

export type ConfigJogo = {
  quantidadeNumeros: number; // Quantos números serão mostrados por vez
  tempoLimite: number; // Em segundos, 0 significa sem limite
  mostrarDicas: boolean;
};

export type HistoricoPartida = {
  id: string;
  usuario: string;
  nivelId: number;
  tituloNivel: string;
  dataHora: string;
  resultado: 'acerto' | 'erro';
  tentativas: number;
  tempoTotal: number; // em segundos
};

export type Usuario = {
  nome: string;
  acertos: number;
  erros: number;
  ultimoAcesso: string;
};
