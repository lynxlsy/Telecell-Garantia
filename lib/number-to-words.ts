// Utility to convert numbers to Brazilian Portuguese words
export function numberToWords(num: number): string {
  if (num === 0) return "zero reais"

  const units = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove"]
  const teens = ["dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"]
  const tens = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"]
  const hundreds = [
    "",
    "cento",
    "duzentos",
    "trezentos",
    "quatrocentos",
    "quinhentos",
    "seiscentos",
    "setecentos",
    "oitocentos",
    "novecentos",
  ]

  function convertThreeDigits(n: number): string {
    if (n === 0) return ""
    if (n === 100) return "cem"

    let result = ""
    const h = Math.floor(n / 100)
    const t = Math.floor((n % 100) / 10)
    const u = n % 10

    if (h > 0) result += hundreds[h]

    if (t === 1) {
      if (result) result += " e "
      result += teens[u]
    } else {
      if (t > 0) {
        if (result) result += " e "
        result += tens[t]
      }
      if (u > 0) {
        if (result && t > 0) result += " e "
        else if (result) result += " e "
        result += units[u]
      }
    }

    return result
  }

  const integerPart = Math.floor(num)
  const decimalPart = Math.round((num - integerPart) * 100)

  let result = ""

  // Millions
  const millions = Math.floor(integerPart / 1000000)
  if (millions > 0) {
    result += millions === 1 ? "um milhão" : convertThreeDigits(millions) + " milhões"
  }

  // Thousands
  const thousands = Math.floor((integerPart % 1000000) / 1000)
  if (thousands > 0) {
    if (result) result += " "
    result += thousands === 1 ? "mil" : convertThreeDigits(thousands) + " mil"
  }

  // Remaining
  const remaining = integerPart % 1000
  if (remaining > 0) {
    if (result) result += " e "
    result += convertThreeDigits(remaining)
  }

  result += integerPart === 1 ? " real" : " reais"

  if (decimalPart > 0) {
    result += " e " + convertThreeDigits(decimalPart)
    result += decimalPart === 1 ? " centavo" : " centavos"
  }

  return result
}
