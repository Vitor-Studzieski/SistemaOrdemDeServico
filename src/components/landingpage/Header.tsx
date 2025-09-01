// src/components/landingpage/Header.tsx
import { Button } from '@/components/ui/button';
import { Mail, Phone, Search, Instagram } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import Auth from '@/pages/Auth'; // Ajuste o caminho se necessário

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-secondary shadow-md">
      {/* Barra Laranja Superior */}
      <div className="bg-primary px-4 sm:px-8 text-white">
        <div className="container mx-auto flex h-10 items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Phone size={16} />
              <span>(14) 99925-4724</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Mail size={16} />
              <span>contato@higye.com.br</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Search size={18} className="cursor-pointer" />
            <Instagram size={18} className="cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Barra de Navegação Principal */}
      <nav className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center">
          {/* Substitua por seu logo */}
          <img src="https://higye.com.br/wp-content/uploads/2020/11/logo-higye-consultoria-alimentos.png" alt="Logo" className="h-12" />
        </div>
        <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <a href="#" className="hover:text-primary">Home</a>
          <a href="#" className="hover:text-primary">Sobre Mim</a>
          <a href="#" className="hover:text-primary">Serviços</a>
          <a href="#" className="hover:text-primary">Na Mídia</a>
          <a href="#" className="hover:text-primary">Contato</a>
        </div>
        
        {/* Botão para Entrar no Sistema */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>Entrar no Sistema</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            {/* Seu formulário de autenticação vem aqui */}
            <Auth />
          </DialogContent>
        </Dialog>
      </nav>
    </header>
  );
}