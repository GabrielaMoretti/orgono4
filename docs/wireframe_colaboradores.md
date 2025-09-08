# Wireframe textual: Colaboradores

---

## 1. Formulário de Cadastro/Editar Colaborador

### [Bloco] Informações Básicas
- **Nome**: [input texto] — placeholder: "Digite o nome completo do colaborador"
- **Cargo**: [input texto] — placeholder: "Ex: Analista de RH, Desenvolvedor..."
- **Foto/Avatar**: [upload ou avatar gerado]

### [Bloco] Relações
- **Superior**: [autocomplete/select] — busca por nome
- **Subordinados**: [autocomplete/select múltiplo] — busca por nome
- **Projetos**: [autocomplete/select múltiplo] — busca por nome

---

### [Botão] Adicionar/Salvar
- Sempre visível, fixo no rodapé do formulário
- Atalho: Enter para salvar

### [Validação]
- Campos obrigatórios destacados em vermelho se vazios
- Mensagem clara: "O nome é obrigatório"

### [Feedback]
- Toast de sucesso: "Colaborador adicionado com sucesso"
- Toast de erro: "Preencha todos os campos obrigatórios"

---

## 2. Visualização de Colaboradores

### [Topo]
- [Busca] por nome/cargo/projeto
- [Botão] Importar CSV/Excel
- [Alternância] Galeria | Lista (botão ativo com destaque visual)

### [Galeria]
- Cards grandes
  - Avatar/foto
  - Nome (destaque)
  - Cargo
  - Projetos principais (ícone 📁 + nome)
  - Ícone 👤 para superior
  - Botões rápidos: Editar | Excluir | Ver perfil

### [Lista]
- Linhas compactas
  - Avatar/foto
  - Nome
  - Cargo
  - Projetos principais
  - Botões rápidos: Editar | Excluir | Ver perfil

### [Pré-visualização]
- Se não houver colaboradores, mostrar card de exemplo (cinza, com texto explicativo)

---

## 3. Pop-up Overlay de Perfil
- Abre ao clicar em "Ver perfil" (ou no card)
- Mostra todos os dados do colaborador
- Permite editar e salvar direto no pop-up
- Botão "Fechar" (Esc para fechar)

---

## 4. Fluxo e Interação
- Feedback visual imediato após ações
- Busca/filtro sempre disponível
- Importação em lote visível
- Atalhos de teclado: Enter (salvar), Esc (cancelar/fechar pop-up)

---

## 5. Observações
- Todos os botões com ícones de apoio
- Layout responsivo
- Cards e listas com hover e foco visuais

---

Esse wireframe pode ser usado como base para reorganizar e aprimorar a tela de colaboradores.
