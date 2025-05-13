
/**
 * Função para embaralhar array (algoritmo de Fisher-Yates)
 * Cria uma cópia do array original e embaralha seus elementos
 * de forma aleatória, garantindo que todos os elementos têm a mesma
 * probabilidade de aparecer em qualquer posição
 * 
 * @template T - Tipo genérico dos elementos do array
 * @param {T[]} array - Array original a ser embaralhado
 * @returns {T[]} - Novo array com os elementos embaralhados
 */
export const embaralharArray = <T,>(array: T[]): T[] => {
  // Cria uma cópia do array para não modificar o original
  const novoArray = [...array];
  
  // Algoritmo Fisher-Yates para embaralhamento
  for (let i = novoArray.length - 1; i > 0; i--) {
    // Gera um índice aleatório entre 0 e i (inclusive)
    const j = Math.floor(Math.random() * (i + 1));
    
    // Troca os elementos nas posições i e j
    [novoArray[i], novoArray[j]] = [novoArray[j], novoArray[i]];
  }
  
  return novoArray;
};
