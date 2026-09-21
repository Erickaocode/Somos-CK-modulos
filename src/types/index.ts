export interface Ato {
  id: string;
  titulo: string;
}

export interface CategoriaDesejo {
  id: string;
  titulo: string;
}

export interface DimensaoRodaVida {
  id: string;
  titulo: string;
}

export interface AreaRodaVida {
  id: string;
  dimensaoId: string;
  titulo: string;
  reflexao: string;
}

interface ModuloBase {
  id: string;
  atoId: string;
  titulo: string;
  descricao: string;
  pergunta: string;
}

export interface ModuloTexto extends ModuloBase {
  tipo: 'texto';
}

export interface ModuloListaDesejos extends ModuloBase {
  tipo: 'lista-desejos';
  categoriasDesejos: CategoriaDesejo[];
}

export interface ModuloRodaVida extends ModuloBase {
  tipo: 'roda-vida';
  dimensoesRodaVida: DimensaoRodaVida[];
  areasRodaVida: AreaRodaVida[];
}

export type Modulo = ModuloTexto | ModuloListaDesejos | ModuloRodaVida;

export interface RespostaCategoriaDesejo {
  sonhos: string;
  prazo: string;
}

export interface RespostaDesejos {
  tipoParticipante: string;
  modalidade: string;
  categorias: Record<string, RespostaCategoriaDesejo>;
}

export interface RespostaAreaRodaVida {
  nota: number;
  reflexao: string;
}

export interface RespostaRodaVida {
  modalidade: string;
  areas: Record<string, RespostaAreaRodaVida>;
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
