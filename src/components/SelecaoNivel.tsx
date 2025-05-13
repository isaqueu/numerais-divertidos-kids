
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Medal, Star, Gift } from "lucide-react";
import { Nivel } from '@/types/jogo';
import { toast } from 'sonner';

/**
 * Props para o componente SelecaoNivel
 * @property {Nivel[]} niveis - Lista de níveis do jogo disponíveis
 * @property {Function} aoSelecionarNivel - Callback para quando um nível é selecionado
 */
type SelecaoNivelProps = {
  niveis: Nivel[];
  aoSelecionarNivel: (nivel: Nivel) => void;
};

/**
 * Componente que exibe todos os níveis disponíveis para seleção
 * Controla quais níveis estão desbloqueados e permite sua seleção
 */
const SelecaoNivel: React.FC<SelecaoNivelProps> = ({ niveis, aoSelecionarNivel }) => {
  
  /**
   * Manipula o clique em um cartão de nível
   * Verifica se o nível está desbloqueado antes de selecioná-lo
   * 
   * @param {Nivel} nivel - O nível que foi clicado
   */
  const handleClick = (nivel: Nivel) => {
    if (nivel.desbloqueado) {
      aoSelecionarNivel(nivel);
    } else {
      // Aviso amigável de que o nível está bloqueado
      toast("Nível bloqueado", {
        description: "Complete os níveis anteriores para desbloquear este!",
        icon: "🔒",
      });
    }
  };

  /**
   * Retorna o ícone apropriado para o nível baseado no seu estado
   * 
   * @param {Nivel} nivel - O nível para determinar o ícone
   * @returns {JSX.Element} - O componente de ícone apropriado
   */
  const getIconeNivel = (nivel: Nivel) => {
    if (nivel.concluido) return <Medal className="text-yellow-500" />;
    if (nivel.desbloqueado) return <Star className="text-infantil-amarelo" />;
    return <Gift className="text-gray-400" />;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl md:text-4xl font-bold text-center">Escolha um Nível</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {niveis.map((nivel) => (
          <Card 
            key={nivel.id} 
            className={cn(
              "cursor-pointer transition-all hover:shadow-lg",
              nivel.desbloqueado ? "opacity-100" : "opacity-70"
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl">
                {nivel.titulo}
              </CardTitle>
              {getIconeNivel(nivel)}
            </CardHeader>
            
            <CardContent>
              <CardDescription className="text-lg mb-4">
                Números de {nivel.minimo} a {nivel.maximo}
              </CardDescription>
              
              <Button 
                className={cn(
                  "w-full",
                  nivel.concluido ? "bg-infantil-verde hover:bg-green-600" : 
                  nivel.desbloqueado ? "bg-infantil-azul hover:bg-blue-600" : 
                  "bg-gray-400"
                )}
                onClick={() => handleClick(nivel)}
              >
                {nivel.concluido ? "Jogar Novamente" : 
                 nivel.desbloqueado ? "Jogar" : "Bloqueado"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SelecaoNivel;

/**
 * Função auxiliar para concatenar classes condicionalmente
 * Combina strings, removendo valores falsy (undefined, false, null, etc)
 * 
 * @param {(string | boolean | undefined)[]} classes - Lista de classes a concatenar
 * @returns {string} - String com as classes válidas concatenadas
 */
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
