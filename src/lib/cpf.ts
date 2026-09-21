export function apenasNumeros(valor: string): string {
  return (valor || '').replace(/\D/g, '');
}

export function formatarCPF(valor: string): string {
  const n = apenasNumeros(valor).slice(0, 11);
  return n
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function cpfValido(cpf: string): boolean {
  const n = apenasNumeros(cpf);
  if (n.length !== 11 || /^(\d)\1{10}$/.test(n)) return false;

  const calcDigito = (fatorInicial: number): number => {
    let soma = 0;
    for (let i = 0; i < fatorInicial - 1; i++) {
      soma += parseInt(n[i], 10) * (fatorInicial - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  const d1 = calcDigito(10);
  const d2 = calcDigito(11);
  return d1 === parseInt(n[9], 10) && d2 === parseInt(n[10], 10);
}

export function mascararCPF(cpf: string): string {
  const n = apenasNumeros(cpf);
  if (n.length !== 11) return cpf;
  return `${n.slice(0, 3)}.***.***-${n.slice(9)}`;
}
