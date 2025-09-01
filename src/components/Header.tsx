// ... imports
export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      {/* Barra Laranja Superior */}
      <div className="bg-primary px-4 sm:px-8 text-white">
        {/* ... conteúdo da barra superior ... */}
      </div>
      {/* Barra de Navegação Principal */}
      <nav className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <img src="/Higye_600px.png" alt="Logo Higye" className="h-14" />
        </div>
        {/* ... resto da navegação ... */}
      </nav>
    </header>
  );
}