
import { Nivel } from "../types/jogo";

/**
 * Definição dos níveis disponíveis no jogo
 * Estrutura inicial com progressão de dificuldade
 * O primeiro nível começa desbloqueado, os demais precisam ser conquistados
 */
export const niveis: Nivel[] = [
  {
    id: 1,
    titulo: "Trenzinho Pequeno",
    minimo: 0,
    maximo: 5,
    desbloqueado: true,    // Único nível inicialmente desbloqueado
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

/**
 * Configurações padrão do jogo
 * Define parâmetros como quantidade de números, tempo limite e dicas
 */
export const configPadrao = {
  quantidadeNumeros: 3,  // Começamos com 3 números para facilitar o aprendizado
  tempoLimite: 0,        // Sem limite de tempo para não pressionar as crianças
  mostrarDicas: true     // Habilita dicas para ajudar no aprendizado
};
