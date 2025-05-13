
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Inicializa a aplicação React no elemento root do HTML
// O createRoot é o método moderno de renderização do React 18+
createRoot(document.getElementById("root")!).render(<App />);
