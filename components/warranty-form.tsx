"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, ChevronRight, Save, Search } from "lucide-react"
import { saveWarrantyReceipt, getCustomerDataByCpf, getCustomerDataByCnpj, updateCustomerFromReceipt } from "@/lib/firebase"
import { ProgressStepper } from "./progress-stepper"
import { validateCPF, formatCPF } from "@/lib/cpf-validator"
import { validateCNPJ, formatCNPJ } from "@/lib/cnpj-validator"
import { formatPhone } from "@/lib/format-phone"
import { numberToWords } from "@/lib/number-to-words"
// Define WarrantyData interface locally since we can't import it from the server-only module
interface WarrantyData {
  // Customer
  customerName: string
  cpf?: string
  cnpj?: string
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
  const [documentType, setDocumentType] = useState<'cpf' | 'cnpj'>('cpf'); // Default to CPF
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
  

  
  const handleSave = async () => {
    try {
      const formData = {
        customerName,
        cpf: documentType === 'cpf' && cpf ? cpf : undefined,
        cnpj: documentType === 'cnpj' && cnpj ? cnpj : undefined,
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
        warrantyDuration: `${warrantyMonths} meses (${useDecimalCounting ? Math.floor(warrantyMonths * 30.44) : warrantyMonths * 30} dias)` ,
        issueCity,
        issueDate,
        signatureName,
        observations: observations.trim() || undefined,
        companyName,
        companyLegalName,
        companyCNPJ,
        companyStateRegistration,
        companyAddress,
        companyPhone1,
        companyPhone2,
      };
      
      const receiptId = await saveWarrantyReceipt(formData);
      
      // Atualizar ou salvar informações do cliente no banco de dados
      await updateCustomerFromReceipt(formData);
      
      alert(`Recibo salvo com sucesso! ID: ${receiptId}`);
    } catch (error) {
      console.error("Erro ao salvar recibo:", error);
      alert("Erro ao salvar recibo. Por favor, tente novamente.");
    }
  };

  // Função para buscar informações do cliente pelo CPF ou CNPJ
  const handleSearchByDocument = async () => {
    const documentValue = documentType === 'cpf' ? cpf : cnpj;
    
    if (!documentValue.trim()) {
      alert(`Por favor, informe um ${documentType.toUpperCase()} antes de buscar.`);
      return;
    }
    
    if (documentType === 'cpf' && !validateCPF(documentValue)) {
      alert("CPF inválido. Por favor, verifique o número informado.");
      return;
    }
    
    if (documentType === 'cnpj' && !validateCNPJ(documentValue)) {
      alert("CNPJ inválido. Por favor, verifique o número informado.");
      return;
    }
    
    try {
      let customerData;
      if (documentType === 'cpf') {
        customerData = await getCustomerDataByCpf(documentValue);
      } else {
        customerData = await getCustomerDataByCnpj(documentValue);
      }
      
      if (customerData) {
        // Preencher os campos com as informações encontradas
        setCustomerName(customerData.name);
        setPhone(customerData.phone);
        setCity(customerData.city);
        setState(customerData.state);
        
        alert(`Informações do cliente ${customerData.name} encontradas e preenchidas!`);
      } else {
        alert(`Nenhuma informação encontrada para este ${documentType.toUpperCase()}. Preencha os dados manualmente.`);
      }
    } catch (error) {
      console.error("Erro ao buscar informações do cliente:", error);
      alert("Erro ao buscar informações do cliente. Por favor, tente novamente.");
    }
  };

  // Função para formatar o campo CPF
  const formatCpf = (value: string) => {
    return formatCPF(value);
  };

