const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ehTextoNaoVazio(valor: unknown): valor is string {
  return typeof valor === "string" && valor.trim().length > 0;
}

export function ehEmailValido(valor: unknown): valor is string {
  return typeof valor === "string" && REGEX_EMAIL.test(valor.trim());
}

export function normalizarEmail(email: string): string {
  return email.trim().toLowerCase();
}
