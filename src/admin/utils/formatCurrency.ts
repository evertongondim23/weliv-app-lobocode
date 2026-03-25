/** Formatação BRL única para o módulo admin / financeiro. */
export function formatBRL(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}
