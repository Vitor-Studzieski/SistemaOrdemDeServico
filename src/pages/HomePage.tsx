// src/pages/HomePage.tsx

// Importe todos os componentes da landing page
import { Header } from '@/components/landingpage/Header';
import { Hero } from '@/components/landingpage/Hero';
import { Services } from '@/components/landingpage/Services'; // Agora é Services
import { Industries } from '@/components/landingpage/Industries'; // Novo
import { About } from '@/components/landingpage/About'; // Novo
import { Clients } from '@/components/landingpage/Clients'; // Novo
import { Footer } from '@/components/landingpage/Footer';

export default function HomePage() {
  return (
    // Remova o div className="bg-secondary" aqui, pois as seções terão seus próprios bg
    <div> 
      <Header />
      <main>
        <Hero />
        <About /> {/* Ordem: Header, Hero, About, Services, Industries, Clients, Footer */}
        <Services />
        <Industries />
        <Clients />
      </main>
      <Footer />
    </div>
  );
}