import type { Modulo } from '../types';

export const MODULOS: Modulo[] = [
  {
    id: 'boas-vindas',
    titulo: 'Boas-vindas ao Programa',
    descricao: 'Conheça os objetivos do programa de aprendizagem e o que esperar dos próximos meses.',
    pergunta: 'O que você mais espera aprender durante o programa?',
  },
  {
    id: 'postura-profissional',
    titulo: 'Ética e Postura Profissional',
    descricao: 'Boas práticas de conduta, pontualidade e relacionamento no ambiente de trabalho.',
    pergunta:
      'Descreva uma situação em que você precisou agir com responsabilidade em um trabalho, escola ou grupo.',
  },
  {
    id: 'comunicacao',
    titulo: 'Comunicação Assertiva',
    descricao: 'Como se comunicar com clareza e respeito com colegas, líderes e clientes.',
    pergunta: 'Cite um exemplo de como você se comunicaria para pedir ajuda em uma tarefa que não entendeu.',
  },
  {
    id: 'plano-carreira',
    titulo: 'Meu Plano de Carreira',
    descricao: 'Primeiros passos para pensar sua trajetória profissional a partir do estágio ou aprendizagem.',
    pergunta: 'Onde você se imagina profissionalmente daqui a 2 anos?',
  },
];
