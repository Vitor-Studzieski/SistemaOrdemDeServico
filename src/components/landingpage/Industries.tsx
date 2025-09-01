// src/components/landingpage/Industries.tsx

import { CheckCircle } from 'lucide-react';

export function Industries() {
  const industryList = [
    "Agroindústrias",
    "Amendoim e derivados",
    "Farinha de Mandioca",
    "Laticínios",
    "Mel",
    "Dentre outros"
  ];

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16">
        {/* Imagem */}
        <div className="md:w-1/3 flex justify-center">
          <img 
            src="/mulher-cientista.jpg" // CAMINHO DA IMAGEM: Garanta que este caminho está correto para onde você salvou a imagem
            alt="Mulher cientista em laboratório" 
            className="rounded-full shadow-lg w-80 h-80 object-cover" 
          />
        </div>

        {/* Lista de Indústrias */}
        <div className="md:w-1/2">
          <ul className="space-y-4 text-xl text-gray-800">
            {industryList.map((industry, index) => (
              <li key={index} className="flex items-center gap-3">
                <span className="text-primary font-bold text-2xl">•</span>
                <span className="font-semibold">{industry}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}