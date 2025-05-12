
import { Nivel } from "../types/jogo";

// Configuração dos níveis do jogo
export const niveis: Nivel[] = [
  {
    id: 1,
    titulo: "Trenzinho Pequeno",
    minimo: 0,
    maximo: 5,
    desbloqueado: true,
    concluido: false
  },
  {
    id: 2,
    titulo: "Trenzinho Médio",
    minimo: 0,
    maximo: 10,
    desbloqueado: false,
    concluido: false
  },
  {
    id: 3,
    titulo: "Trenzinho Grande",
    minimo: 0,
    maximo: 20,
    desbloqueado: false,
    concluido: false
  },
  {
    id: 4,
    titulo: "Trenzinho Rápido",
    minimo: 0,
    maximo: 30,
    desbloqueado: false,
    concluido: false
  },
  {
    id: 5,
    titulo: "Super Trenzinho",
    minimo: 0,
    maximo: 50,
    desbloqueado: false,
    concluido: false
  }
];

// Configuração padrão do jogo
export const configPadrao = {
  quantidadeNumeros: 3, // Começamos com 3 números para não dificultar
  tempoLimite: 0, // Sem limite de tempo inicialmente
  mostrarDicas: true // Mostrar dicas no começo
};
