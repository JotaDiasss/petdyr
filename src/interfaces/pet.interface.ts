export interface IPet {
  nome: string;
  nascimento: Date;
  animal: {
    especie: string;
    raca: string;
  };
  dono: {
    nome: string;
    cpf: string;
  };
}
