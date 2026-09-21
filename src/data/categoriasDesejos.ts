import type { CategoriaDesejo } from '../types';

export const CATEGORIAS_DESEJOS: CategoriaDesejo[] = [
  { id: 'pessoal', titulo: 'Pessoal' },
  { id: 'profissional', titulo: 'Profissional' },
  { id: 'relacionamentos', titulo: 'Relacionamentos' },
  { id: 'saude', titulo: 'Qualidade de Vida e Saúde' },
  { id: 'escola', titulo: 'Escola' },
  { id: 'emocional', titulo: 'Emocional' },
  { id: 'financas', titulo: 'Finanças' },
  { id: 'lazer', titulo: 'Lazer' },
];

export const TIPOS_PARTICIPANTE = ['Estagiário', 'Jovem Aprendiz'] as const;

export const MODALIDADES_CURSO = ['Online', 'Presencial'] as const;

export const PRAZOS_DESEJO = ['1 ano', '5 anos', '10 anos'] as const;
