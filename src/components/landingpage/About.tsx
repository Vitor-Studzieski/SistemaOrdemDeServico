// src/components/landingpage/About.tsx

import { HigyeLogoSmall } from './HigyeLogoSmall'; // Vamos criar este componente no PASSO 1.F

export function About() {
  return (
    <section className="py-16 md:py-24 bg-white text-center">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
          HIGYE RT & Consultoria em Controle de Qualidade e Segurança dos Alimentos:
        </h2>
        {/* Usando o componente da logo menor */}
        <HigyeLogoSmall className="mx-auto h-20 mb-8" /> 
        <p className="max-w-3xl mx-auto text-lg text-gray-700 leading-relaxed">
          Especialistas em garantir que os produtos alimentícios atendam não apenas aos
          mais altos padrões de qualidade, mas também às regulamentações estritas
          estabelecidas pela <strong className="text-primary">ANVISA</strong>.
        </p>
        <p className="max-w-3xl mx-auto text-lg text-gray-700 leading-relaxed mt-4">
          Com uma vasta experiência no setor alimentício, nossa equipe oferece consultoria
          especializada para garantir que sua empresa opere dentro das normas legais,
          protegendo a integridade da sua marca e a segurança dos consumidores.
        </p>
      </div>
    </section>
  );
}