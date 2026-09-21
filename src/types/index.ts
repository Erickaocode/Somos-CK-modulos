export interface Ato {
  id: string;
  titulo: string;
}

export interface CategoriaDesejo {
  id: string;
  titulo: string;
}

export interface Modulo {
  id: string;
  atoId: string;
  titulo: string;
  descricao: string;
  pergunta: string;
  /** Presente apenas no módulo "Lista de Desejos" — troca a caixa de texto padrão por um formulário com essas categorias. */
  categoriasDesejos?: CategoriaDesejo[];
}

export interface RespostaCategoriaDesejo {
  sonhos: string;
  prazo: string;
}

export interface RespostaDesejos {
  tipoParticipante: string;
  modalidade: string;
  categorias: Record<string, RespostaCategoriaDesejo>;
}

export interface Resposta {
  nome: string;
  cpf: string;
  moduloId: string;
  resposta: string;
  data: string;
}

export interface Sessao {
  nome: string;
  cpf: string;
}

export interface Jovem {
  nome: string;
  cpf: string;
  respostas: Resposta[];
}
