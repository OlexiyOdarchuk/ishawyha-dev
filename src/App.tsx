import { LanguageProvider } from './hooks/useLanguage';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Bento } from './components/Bento';
import { PitonDemo } from './components/PitonDemo';
import './styles/globals.css';

function App() {
  return (
    <LanguageProvider>
      <div className="app">
        <Header />
        <main>
          <Hero />
          <Bento />
          <PitonDemo />
        </main>
        <footer style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)', borderTop: '1px solid var(--card-border)' }}>
          <p>© 2026 Oleksiy Odarchuk. Built with React & Framer Motion.</p>
        </footer>
      </div>
    </LanguageProvider>
  );
}

export default App;
