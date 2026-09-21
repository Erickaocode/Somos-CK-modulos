import type { AreaRodaVida, DimensaoRodaVida } from '../types';

export const DIMENSOES_RODA_VIDA: DimensaoRodaVida[] = [
  { id: 'pessoal', titulo: 'Pessoal' },
  { id: 'profissional', titulo: 'Profissional' },
  { id: 'relacionamentos', titulo: 'Relacionamentos' },
  { id: 'qualidade-vida', titulo: 'Qualidade de Vida' },
];

export const AREAS_RODA_VIDA: AreaRodaVida[] = [
  {
    id: 'esporte-saude',
    dimensaoId: 'pessoal',
    titulo: 'Esporte e Saúde',
    reflexao: 'O que você faz hoje para cuidar do seu corpo e da sua saúde?',
  },
  {
    id: 'escola',
    dimensaoId: 'pessoal',
    titulo: 'Escola (Intelectual)',
    reflexao: 'Como está sua relação com os estudos e o aprendizado?',
  },
  {
    id: 'emocoes',
    dimensaoId: 'pessoal',
    titulo: 'Emoções e Felicidade',
    reflexao: 'Como você tem lidado com seus sentimentos no dia a dia?',
  },
  {
    id: 'carreira',
    dimensaoId: 'profissional',
    titulo: 'Carreira',
    reflexao: 'O que você sente em relação ao seu momento profissional atual?',
  },
  {
    id: 'financeiro',
    dimensaoId: 'profissional',
    titulo: 'Financeiro',
    reflexao: 'Como está sua relação com dinheiro e planejamento financeiro?',
  },
  {
    id: 'contribuicao-social',
    dimensaoId: 'profissional',
    titulo: 'Contribuição Social',
    reflexao: 'De que forma você sente que contribui para a sociedade?',
  },
  {
    id: 'amor',
    dimensaoId: 'relacionamentos',
    titulo: 'Amor',
    reflexao: 'Como estão seus relacionamentos afetivos?',
  },
  {
    id: 'pai-mae',
    dimensaoId: 'relacionamentos',
    titulo: 'Pai e Mãe',
    reflexao: 'Como está sua relação com seus pais ou responsáveis?',
  },
  {
    id: 'amigos',
    dimensaoId: 'relacionamentos',
    titulo: 'Amigos',
    reflexao: 'Como estão suas amizades hoje?',
  },
  {
    id: 'diversao-lazer',
    dimensaoId: 'qualidade-vida',
    titulo: 'Diversão e Lazer',
    reflexao: 'Você tem reservado tempo para se divertir e descansar?',
  },
  {
    id: 'contribuicao-casa',
    dimensaoId: 'qualidade-vida',
    titulo: 'Contribuição em Casa',
    reflexao: 'Como você participa das tarefas e responsabilidades em casa?',
  },
  {
    id: 'espiritualidade',
    dimensaoId: 'qualidade-vida',
    titulo: 'Espiritualidade',
    reflexao: 'O que traz sentido e propósito para sua vida?',
  },
];
