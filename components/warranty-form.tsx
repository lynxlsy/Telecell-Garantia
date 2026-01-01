"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, ChevronRight, FileText, Download, Save } from "lucide-react"
import { ProgressStepper } from "./progress-stepper"
import { validateCPF, formatCPF } from "@/lib/cpf-validator"
import { formatPhone } from "@/lib/format-phone"
import { numberToWords } from "@/lib/number-to-words"
// Define WarrantyData interface locally since we can't import it from the server-only module
interface WarrantyData {
  // Customer
  customerName: string
  cpf: string
  phone: string
  city: string
  state: string

  // Smartphone
  productType: string
  brand: string
  model: string
  romMemory: string
  ramMemory: string
  imei1: string
  imei2?: string

  // Sale
  saleValue: number
  saleValueInWords: string
  warrantyDuration: string

  // Issuance
  issueCity: string
  issueDate: string
  signatureName: string
  signatureImage?: ArrayBuffer

  companyName: string
  companyLegalName: string
  companyCNPJ: string
  companyStateRegistration: string
  companyAddress: string
  companyPhone1: string
  companyPhone2: string
  observations?: string
}

// Removed direct import of generateWarrantyDocx as it uses docx which is not browser-compatible
// Now using API route for DOCX generation
import { WarrantyPreview } from "./warranty-preview"

const steps = [
  { number: 1, title: "Dados do Cliente" },
  { number: 2, title: "Dados do Aparelho" },
  { number: 3, title: "Dados da Venda" },
  { number: 4, title: "Emissão" },
]

const brazilianStates = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
]

