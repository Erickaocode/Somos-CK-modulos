import type { Ato, Modulo } from '../types';
import { CATEGORIAS_DESEJOS } from './categoriasDesejos';
import { AREAS_RODA_VIDA, DIMENSOES_RODA_VIDA } from './rodaDaVida';

export const ATOS: Ato[] = [
  { id: 'ato-1', titulo: 'Ato 1 — Seu Mapa' },
  { id: 'ato-2', titulo: 'Ato 2 — Seu Mapa' },
  { id: 'ato-3', titulo: 'Ato 3 — Seu Mapa' },
];

export const MODULOS: Modulo[] = [
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
    id: 'alavancagem-roda-vida',
    atoId: 'ato-1',
    titulo: 'Alavancagem da Roda da Vida - Eu no Futuro',
    descricao: 'Reflexão sobre a Roda da Vida completa e escolha de um foco estratégico de desenvolvimento.',
    pergunta: 'Agora que você já avaliou as 12 áreas, vamos refletir sobre o que aprendeu e definir um foco.',
    tipo: 'formulario',
    incluirModalidade: true,
    campos: [
      { id: 'aprendizados', label: 'Aprendizados da Roda completa', tipo: 'texto' },
      { id: 'nota-surpreendeu', label: 'Nota que te surpreendeu', tipo: 'texto' },
      {
        id: 'area-foco',
        label: 'Qual área você escolheu para focar',
        tipo: 'select',
        opcoes: AREAS_RODA_VIDA.map((area) => area.titulo),
      },
      { id: 'comentario-escolha', label: 'Comentário sobre a escolha', tipo: 'texto' },
      { id: 'primeiro-passo', label: 'Primeiro passo concreto', tipo: 'texto' },
    ],
  },
  {
    id: 'smart',
    atoId: 'ato-1',
    titulo: 'SMART - Eu no Futuro',
    descricao:
      'Transforme um sonho em uma meta prática usando a metodologia SMART: específica, mensurável, atingível, relevante e temporal.',
    pergunta: 'Escolha um sonho e vamos transformá-lo em uma meta SMART, passo a passo.',
    tipo: 'formulario',
    incluirModalidade: true,
    campos: [
      { id: 'sonho', label: 'Seu sonho', tipo: 'texto' },
      { id: 'meta', label: 'Sua meta (específica)', tipo: 'texto' },
      { id: 'como-medir', label: 'Como medir (mensurável)', tipo: 'texto' },
      { id: 'recursos-forcas', label: 'Recursos e forças (atingível)', tipo: 'texto' },
      { id: 'por-que-importa', label: 'Por que importa (relevante)', tipo: 'texto' },
      { id: 'cronograma', label: 'Seu cronograma (temporal)', tipo: 'texto' },
      { id: 'minha-meta', label: 'Minha meta (síntese)', tipo: 'texto' },
    ],
  },
];
