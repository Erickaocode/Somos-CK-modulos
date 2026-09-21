import type { Modulo, Resposta } from '../types';
import { tentarParsearDesejos } from '../lib/desejos';
import { tentarParsearRodaVida } from '../lib/rodaVida';
import { tentarParsearFormulario } from '../lib/formularioGenerico';
import ListaDesejosResumo from './ListaDesejosResumo';
import RodaVidaResumo from './RodaVidaResumo';
import FormularioGenericoResumo from './FormularioGenericoResumo';

interface RespostaResumoProps {
  modulo: Modulo;
  resposta: Resposta;
}

/** Resumo completo e formatado de uma resposta, de acordo com o tipo do módulo. */
export default function RespostaResumo({ modulo, resposta }: RespostaResumoProps) {
  if (modulo.tipo === 'lista-desejos') {
    const dados = tentarParsearDesejos(resposta.resposta);
    if (dados) return <ListaDesejosResumo dados={dados} categorias={modulo.categoriasDesejos} />;
  }

  if (modulo.tipo === 'roda-vida') {
    const dados = tentarParsearRodaVida(resposta.resposta);
    if (dados) return <RodaVidaResumo dados={dados} dimensoes={modulo.dimensoesRodaVida} areas={modulo.areasRodaVida} />;
  }

  if (modulo.tipo === 'formulario') {
    const dados = tentarParsearFormulario(resposta.resposta);
    if (dados) {
      return <FormularioGenericoResumo dados={dados} campos={modulo.campos} incluirModalidade={modulo.incluirModalidade} />;
    }
  }

  return <div className="resposta-salva">{resposta.resposta}</div>;
}