export function WarrantyForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showPreview, setShowPreview] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
    
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const form = e.currentTarget.closest('form');
      if (form) {
        const focusableElements = form.querySelectorAll(
          'input, select, textarea, button'
        ) as NodeListOf<HTMLElement>;
          
        const currentElement = e.currentTarget as HTMLElement;
        const currentIndex = Array.from(focusableElements).indexOf(currentElement);
          
        if (currentIndex < focusableElements.length - 1) {
          focusableElements[currentIndex + 1].focus();
        }
      }
    }
  }
    
  
    
  const handleSave = () => {
    const formData = {
      customerName,
      cpf,
      phone,
      city,
      state,
      productType,
      brand,
      model,
      romMemory,
      ramMemory,
      imei1,
      imei2,
      saleValue,
      warrantyMonths,
      observations,
      issueCity,
      issueDate,
      signatureName,
    };
    
    localStorage.setItem('warrantyFormData', JSON.stringify(formData));
    alert('Dados salvos com sucesso!');
  };
  
  const [companyName] = useState("Telecell Magazine")
  const [companyLegalName] = useState("E dos Santos Silva")
  const [companyCNPJ] = useState("06.227.875/0001-07")
  const [companyStateRegistration] = useState("0311807-01")
  const [companyAddress] = useState("Galeria Eco Center – Loja 01, Centro, Petrolina – PE")
  const [companyPhone1] = useState("(87) 3862-0240")
  const [companyPhone2] = useState("(87) 9 8877-5727")

  // Step 1: Customer Data
  const [customerName, setCustomerName] = useState("")
  const [cpf, setCpf] = useState("")
  const [phone, setPhone] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("PE")

  // Step 2: Smartphone Data
  const [productType, setProductType] = useState("Smartphone")
  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")
  const [romMemory, setRomMemory] = useState("")
  const [ramMemory, setRamMemory] = useState("")
  const [imei1, setImei1] = useState("")
  const [imei2, setImei2] = useState("")

  // Step 3: Sale Data
  const [saleValue, setSaleValue] = useState("")
  const [warrantyMonths, setWarrantyMonths] = useState(12)
  const [observations, setObservations] = useState("")

  // Step 4: Issuance Data
  const [issueCity, setIssueCity] = useState("Petrolina – PE")
  const [issueDate, setIssueDate] = useState(new Date().toLocaleDateString("pt-BR"))
  const [signatureName, setSignatureName] = useState("Telecell Magazine")

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!customerName.trim()) newErrors.customerName = "Nome é obrigatório"
      if (!cpf.trim()) {
        newErrors.cpf = "CPF é obrigatório"
      } else if (!validateCPF(cpf)) {
        newErrors.cpf = "CPF inválido"
      }
      if (!phone.trim()) newErrors.phone = "Telefone é obrigatório"
      if (!city.trim()) newErrors.city = "Cidade é obrigatória"
      if (!state) newErrors.state = "Estado é obrigatório"
    } else if (step === 2) {
      if (!brand.trim()) newErrors.brand = "Marca é obrigatória"
      if (!model.trim()) newErrors.model = "Modelo é obrigatório"
      if (!romMemory.trim()) newErrors.romMemory = "Memória ROM é obrigatória"
      if (!ramMemory.trim()) newErrors.ramMemory = "Memória RAM é obrigatória"
      if (!imei1.trim()) newErrors.imei1 = "IMEI 1 é obrigatório"
    } else if (step === 3) {
      if (!saleValue.trim()) {
        newErrors.saleValue = "Valor da venda é obrigatório"
      } else if (Number.parseFloat(saleValue) <= 0) {
        newErrors.saleValue = "Valor deve ser maior que zero"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4))
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    setErrors({})
  }

  const handlePreview = () => {
    if (validateStep(4)) {
      setShowPreview(true)
    }
  }

  const handleGenerateDocx = async () => {
    const data: WarrantyData = {
      customerName,
      cpf,
      phone,
      city,
      state,
      productType,
      brand,
      model,
      romMemory,
      ramMemory,
      imei1,
      imei2,
      saleValue: Number.parseFloat(saleValue),
      saleValueInWords: numberToWords(Number.parseFloat(saleValue)),
      warrantyDuration: `${warrantyMonths} meses (${warrantyMonths * 30} dias)` ,
      issueCity,
      issueDate,
      signatureName,
      companyName,
      companyLegalName,
      companyCNPJ,
      companyStateRegistration,
      companyAddress,
      companyPhone1,
      companyPhone2,
      observations: observations.trim() || undefined,
    }

    try {
      const response = await fetch('/api/generate-docx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to generate document')
      }

      // Create a download link for the returned blob
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Recibo_Garantia_${customerName.replace(/\s+/g, '_')}.docx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating DOCX:', error)
      alert('Erro ao gerar documento. Por favor, tente novamente.')
    }
  }

  const saleValueInWords = saleValue ? numberToWords(Number.parseFloat(saleValue) || 0) : ""

  if (showPreview) {
    return (
      <WarrantyPreview
        data={{
          customerName,
          cpf,
          phone,
          city,
          state,
          productType,
          brand,
          model,
          romMemory,
          ramMemory,
          imei1,
          imei2,
          saleValue: Number.parseFloat(saleValue),
          saleValueInWords,
          warrantyDuration: `${warrantyMonths} meses (${warrantyMonths * 30} dias)` ,
          issueCity,
          issueDate,
          signatureName,
          companyName,
          companyLegalName,
          companyCNPJ,
          companyStateRegistration,
          companyAddress,
          companyPhone1,
          companyPhone2,
          observations: observations.trim() || undefined,
        }}
        onBack={() => setShowPreview(false)}
        onGenerate={handleGenerateDocx}
      />
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Gerador de Recibo de Garantia</h1>
        <p className="text-lg text-gray-600">Preencha os dados para gerar o recibo profissional</p>
      </div>

      <ProgressStepper currentStep={currentStep} steps={steps} />

      <Card className="p-6 md:p-10 shadow-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (currentStep === 4) {
              handlePreview()
            } else {
              handleNext()
            }
          }}
          onKeyDown={handleKeyDown}
          className="space-y-8"
        >
          {/* Step 1: Customer Data */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Dados do Cliente</CardTitle>
                <CardDescription>Preencha as informações do cliente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="customerName" className="text-base font-semibold">
                    Nome Completo *
                  </Label>
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Digite o nome completo"
                    className={errors.customerName ? "border-red-500" : ""}
                  />
                  {errors.customerName && <p className="text-sm text-red-600">{errors.customerName}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="cpf" className="text-base font-semibold">
                      CPF *
                    </Label>
                    <Input
                      id="cpf"
                      value={cpf}
                      onChange={(e) => setCpf(formatCPF(e.target.value))}
                      placeholder="000.000.000-00"
                      maxLength={14}
                      className={errors.cpf ? "border-red-500" : ""}
                    />
                    {errors.cpf && <p className="text-sm text-red-600">{errors.cpf}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-base font-semibold">
                      Telefone / Celular *
                    </Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(formatPhone(e.target.value))}
                      placeholder="(00) 00000-0000"
                      maxLength={15}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="city" className="text-base font-semibold">
                      Cidade *
                    </Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Digite a cidade"
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && <p className="text-sm text-red-600">{errors.city}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-base font-semibold">
                      Estado *
                    </Label>
                    <Select value={state} onValueChange={setState}>
                      <SelectTrigger className={errors.state ? "border-red-500" : ""}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {brazilianStates.map((st) => (
                          <SelectItem key={st} value={st}>
                            {st}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.state && <p className="text-sm text-red-600">{errors.state}</p>}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleNext} className="bg-red-600 hover:bg-red-700">
                    Próximo
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Smartphone Data */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Dados do Aparelho</CardTitle>
                <CardDescription>Informações técnicas do aparelho</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="productType" className="text-base font-semibold">
                    Tipo do Produto
                  </Label>
                  <Input
                    id="productType"
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                    placeholder="Smartphone"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="brand" className="text-base font-semibold">
                      Marca *
                    </Label>
                    <Input
                      id="brand"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="Ex: Samsung, Apple, Xiaomi"
                      className={errors.brand ? "border-red-500" : ""}
                    />
                    {errors.brand && <p className="text-sm text-red-600">{errors.brand}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model" className="text-base font-semibold">
                      Modelo *
                    </Label>
                    <Input
                      id="model"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="Ex: Galaxy S24, iPhone 15"
                      className={errors.model ? "border-red-500" : ""}
                    />
                    {errors.model && <p className="text-sm text-red-600">{errors.model}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="romMemory" className="text-base font-semibold">
                      Memória ROM *
                    </Label>
                    <Select value={romMemory} onValueChange={setRomMemory}>
                      <SelectTrigger className={errors.romMemory ? "border-red-500" : ""}>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="32GB">32GB</SelectItem>
                        <SelectItem value="64GB">64GB</SelectItem>
                        <SelectItem value="128GB">128GB</SelectItem>
                        <SelectItem value="256GB">256GB</SelectItem>
                        <SelectItem value="512GB">512GB</SelectItem>
                        <SelectItem value="1TB">1TB</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.romMemory && <p className="text-sm text-red-600">{errors.romMemory}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ramMemory" className="text-base font-semibold">
                      Memória RAM *
                    </Label>
                    <Select value={ramMemory} onValueChange={setRamMemory}>
                      <SelectTrigger className={errors.ramMemory ? "border-red-500" : ""}>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2GB">2GB</SelectItem>
                        <SelectItem value="3GB">3GB</SelectItem>
                        <SelectItem value="4GB">4GB</SelectItem>
                        <SelectItem value="6GB">6GB</SelectItem>
                        <SelectItem value="8GB">8GB</SelectItem>
                        <SelectItem value="12GB">12GB</SelectItem>
                        <SelectItem value="16GB">16GB</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.ramMemory && <p className="text-sm text-red-600">{errors.ramMemory}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="imei1" className="text-base font-semibold">
                      IMEI 1 *
                    </Label>
                    <Input
                      id="imei1"
                      value={imei1}
                      onChange={(e) => setImei1(e.target.value.replace(/\D/g, "").slice(0, 15))}
                      placeholder="Digite o IMEI 1"
                      maxLength={15}
                      className={`font-mono ${errors.imei1 ? "border-red-500" : ""}`}
                    />
                    {errors.imei1 && <p className="text-sm text-red-600">{errors.imei1}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imei2" className="text-base font-semibold">
                      IMEI 2 (Opcional)
                    </Label>
                    <Input
                      id="imei2"
                      value={imei2}
                      onChange={(e) => setImei2(e.target.value.replace(/\D/g, "").slice(0, 15))}
                      placeholder="Digite o IMEI 2 (se houver)"
                      maxLength={15}
                      className="font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button onClick={handleBack} variant="outline">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                  <Button onClick={handleNext} className="bg-red-600 hover:bg-red-700">
                    Próximo
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Sale Data */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Dados da Venda</CardTitle>
                <CardDescription>Informações comerciais da transação</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="saleValue" className="text-base font-semibold">
                    Valor da Venda (R$) *
                  </Label>
                  <Input
                    id="saleValue"
                    type="number"
                    step="0.01"
                    min="0"
                    value={saleValue}
                    onChange={(e) => setSaleValue(e.target.value)}
                    placeholder="0.00"
                    className={`text-lg font-semibold ${errors.saleValue ? "border-red-500" : ""}`}
                  />
                  {errors.saleValue && <p className="text-sm text-red-600">{errors.saleValue}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold">Valor por Extenso</Label>
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200">
                    <p className="text-sm text-gray-800 capitalize font-medium leading-relaxed">
                      {saleValueInWords || "O valor por extenso aparecerá aqui automaticamente"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warrantyMonths" className="text-base font-semibold">
                    Duração da Garantia (meses)
                  </Label>
                  <Input
                    id="warrantyMonths"
                    type="number"
                    min="1"
                    value={warrantyMonths}
                    onChange={(e) => setWarrantyMonths(Number.parseInt(e.target.value) || 1)}
                    placeholder="Digite o número de meses"
                  />
                  <p className="text-sm text-gray-500">A garantia será calculada como {warrantyMonths} meses ({warrantyMonths * 30} dias)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observations" className="text-base font-semibold">
                    Observações (Opcional)
                  </Label>
                  <Textarea
                    id="observations"
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="Ex: Condição do aparelho, acessórios entregues, acordos específicos, informações internas..."
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-sm text-gray-500">Adicione informações adicionais que deseja incluir no recibo</p>
                </div>

                <div className="flex justify-between pt-4">
                  <Button onClick={handleBack} variant="outline">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                  <Button onClick={handleNext} className="bg-red-600 hover:bg-red-700">
                    Próximo
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Issuance Data */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Emissão</CardTitle>
                <CardDescription>Finalize o recibo de garantia</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="issueCity" className="text-base font-semibold">
                      Cidade de Emissão
                    </Label>
                    <Input
                      id="issueCity"
                      value={issueCity}
                      onChange={(e) => setIssueCity(e.target.value)}
                      placeholder="Petrolina – PE"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="issueDate" className="text-base font-semibold">
                      Data de Emissão
                    </Label>
                    <Input
                      id="issueDate"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      placeholder="DD/MM/AAAA"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signatureName" className="text-base font-semibold">
                    Nome na Assinatura
                  </Label>
                  <Input
                    id="signatureName"
                    value={signatureName}
                    onChange={(e) => setSignatureName(e.target.value)}
                    placeholder="Telecell Magazine"
                  />
                </div>

                <div className="flex justify-between gap-4 pt-4">
                  <Button onClick={handleBack} variant="outline">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                  <div className="flex gap-3">
                    <Button onClick={handlePreview} variant="outline" size="lg">
                      <FileText className="mr-2 h-4 w-4" />
                      Visualizar
                    </Button>
                    <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700" size="lg">
                      <Save className="mr-2 h-4 w-4" />
                      Salvar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </form>
      </Card>
    </div>
  )
}
