import type { RequestHandler } from "express";

const campos: Record<string, string[]> = {
  animais: ["especie", "racas"],
  dono: ["nome", "cpf"],
  pet: ["nome", "nascimento", "animal", "dono"],
};

// JSON não é validado pelas interfaces TypeScript.
export const validarEntrada: RequestHandler = (req, res, next) => {
  if (!["POST", "PATCH"].includes(req.method)) return next();
  const recurso = req.path.split("/")[1] ?? "";
  const permitidos = campos[recurso];
  if (!permitidos) return next();
  const body: unknown = req.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    res.status(400).json({ err: "Informe um objeto JSON" });
    return;
  }
  const dados = body as Record<string, unknown>;
  if (!Object.keys(dados).length ||
      Object.keys(dados).some((campo) => !permitidos.includes(campo))) {
    res.status(400).json({ err: "Campos ausentes ou desconhecidos" });
    return;
  }
  for (const campo of permitidos) {
    if (!(campo in dados) && req.method === "PATCH") continue;
    const valor = dados[campo];
    let valido: boolean;
    if (campo === "racas") {
      valido = Array.isArray(valor) && valor.length > 0 &&
        valor.every((raca) => typeof raca === "string" && !!raca.trim());
    } else if (campo === "animal" || campo === "dono") {
      const chaves = campo === "animal" ? ["especie", "raca"] : ["nome", "cpf"];
      valido = !!valor && typeof valor === "object" && !Array.isArray(valor) &&
        chaves.every((chave) => {
          const item = (valor as Record<string, unknown>)[chave];
          return typeof item === "string" && !!item.trim();
        });
    } else {
      valido = typeof valor === "string" && !!valor.trim();
    }
    if (!valido) {
      res.status(400).json({ err: `Campo inválido ou ausente: ${campo}` });
      return;
    }
  }
  next();
};
