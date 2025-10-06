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
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-16">Setores Atendidos</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16">
          <div className="md:w-1/3 flex justify-center">
            <img 
              src="/mulher-cientista.jpg"
              alt="Mulher cientista em laboratório" 
              className="rounded-full shadow-lg w-80 h-80 object-cover" 
            />
          </div>
          <div className="md:w-1/2 text-left">
            <ul className="space-y-4 text-xl text-gray-800">
              {industryList.map((industry) => (
                <li key={industry} className="flex items-center gap-3">
                  <span className="text-primary font-bold text-2xl">•</span>
                  <span className="font-semibold">{industry}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}