# Sistema de Gerenciamento de Ordens de Serviço

Este é um sistema para gerenciar ordens de serviço, permitindo o cadastro e acompanhamento de serviços, clientes e status. O projeto foi desenvolvido com uma arquitetura moderna, utilizando Supabase para o banco de dados e Vercel para o deploy contínuo.

## Tecnologias Utilizadas

* **Node.js**: Ambiente de execução JavaScript no servidor.
* **Supabase**: Backend-as-a-Service (BaaS) que oferece um banco de dados PostgreSQL, autenticação e APIs em tempo real.
* **Vercel**: Plataforma de hosting para deploy contínuo.
* **Git & GitHub**: Controle de versão e hospedagem do repositório.

## Instalação e Configuração

Siga os passos abaixo para ter uma cópia do projeto em execução na sua máquina local para desenvolvimento e testes.

### Pré-requisitos

Certifique-se de ter o [Node.js](https://nodejs.org/en/) e o [Git](https://git-scm.com/) instalados em sua máquina.

### Passos

1.  **Clone o Repositório:**
    Abra seu terminal e execute o comando para clonar o projeto:

    ```bash
    git clone [https://github.com/Vitor-Studzieski/SistemaOrdemDeServico.git](https://github.com/Vitor-Studzieski/SistemaOrdemDeServico.git)
    ```

2.  **Navegue até o Diretório:**
    Entre na pasta do projeto que acabou de ser clonada:

    ```bash
    cd SistemaOrdemDeServico
    ```

3.  **Instale as Dependências:**
    Instale todos os pacotes e bibliotecas necessárias para o projeto:

    ```bash
    npm i
    ```

4.  **Configuração do Supabase:**
    Crie um arquivo `.env` na raiz do projeto e configure as variáveis de ambiente necessárias para a conexão com o Supabase:

    ```env
    # Exemplo:
    SUPABASE_URL=sua_url_do_supabase
    SUPABASE_KEY=sua_chave_de_anon_do_supabase
    ```

5.  **Inicie o Servidor de Desenvolvimento:**
    Inicie o servidor local para começar a trabalhar no projeto. Ele estará disponível em `http://localhost:8080/`.

    ```bash
    npm run dev
    ```

## Como Usar

O projeto pode ser acessado através da interface web, permitindo a criação, visualização e atualização de ordens de serviço.

## Deploy

Este projeto está configurado com [Vercel](https://vercel.com/) para deploy contínuo. Qualquer novo commit na branch `main` será automaticamente deployado.

---
