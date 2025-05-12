
import React from 'react';

type EfeitoComoracaoProps = {
  comemorando: boolean;
};

const EfeitoComemorar: React.FC<EfeitoComoracaoProps> = ({ comemorando }) => {
  if (!comemorando) return null;
  
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
      {Array(20).fill(0).map((_, i) => (
        <div 
          key={i}
          className="absolute animate-comemorar text-3xl"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${1 + Math.random() * 2}s`
          }}
        >
          {['🎉', '⭐', '🎊', '🏆', '✨'][Math.floor(Math.random() * 5)]}
        </div>
      ))}
    </div>
  );
};

export default EfeitoComemorar;
