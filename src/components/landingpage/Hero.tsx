// src/components/landingpage/Hero.tsx

export function Hero() {
  return (
    <section 
      className="relative flex h-[70vh] min-h-[500px] items-center justify-end bg-cover bg-center"
      style={{ backgroundImage: "url('/banner-cientista.jpg')" }}
    >
      {/* Filtro escuro para garantir a legibilidade do texto */}
      <div className="absolute inset-0 bg-black opacity-40" />
      
      {/* Div do texto agora posicionado no meio (vertical) e à direita (horizontal) */}
      <div className="relative z-10 text-right container mx-auto p-8 md:p-12 text-text-blue-700">
        <h1 className="text-5xl md:text-6xl font-bold drop-shadow-lg leading-tight">
          Controle de Qualidade e Segurança dos Alimentos
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl ml-auto drop-shadow-md text-text-blue-700">
          Consultoria especializada para garantir a conformidade e a excelência dos seus produtos.
        </p>
      </div>
    </section>
  );
}