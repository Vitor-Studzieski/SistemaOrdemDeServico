// src/components/landingpage/Services.tsx

import { BookOpen, Cog, ShieldCheck } from 'lucide-react'; // Ícones de exemplo

export function Services() {
  return (
    <section className="bg-primary py-16 text-white text-center">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Assuntos Regulatórios */}
          <div className="flex flex-col items-center">
            <BookOpen size={64} className="mb-4 text-white" />
            <h3 className="text-2xl font-semibold mb-2">Assuntos Regulatórios</h3>
          </div>

          {/* Treinamentos */}
          <div className="flex flex-col items-center">
            <Cog size={64} className="mb-4 text-white" /> {/* Use um ícone adequado para treinamentos */}
            <h3 className="text-2xl font-semibold mb-2">Treinamentos</h3>
          </div>

          {/* Normas de Segurança */}
          <div className="flex flex-col items-center">
            <ShieldCheck size={64} className="mb-4 text-white" />
            <h3 className="text-2xl font-semibold mb-2">Normas de Segurança</h3>
          </div>
        </div>
      </div>
    </section>
  );
}