// src/components/landingpage/Footer.tsx

import { Mail, Phone, MapPin, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      {/* Seção "Siga-nos no Instagram" - Imagem 5 */}
      <div className="bg-red-800 text-white py-16 text-center"> {/* Use 'bg-destructive' se for uma cor customizada */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Siga-nos no Instagram</h2>
        {/* A mensagem de erro da API real não será implementada aqui, mas sim no backend */}
        <p className="text-sm text-gray-200">
          Acompanhe nossas novidades e dicas no Instagram.
        </p>
      </div>

      {/* Seção de Contato e Horário - Imagem 5 */}
      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo */}
          <div className="flex flex-col items-center md:items-start mb-8 md:mb-0">
            <img src="/Higye_600px.png" alt="Logo Higye" className="h-20 mb-4" />
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-xl font-semibold mb-4">CONTATO</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <MapPin size={20} className="flex-shrink-0 mt-1" />
                <span>Av. Celeste Casagrande, 515</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={20} />
                <span>(14) 99925-4724</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={20} />
                <span>contato@higye.com.br</span>
              </li>
            </ul>
          </div>

          {/* Horário */}
          <div>
            <h3 className="text-xl font-semibold mb-4">ABERTO</h3>
            <ul className="space-y-2">
              <li>SEGUNDA A SEXTA</li>
              <li>11:00 - 15:00 </li>
              <li>16:30 - 22:00 </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright e Powered By - Imagem 5 */}
      <div className="bg-red-900 text-white text-center py-6 text-sm"> {/* Use 'bg-destructive-dark' ou similar */}
        <p className="mb-2">
          Todos os direitos reservados - {currentYear} HIGYE CONSULTORIA DE ALIMENTO E TURISMO CNPJ: 35.603.779/0001-14
        </p>
        <p></p>
      </div>
    </footer>
  );
}