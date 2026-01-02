// Função para validar CNPJ
export function validateCNPJ(cnpj: string): boolean {
  // Remove caracteres não numéricos
  const cleanedCnpj = cnpj.replace(/\D/g, '');
  
  // Verifica se tem 14 dígitos
  if (cleanedCnpj.length !== 14) {
    return false;
  }
  
  // Verifica se todos os dígitos são iguais (caso inválido)
  if (/^(\d)\1{13}$/.test(cleanedCnpj)) {
    return false;
  }
  
  // Validação dos dígitos verificadores
  let tamanho = cleanedCnpj.length - 2;
  let numeros = cleanedCnpj.substring(0, tamanho);
  const digitos = cleanedCnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }
  
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) {
    return false;
  }
  
  tamanho = tamanho + 1;
  numeros = cleanedCnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }
  
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) {
    return false;
  }
  
  return true;
}

// Função para formatar CNPJ
export function formatCNPJ(cnpj: string): string {
  // Remove caracteres não numéricos
  const cleanedCnpj = cnpj.replace(/\D/g, '');
  
  // Aplica a formatação
  return cleanedCnpj
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}