import type { Ato, Modulo } from '../types';
import { CATEGORIAS_DESEJOS } from './categoriasDesejos';
import { AREAS_RODA_VIDA, DIMENSOES_RODA_VIDA } from './rodaDaVida';

export const ATOS: Ato[] = [
  { id: 'ato-1', titulo: 'Ato 1 — Primeiros Passos' },
  { id: 'ato-2', titulo: 'Ato 2 — Postura no Trabalho' },
  { id: 'ato-3', titulo: 'Ato 3 — Meu Futuro' },
];

export const MODULOS: Modulo[] = [
  {
    id: 'boas-vindas',
    atoId: 'ato-1',
    titulo: 'Boas-vindas ao Programa',
    descricao: 'Conheça os objetivos do programa de aprendizagem e o que esperar dos próximos meses.',
    pergunta: 'O que você mais espera aprender durante o programa?',
    tipo: 'texto',
  },
  {
    id: 'lista-desejos',
    atoId: 'ato-1',
    titulo: 'Lista de Desejos - Eu no Futuro',
    descricao: 'Um convite para sonhar sem limitações, em 8 áreas da vida, com prazos estimados para cada sonho.',
    pergunta: 'E se tudo fosse possível? Não existem respostas certas ou erradas.',
    tipo: 'lista-desejos',
    categoriasDesejos: CATEGORIAS_DESEJOS,
  },
  {
    id: 'roda-da-vida',
    atoId: 'ato-1',
    titulo: 'Roda da Vida - Eu no Futuro',
    descricao:
      'Autoavaliação em 12 áreas da vida, agrupadas em 4 dimensões, com nota de satisfação de 0 a 10 e uma reflexão para cada área.',
    pergunta: 'Dê uma nota de 0 a 10 para o quanto você está satisfeito com cada área da sua vida hoje.',
    tipo: 'roda-vida',
    dimensoesRodaVida: DIMENSOES_RODA_VIDA,
    areasRodaVida: AREAS_RODA_VIDA,
  },
  {
    id: 'postura-profissional',
    atoId: 'ato-2',
    titulo: 'Ética e Postura Profissional',
    descricao: 'Boas práticas de conduta, pontualidade e relacionamento no ambiente de trabalho.',
    pergunta:
      'Descreva uma situação em que você precisou agir com responsabilidade em um trabalho, escola ou grupo.',
    tipo: 'texto',
  },
  {
    id: 'comunicacao',
    atoId: 'ato-2',
    titulo: 'Comunicação Assertiva',
    descricao: 'Como se comunicar com clareza e respeito com colegas, líderes e clientes.',
    pergunta: 'Cite um exemplo de como você se comunicaria para pedir ajuda em uma tarefa que não entendeu.',
    tipo: 'texto',
  },
  {
    id: 'plano-carreira',
    atoId: 'ato-3',
    titulo: 'Meu Plano de Carreira',
    descricao: 'Primeiros passos para pensar sua trajetória profissional a partir do estágio ou aprendizagem.',
    pergunta: 'Onde você se imagina profissionalmente daqui a 2 anos?',
    tipo: 'texto',
  },
];