  // Função para formatar o campo CNPJ
  const formatCnpj = (value: string) => {
    return formatCNPJ(value);
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
  const [cnpj, setCnpj] = useState("")
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
  const [useDecimalCounting, setUseDecimalCounting] = useState(true) // Default to checked
  const [observations, setObservations] = useState("")

  // Step 4: Issuance Data
  const [issueCity, setIssueCity] = useState("Petrolina – PE")
  const [issueDate, setIssueDate] = useState(new Date().toLocaleDateString("pt-BR"))
  const [signatureName, setSignatureName] = useState("Telecell Magazine")

  // Opções pré-definidas para memória ROM
  const romOptions = [
    "16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1TB"
  ];

  // Opções pré-definidas para memória RAM
  const ramOptions = [
    "2GB", "3GB", "4GB", "6GB", "8GB", "12GB", "16GB", "24GB"
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!customerName.trim()) newErrors.customerName = "Nome é obrigatório"
      if (documentType === 'cpf' && !cpf.trim()) {
        newErrors.cpf = "CPF é obrigatório"
      } else if (documentType === 'cpf' && !validateCPF(cpf)) {
        newErrors.cpf = "CPF inválido"
      }
      if (documentType === 'cnpj' && !cnpj.trim()) {
        newErrors.cnpj = "CNPJ é obrigatório"
      } else if (documentType === 'cnpj' && !validateCNPJ(cnpj)) {
        newErrors.cnpj = "CNPJ inválido"
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


  const saleValueInWords = saleValue ? numberToWords(Number.parseFloat(saleValue) || 0) : ""

  if (showPreview) {
    return (
      <WarrantyPreview
        data={{
          customerName,
          cpf: documentType === 'cpf' ? cpf : undefined,
          cnpj: documentType === 'cnpj' ? cnpj : undefined,
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
          warrantyDuration: `${warrantyMonths} meses (${useDecimalCounting ? Math.floor(warrantyMonths * 30.44) : warrantyMonths * 30} dias)` ,
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

                <div className="space-y-2">
                  <Label className="text-base font-semibold">
                    Tipo de Documento *
                  </Label>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="documentTypeCpf"
                        name="documentType"
                        checked={documentType === 'cpf'}
                        onChange={() => setDocumentType('cpf')}
                        className="h-4 w-4 text-red-600 focus:ring-red-500"
                      />
                      <Label htmlFor="documentTypeCpf" className="text-sm font-medium">
                        CPF
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="documentTypeCnpj"
                        name="documentType"
                        checked={documentType === 'cnpj'}
                        onChange={() => setDocumentType('cnpj')}
                        className="h-4 w-4 text-red-600 focus:ring-red-500"
                      />
                      <Label htmlFor="documentTypeCnpj" className="text-sm font-medium">
                        CNPJ
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor={documentType} className="text-base font-semibold">
                      {documentType === 'cpf' ? 'CPF *' : 'CNPJ *'}
                    </Label>
                    <div className="relative">
                      <Input
                        id={documentType}
                        value={documentType === 'cpf' ? cpf : cnpj}
                        onChange={(e) => {
                          if (documentType === 'cpf') {
                            setCpf(formatCpf(e.target.value));
                          } else {
                            setCnpj(formatCnpj(e.target.value));
                          }
                        }}
                        placeholder={documentType === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00'}
                        maxLength={documentType === 'cpf' ? 14 : 18}
                        className={`pr-10 ${errors[documentType as keyof typeof errors] ? "border-red-500" : ""}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 px-2"
                        onClick={handleSearchByDocument}
                        title={`Buscar informações do cliente pelo ${documentType.toUpperCase()}`}
                      >
                        <Search className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                    {errors[documentType as keyof typeof errors] && <p className="text-sm text-red-600">{errors[documentType as keyof typeof errors]}</p>}
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
                      placeholder="Ex: Galaxy S21, iPhone 13"
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
                        <SelectValue placeholder="Selecione a memória ROM" />
                      </SelectTrigger>
                      <SelectContent>
                        {romOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
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
                        <SelectValue placeholder="Selecione a memória RAM" />
                      </SelectTrigger>
                      <SelectContent>
                        {ramOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
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
                      onChange={(e) => setImei1(e.target.value)}
                      placeholder="IMEI do aparelho"
                      className={errors.imei1 ? "border-red-500" : ""}
                    />
                    {errors.imei1 && <p className="text-sm text-red-600">{errors.imei1}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imei2" className="text-base font-semibold">
                      IMEI 2
                    </Label>
                    <Input
                      id="imei2"
                      value={imei2}
                      onChange={(e) => setImei2(e.target.value)}
                      placeholder="IMEI secundário (opcional)"
                    />
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <Button type="button" onClick={handleBack} variant="outline" className="flex-1">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                  <Button onClick={handleNext} className="flex-1 bg-red-600 hover:bg-red-700">
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
                <CardDescription>Informações sobre o valor e garantia</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="saleValue" className="text-base font-semibold">
                    Valor da Venda *
                  </Label>
                  <Input
                    id="saleValue"
                    type="number"
                    step="0.01"
                    value={saleValue}
                    onChange={(e) => setSaleValue(e.target.value)}
                    placeholder="0,00"
                    className={errors.saleValue ? "border-red-500" : ""}
                  />
                  {errors.saleValue && <p className="text-sm text-red-600">{errors.saleValue}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="warrantyMonths" className="text-base font-semibold">
                      Garantia (meses)
                    </Label>
                    <Input
                      id="warrantyMonths"
                      type="number"
                      value={warrantyMonths}
                      onChange={(e) => setWarrantyMonths(Number(e.target.value))}
                      min="1"
                      max="999"
                      className="w-full"
                    />
                    <p className="text-sm text-gray-500">Duração da garantia em meses</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Contar os decimais (12 meses = 365 dias)</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="useDecimalCounting"
                        checked={useDecimalCounting}
                        onChange={(e) => setUseDecimalCounting(e.target.checked)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 rounded"
                      />
                      <Label htmlFor="useDecimalCounting" className="text-sm font-medium">
                        Ativado
                      </Label>
                    </div>
                    <p className="text-sm text-gray-500">Calcula 12 meses como 365 dias em vez de 360 dias</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observations" className="text-base font-semibold">
                    Observações
                  </Label>
                  <Textarea
                    id="observations"
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="Observações adicionais sobre a garantia ou venda..."
                    rows={3}
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <Button type="button" onClick={handleBack} variant="outline" className="flex-1">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                  <Button onClick={handleNext} className="flex-1 bg-red-600 hover:bg-red-700">
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
                <CardTitle className="text-2xl">Emissão do Recibo</CardTitle>
                <CardDescription>Confirme os dados de emissão</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="issueCity" className="text-base font-semibold">
                      Cidade de Emissão *
                    </Label>
                    <Input
                      id="issueCity"
                      value={issueCity}
                      onChange={(e) => setIssueCity(e.target.value)}
                      placeholder="Cidade de emissão"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="issueDate" className="text-base font-semibold">
                      Data de Emissão *
                    </Label>
                    <Input
                      id="issueDate"
                      type="text"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      placeholder="DD/MM/AAAA"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signatureName" className="text-base font-semibold">
                    Nome para Assinatura *
                  </Label>
                  <Input
                    id="signatureName"
                    value={signatureName}
                    onChange={(e) => setSignatureName(e.target.value)}
                    placeholder="Nome que aparecerá na assinatura"
                    className="w-full"
                  />
                </div>

                <div className="pt-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="font-semibold text-blue-800">Resumo da Garantia</p>
                    <p className="text-blue-700">
                      {warrantyMonths} meses ({useDecimalCounting ? Math.floor(warrantyMonths * 30.44) : warrantyMonths * 30} dias)
                    </p>
                    <p className="text-blue-700">
                      Valor: R$ {Number(saleValue).toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <Button type="button" onClick={handleBack} variant="outline" className="flex-1">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                  <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700">
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Recibo
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </form>
      </Card>
    </div>
  )
}