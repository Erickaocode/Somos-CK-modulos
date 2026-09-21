export interface Ato {
  id: string;
  titulo: string;
}

export interface Modulo {
  id: string;
  atoId: string;
  titulo: string;
  descricao: string;
  pergunta: string;
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
