export interface IPet {
  nome: string;
  idade: number;
  animal: {
    especie: string;
    raca: string;
  };
  dono: {
    nome: string;
    cpf: number;
  };
}
