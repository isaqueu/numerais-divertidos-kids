
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Nivel } from '@/types/jogo';
import { embaralharArray } from '@/utils/jogoUtils';

type JogoContextType = {
  numerosDisponiveis: number[];
  setNumerosDisponiveis: (numeros: number[]) => void;
  numerosPosicionados: (number | null)[];
  setNumerosPosicionados: (numeros: (number | null)[]) => void;
  numerosOrdenados: number[];
  setNumerosOrdenados: (numeros: number[]) => void;
  respostasCorretas: boolean[];
  setRespostasCorretas: (respostas: boolean[]) => void;
  jogoCompleto: boolean;
  setJogoCompleto: (completo: boolean) => void;
  jogoCorreto: boolean;
  setJogoCorreto: (correto: boolean) => void;
  tentativas: number;
  setTentativas: (tentativas: number) => void;
  tempoInicial: number;
  setTempoInicial: (tempo: number) => void;
  iniciarJogo: (nivel: Nivel, quantidadeNumeros: number) => void;
};

const JogoContext = createContext<JogoContextType | null>(null);

export function JogoProvider({ children }: { children: ReactNode }) {
  const [numerosDisponiveis, setNumerosDisponiveis] = useState<number[]>([]);
  const [numerosPosicionados, setNumerosPosicionados] = useState<(number | null)[]>([]);
  const [numerosOrdenados, setNumerosOrdenados] = useState<number[]>([]);
  const [respostasCorretas, setRespostasCorretas] = useState<boolean[]>([]);
  const [jogoCompleto, setJogoCompleto] = useState(false);
  const [jogoCorreto, setJogoCorreto] = useState(false);
  const [tentativas, setTentativas] = useState(0);
  const [tempoInicial, setTempoInicial] = useState(Date.now());

  const iniciarJogo = (nivel: Nivel, quantidadeNumeros: number) => {
    const intervaloPossivel = Array.from(
      { length: (nivel.maximo - nivel.minimo) + 1 }, 
      (_, i) => nivel.minimo + i
    );

    const numerosAleatorios = embaralharArray(intervaloPossivel).slice(0, quantidadeNumeros);
    const ordenados = [...numerosAleatorios].sort((a, b) => a - b);

    setNumerosOrdenados(ordenados);
    setNumerosDisponiveis(embaralharArray(numerosAleatorios));
    setNumerosPosicionados(Array(quantidadeNumeros).fill(null));
    setRespostasCorretas(Array(quantidadeNumeros).fill(false));
    setJogoCompleto(false);
    setJogoCorreto(false);
    setTentativas(0);
    setTempoInicial(Date.now());
  };

  return (
    <JogoContext.Provider value={{
      numerosDisponiveis,
      setNumerosDisponiveis,
      numerosPosicionados,
      setNumerosPosicionados,
      numerosOrdenados,
      setNumerosOrdenados,
      respostasCorretas,
      setRespostasCorretas,
      jogoCompleto,
      setJogoCompleto,
      jogoCorreto,
      setJogoCorreto,
      tentativas,
      setTentativas,
      tempoInicial,
      setTempoInicial,
      iniciarJogo
    }}>
      {children}
    </JogoContext.Provider>
  );
}

export const useJogo = () => {
  const context = useContext(JogoContext);
  if (!context) {
    throw new Error('useJogo deve ser usado dentro de um JogoProvider');
  }
  return context;
};
