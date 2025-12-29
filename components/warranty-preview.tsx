"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, Download, AlertCircle, Printer } from "lucide-react"
import Image from "next/image"
import type { WarrantyData } from "@/lib/generate-docx"

interface WarrantyPreviewProps {
  data: WarrantyData
  onBack: () => void
  onGenerate: () => void
}

export function WarrantyPreview({ data, onBack, onGenerate }: WarrantyPreviewProps) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="outline" size="lg">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div className="flex gap-3">
          <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700" size="lg">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir Recibo
          </Button>
          <Button onClick={onGenerate} className="bg-red-600 hover:bg-red-700" size="lg">
            <Download className="mr-2 h-4 w-4" />
            Gerar DOCX
          </Button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold">Recibo de Garantia</p>
          <p>
            Optimizado para impressão em preto e branco em uma única folha A4. Clique em "Imprimir Recibo" para
            visualizar ou "Gerar DOCX" para salvar.
          </p>
        </div>
      </div>

      <div id="print-area" className="bg-white shadow-lg">
        {/* BLACK HEADER - COMPACT */}
        <div className="bg-black px-6 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            {/* Logo */}
            <div className="flex justify-start">
              <Image
                src="/images/telecell-magazine-logo-transparent.png"
                alt="Telecell Magazine"
                width={100}
                height={32}
                className="h-auto logo-print"
              />
            </div>

            {/* Title */}
            <div className="text-center">
              <h1 className="text-xl font-bold text-white tracking-wide">RECIBO DE GARANTIA</h1>
            </div>

            {/* Company Info - Right */}
            <div className="text-right text-xs text-white space-y-0.5">
              <p className="font-bold">{data.companyName}</p>
              <p className="text-xs">{data.companyLegalName}</p>
              <p className="text-xs">CNPJ: {data.companyCNPJ}</p>
              <p className="text-xs">IE: {data.companyStateRegistration}</p>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT - COMPACT SPACING */}
        <div className="p-6 space-y-3">
          {/* SECTION 1: BENEFICIARY DATA */}
          <div className="space-y-2">
            <h2 className="text-base font-bold text-black border-b-2 border-black pb-1 uppercase tracking-wider">
              Dados do Beneficiário
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs font-bold text-black uppercase">Nome</p>
                <p className="text-black font-medium">{data.customerName}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-black uppercase">CPF</p>
                <p className="text-black font-medium">{data.cpf}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-black uppercase">Telefone</p>
                <p className="text-black font-medium">{data.phone}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-black uppercase">Cidade</p>
                <p className="text-black font-medium">
                  {data.city} - {data.state}
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 2: SMARTPHONE DATA */}
          <div className="space-y-2">
            <h2 className="text-base font-bold text-black border-b-2 border-black pb-1 uppercase tracking-wider">
              Dados do Smartphone
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs font-bold text-black uppercase">Marca</p>
                <p className="text-black font-medium">{data.brand}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-black uppercase">Modelo</p>
                <p className="text-black font-medium">{data.model}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-black uppercase">ROM/RAM</p>
                <p className="text-black font-medium">
                  {data.romMemory} / {data.ramMemory}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-black uppercase">IMEI 1</p>
                <p className="text-black font-mono text-xs">{data.imei1}</p>
              </div>
              {data.imei2 && (
                <div className="col-span-2">
                  <p className="text-xs font-bold text-black uppercase">IMEI 2</p>
                  <p className="text-black font-mono text-xs">{data.imei2}</p>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 3: PAYMENT VALUE - MAXIMUM HIGHLIGHT */}
          <div className="bg-black border-4 border-black text-white p-4 text-center space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider">Valor Total</p>
            <p className="text-4xl font-black">R$ {data.saleValue.toFixed(2).replace(".", ",")}</p>
            <div className="border-t border-gray-600 pt-2">
              <p className="text-xs font-bold uppercase mb-1">Por Extenso</p>
              <p className="text-sm font-medium leading-tight capitalize">{data.saleValueInWords}</p>
            </div>
          </div>

          {/* SECTION 3.5: FORMAL PAYMENT DATA SECTION */}
          <div className="border border-gray-400 p-3 bg-white">
            <p className="text-xs font-bold text-black uppercase tracking-wider mb-2">Dados do Pagamento</p>
            <p className="text-sm text-black leading-tight text-justify">
              A importância de ({data.saleValueInWords.toLowerCase()}), correspondente ao valor total pago, referente à
              compra de 01 (um) aparelho smartphone, com memória {data.romMemory}ROM / {data.ramMemory}RAM, marca{" "}
              {data.brand}, modelo {data.model}, IMEI {data.imei1}
              {data.imei2 && ` e IMEI ${data.imei2}`}, conforme dados informados neste recibo.
            </p>
          </div>

          {/* SECTION 4: WARRANTY OBSERVATION */}
          <div className="border-4 border-black p-3 bg-white">
            <p className="text-xs font-bold text-black uppercase tracking-wider mb-1">Observações da Garantia</p>
            <p className="text-sm text-black leading-tight">
              Garantia válida por 365 dias (12 meses). A garantia não cobre impacto, oxidação ou qualquer dano provocado
              por mau uso do aparelho.
            </p>
          </div>

          {/* SECTION 5: FOOTER */}
          <div className="pt-3 space-y-2 border-t-2 border-black">
            <p className="text-sm font-bold text-black">
              {data.issueCity}, {data.issueDate}
            </p>

            <div className="border-t pt-2 mt-3 space-y-1">
              <p className="text-xs text-black leading-tight">
                <span className="font-bold">Contato:</span> WhatsApp {data.companyPhone2} | Tel. {data.companyPhone1} |
                Instagram @telecellmagazine
              </p>
              <p className="text-xs text-black">{data.companyAddress}</p>
            </div>

            <div className="flex justify-end pt-4">
              <div className="flex flex-col items-center w-64">
                <div className="w-full border-t-2 border-black"></div>
                <p className="font-bold text-black text-sm mt-1">{data.signatureName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
