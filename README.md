<div align='center'>
  <img width="400px" src='https://user-images.githubusercontent.com/76819323/212495969-fbb42e05-21d4-430c-8b0d-c78ee3cf7ed0.png' />
</div>

<div align="center">
  <image src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" />
  <image src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
</div>

## 👨‍💻 Projeto

Este projeto é uma API (Application Programming Interface) desenvolvida para a NEABI do Instituto Federal de Educação, Ciência e Tecnologia da Bahia (IFBA) - Campus Brumado. Ele tem como objetivo fornecer uma plataforma de armazenamento centralizado e acessível para objetos educacionais relacionados ao conteúdo do núcleo, permitindo que professores possam criar aulas de maneira eficiente e personalizada. Além disso, a API oferece recursos de gerenciamento de objetos educacionais, como pesquisa, adição, edição e exclusão, além de organizá-los de acordo com categorias específicas e tags. Ela também oferece recursos de busca avançada e filtragem para ajudar os professores a encontrar rapidamente os objetos educacionais relevantes.

A API foi desenvolvida utilizando as tecnologias Node.js, Typescript, Docker, PostgreSQL, Prisma e Google OAuth 2.0, garantindo robustez e escalabilidade ao projeto, além de uma autenticação segura e autorização de acesso aos recursos. Isso assegura que somente usuários autorizados tenham acesso à plataforma e seus recursos, garantindo a privacidade e segurança dos dados armazenados. Com essa API, é possível fornecer uma experiência de usuário mais eficiente e personalizada para os professores, ajudando-os a criar aulas mais enriquecedoras e eficazes para os alunos.

## 🔒 Requisitos

- Node 18.x
- Docker
- Docker Compose

## 🤔 Como usar?
   
   1. Clone esse repositório:
   ```
   $ git clone https://github.com/VictorKayk/neabi-backend.git
   ```
   
   2. Entre no diretório:
   ```
   $ cd neabi-backend
   ```
   
   3. Instale as dependências:
   ```
   $ npm install
   ```

   4. **Troque o nome do arquivo "env" para ".env" e preencha todas as informações necessarias.**
   
   5. Inicie a api em mode desenvolvedor
   ```
   $ npm run dev
   ```

   5. Ou faça o build da api e inicie o servidor:
   ```
   $ npm run start
   ```

   5. Ou monte uma imagem docker da api e rode apartir dela:
   ```
   $ npm run docker:up
   ```
## 📕 Documentação

Para acessar a documentação de todas as rotas da api, acesse <a href='http://localhost:5000/docs'>http://localhost:5000/docs</a> com a aplicação rodando.

## 💁 Contribuição

Se você tiver uma sugestão que possa melhorar isso, por favor, crie uma cópia do repositório (fork) e crie uma solicitação de pull. Você também pode simplesmente abrir uma questão com a tag "enhancement" (melhoria). Não se esqueça de dar uma estrela para o projeto! Novamente, muito obrigado!

1. Faça uma cópia do projeto (fork)
2. Crie seu ramo de recurso (git checkout -b feature/AmazingFeature)
3. Faça commit das suas alterações (git commit -m 'Add some AmazingFeature')
4. Envie para o ramo (git push origin feature/AmazingFeature)
5. Abra uma solicitação de pull.

---
