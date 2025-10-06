import { Button } from '@/components/ui/button';
import { Mail, Phone, Search, Instagram } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import Auth from '@/pages/Auth';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
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
          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost" className="hover:bg-white/20 rounded-md cursor-not-allowed">
              <Search size={18} />
            </Button>
            <a href="https://www.instagram.com/higye_rt_consultoria/" target="_blank" rel="noopener noreferrer">
              <Button size="icon" variant="ghost" className="hover:bg-white/20 rounded-md">
                <Instagram size={18} />
              </Button>
            </a>
          </div>
        </div>
      </div>

      <nav className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-8">
        <Link to="/">
          <img src="/Higye_600px.png" alt="Logo Higye" className="h-14" />
        </Link>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
            <a href="#" className="hover:text-primary transition-colors">Home</a>
            <a href="#" className="hover:text-primary transition-colors">Sobre Mim</a>
            <a href="#" className="hover:text-primary transition-colors">Serviços</a>
            <a href="#" className="hover:text-primary transition-colors">Na Mídia</a>
            <a href="#" className="hover:text-primary transition-colors">Contato</a>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary-dark transition-transform duration-200 hover:scale-105">
                Acessar OSActive
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <Auth />
            </DialogContent>
          </Dialog>
        </div>
      </nav>
    </header>
  );
}