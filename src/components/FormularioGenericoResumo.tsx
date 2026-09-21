import type { CampoFormulario, RespostaFormulario } from '../types';

interface FormularioGenericoResumoProps {
  dados: RespostaFormulario;
  campos: CampoFormulario[];
  incluirModalidade?: boolean;
}

export default function FormularioGenericoResumo({ dados, campos, incluirModalidade }: FormularioGenericoResumoProps) {
  return (
    <div className="resposta-salva">
      {incluirModalidade && dados.modalidade && (
        <div className="desejos-resumo-cabecalho">{dados.modalidade}</div>
      )}

      {campos.map((campo) => {
        const valor = dados.valores[campo.id];
        if (!valor) return null;
        return (
          <div className="desejos-resumo-categoria" key={campo.id}>
            <span className="desejos-resumo-categoria-titulo">{campo.label}</span>
            <div>{valor}</div>
          </div>
        );
      })}
    </div>
  );
}
