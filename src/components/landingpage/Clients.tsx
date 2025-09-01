// src/components/landingpage/Clients.tsx

const clientLogos = [
  { name: "Mazifoods", path: "/logos/Mazifoods.png" },
  { name: "MR", path: "/logos/MR.png" },
  { name: "Amar", path: "/logos/Amar.png" },
  { name: "AmendoMais", path: "/logos/AmendoMais.png" },
  { name: "DoceFuturo", path: "/logos/DoceFuturo.png" },
];

export function Clients() {
  return (
    <section className="bg-gray-100 py-16 md:py-24 text-center">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
          Principais Clientes
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 md:gap-x-16">
          {clientLogos.map((logo) => (
            <img 
              key={logo.name} 
              src={logo.path} 
              alt={`Logo da empresa ${logo.name}`} 
              className="h-32 md:h-40 max-w-[320px] object-contain grayscale opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100 hover:scale-110"
            />
          ))}
        </div>
      </div>
    </section>
  );
}