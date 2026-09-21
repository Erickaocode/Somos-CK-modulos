export function formatarData(iso: string): string {
  const d = new Date(iso);
  return (
    d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' às ' +
    d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  );
}

export function iniciaisNome(nome: string): string {
  const partes = (nome || '').trim().split(/\s+/);
  const primeira = partes[0]?.[0] || '';
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}
