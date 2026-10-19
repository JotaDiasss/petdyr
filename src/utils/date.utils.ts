export function calcularIdade(nascimento: Date): number {
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();

  const aindaNaoFezAniversario =
    hoje.getMonth() < nascimento.getMonth() ||
    (hoje.getMonth() === nascimento.getMonth() &&
      hoje.getDate() < nascimento.getDate());

  if (aindaNaoFezAniversario) idade--;

  return idade;
}

export function dataDeNascimentoValida(valor: Date): boolean {
  if (!(valor instanceof Date) || Number.isNaN(valor.getTime())) {
    return false;
  }

  const hoje = new Date();

  const nascimentoUTC = Date.UTC(
    valor.getUTCFullYear(),
    valor.getUTCMonth(),
    valor.getUTCDate()
  );

  const hojeUTC = Date.UTC(
    hoje.getUTCFullYear(),
    hoje.getUTCMonth(),
    hoje.getUTCDate()
  );

  return nascimentoUTC <= hojeUTC;
}