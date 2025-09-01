export function Hero() {
  return (
    <section 
      className="relative flex h-[60vh] min-h-[400px] items-center justify-center bg-cover bg-center text-white"
      style={{ backgroundImage: "url('https://higye.com.br/wp-content/uploads/2020/11/banner-higye-consultoria-em-alimentos.jpg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-30" />
      <div className="relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
          Controle de Qualidade e Segurança dos Alimentos
        </h1>
      </div>
    </section>
  );
}