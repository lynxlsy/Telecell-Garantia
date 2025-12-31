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
  
  const getWarrantyText = (warrantyDuration: string): string => {
    // Parse the warranty duration string to extract months
    // Expected format: "X meses (Y dias)" where X is months and Y is days
    const monthsMatch = warrantyDuration.match(/(\d+)\s*meses?/);
    const months = monthsMatch ? parseInt(monthsMatch[1]) : 12;
    
    // Calculate days based on months (using 30 days per month as standard)
    const days = months * 30;
    
    return `Garantia válida por ${months} meses (${days} dias). Não cobre impacto, oxidação ou qualquer dano provocado por mau uso do aparelho.`;
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
            Optimizado para impressão em preto e branco em meia folha A4. Clique em "Imprimir Recibo" para
            visualizar ou "Gerar DOCX" para salvar.
          </p>
        </div>
      </div>

      <div id="print-area" className="bg-white shadow-lg">
        {/* 1️⃣ MINIMALIST HEADER WITHOUT BLACK BACKGROUND (INK ECONOMY) */}
        <div className="bg-white px-4 py-2 border-b-2 border-black">
          <div className="flex items-center justify-between">
            {/* LEFT - LOGO */}
            <div className="flex items-center">
              <Image
                src="/images/telecell-magazine-logo-transparent.png"
                alt="Telecell Magazine"
                width={140}
                height={46}
                className="h-auto logo-print"
              />
            </div>
            
            {/* CENTER - FIXED TITLE */}
            <div className="text-center flex-1 mx-4">
              <h1 className="text-2xl font-extrabold text-black tracking-wider uppercase">RECIBO DE GARANTIA</h1>
            </div>
            
            {/* RIGHT - SHOP DATA (COMPACT) */}
            <div className="text-right text-xs text-black">
              <p className="font-bold">{data.companyName} – {data.companyLegalName}</p>
              <p className="text-xs">CNPJ: {data.companyCNPJ} | IE: {data.companyStateRegistration}</p>
              <p className="text-xs">{data.companyAddress}</p>
            </div>
          </div>
        </div>

        {/* COMPACT MAIN CONTENT */}
        <div className="p-3 space-y-2">
          {/* 2️⃣ DADOS DO BENEFICIÁRIO (WITH VISUAL EMPHASIS) */}
          <div className="border-2 border-black p-2 bg-gray-50">
            <p className="text-xs font-extrabold text-black uppercase mb-1">Dados do Beneficiário</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-xs font-medium text-black">Nome:</p>
                <p className="text-black font-medium">{data.customerName}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-black">CPF:</p>
                <p className="text-black font-medium">{data.cpf}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-black">Telefone:</p>
                <p className="text-black font-medium">{data.phone}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-black">Cidade/UF:</p>
                <p className="text-black font-medium">{data.city}/{data.state}</p>
              </div>
            </div>
          </div>

          {/* 3️⃣ DADOS DO SMARTPHONE (WITH VISUAL EMPHASIS) */}
          <div className="border-2 border-black p-2 bg-gray-50">
            <p className="text-xs font-extrabold text-black uppercase mb-1">Dados do Smartphone</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="col-span-2">
                <p className="text-xs font-medium text-black">Marca / Modelo:</p>
                <p className="text-black font-medium">{data.brand} {data.model}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-black">Memória:</p>
                <p className="text-black font-medium">{data.romMemory} / {data.ramMemory}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-black">IMEI:</p>
                <p className="text-black font-medium">{data.imei1}</p>
              </div>
            </div>
          </div>

          {/* 4️⃣ VALOR + DADOS DO PAGAMENTO */}
          <div className="space-y-2">
            {/* VALOR PAGO (WITH VISUAL EMPHASIS) */}
            <div className="border-2 border-black p-2 text-center">
              <p className="text-xs font-bold uppercase mb-1">Valor Pago</p>
              <p className="text-2xl font-black">R$ {data.saleValue.toFixed(2).replace(".", ",")}</p>
              <p className="text-xs font-medium mt-1">Por extenso: "{data.saleValueInWords.toLowerCase()}"</p>
            </div>
            
            {/* DADOS DO PAGAMENTO (FORMAL AND CONCISE) */}
            <div className="border-2 border-black p-2">
              <p className="text-xs font-extrabold text-black uppercase mb-1">Dados do Pagamento:</p>
              <p className="text-xs leading-tight">
                A importância acima descrita refere-se à compra de 01 (um) aparelho smartphone, conforme especificações constantes neste recibo.
              </p>
            </div>
          </div>

          {/* 5️⃣ OBSERVAÇÕES DA GARANTIA (WITH EMPHASIS) */}
          <div className="border-2 border-black p-2">
            <p className="text-xs font-extrabold text-black uppercase mb-1">Observações da Garantia</p>
            <p className="text-xs leading-tight">
              {getWarrantyText(data.warrantyDuration)}
            </p>
          </div>

          {/* 6️⃣ LOCAL, DATA E ASSINATURA (PROPORTIONAL SIGNATURE LINE) */}
          <div className="space-y-3">
            <div className="text-center">
              <p className="font-bold text-sm">{data.issueCity}, {data.issueDate}</p>
            </div>
            
            <div className="text-center pt-4">
              <div className="border-t border-black w-3/5 mx-auto h-0.5"></div>
              <p className="font-bold text-sm mt-1">{data.signatureName}</p>
            </div>
          </div>

          {/* 7️⃣ CONTATO DA EMPRESA (ULTRA COMPACT) */}
          <div className="text-center border-t-2 border-black pt-1">
            <p className="text-xs">
              Contato: WhatsApp {data.companyPhone2} | Tel. {data.companyPhone1} | Instagram @telecellmagazine
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
