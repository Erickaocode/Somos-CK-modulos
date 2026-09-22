import type { Ato, Jovem, Modulo } from '../types';
import { formatarCPF } from './cpf';
import { formatarData } from './format';
import { textoCompletoResposta } from './resumoResposta';

function escaparCampoCsv(valor: string): string {
  const precisaAspas = /[";\n]/.test(valor);
  const escapado = valor.replace(/"/g, '""');
  return precisaAspas ? `"${escapado}"` : escapado;
}

/** Gera um CSV (separado por ";", padrão do Excel em pt-BR) com uma linha por resposta enviada. */
export function gerarCsvRespostas(jovens: Jovem[], modulos: Modulo[], atos: Ato[]): string {
  const cabecalho = ['Nome', 'CPF', 'Ato', 'Módulo', 'Resposta', 'Data'];
  const linhas = [cabecalho];

  jovens.forEach((jovem) => {
    jovem.respostas
      .slice()
      .sort((a, b) => modulos.findIndex((m) => m.id === a.moduloId) - modulos.findIndex((m) => m.id === b.moduloId))
      .forEach((r) => {
        const modulo = modulos.find((m) => m.id === r.moduloId);
        const ato = modulo ? atos.find((a) => a.id === modulo.atoId) : undefined;
        linhas.push([
          jovem.nome,
          formatarCPF(jovem.cpf),
          ato?.titulo ?? '',
          modulo?.titulo ?? r.moduloId,
          textoCompletoResposta(modulo, r),
          formatarData(r.data),
        ]);
      });
  });

  return linhas.map((linha) => linha.map(escaparCampoCsv).join(';')).join('\r\n');
}

/** Baixa uma string como arquivo, com BOM UTF-8 para o Excel abrir acentos corretamente. */
export function baixarArquivo(conteudo: string, nomeArquivo: string, tipoMime: string): void {
  const bom = '﻿';
  const blob = new Blob([bom + conteudo], { type: tipoMime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
