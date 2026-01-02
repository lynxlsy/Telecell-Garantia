"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Printer, ArrowLeft } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { getAllWarrantyReceipts, WarrantyReceipt } from "@/lib/firebase"
import Image from "next/image"
import { ptBR } from "date-fns/locale"
import { format } from "date-fns"

export default function VisualizarReciboPage() {
  const { id } = useParams()
  const router = useRouter()
  const [receipt, setReceipt] = useState<WarrantyReceipt | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        setLoading(true)
        const allReceipts = await getAllWarrantyReceipts()
        const foundReceipt = allReceipts.find(r => r.id === id)
        
        if (foundReceipt) {
          setReceipt(foundReceipt)
        } else {
          setError("Recibo não encontrado")
        }
      } catch (err) {
        console.error("Erro ao buscar recibo:", err)
        setError("Erro ao carregar o recibo")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchReceipt()
    }
  }, [id])

  const handlePrint = () => {
    window.print()
  }

  const getWarrantyText = (warrantyDuration: string): string => {
    // Parse the warranty duration string to extract months and days
    // Expected format: "X meses (Y dias)" where X is months and Y is days
    const monthsMatch = warrantyDuration.match(/(\d+)\s*meses?/);
    const daysMatch = warrantyDuration.match(/\((\d+)\s*dias?\)/);
    
    const months = monthsMatch ? parseInt(monthsMatch[1]) : 12;
    const days = daysMatch ? parseInt(daysMatch[1]) : months * 30;
    
    return `Garantia válida por ${months} meses (${days} dias). Não cobre impacto, oxidação ou qualquer dano provocado por mau uso do aparelho.`;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Carregando recibo...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg max-w-md">
          <h2 className="text-xl font-bold text-red-800 mb-2">Erro</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => router.push('/recibos')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Lista
          </Button>
        </div>
      </div>
    )
  }

  if (!receipt) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-8 bg-gray-50 border border-gray-200 rounded-lg max-w-md">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Nenhum Recibo</h2>
          <p className="text-gray-600 mb-4">Recibo não encontrado</p>
          <Button onClick={() => router.push('/recibos')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Lista
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4">
      <div className="flex justify-between items-center">
        <Button onClick={() => router.push('/recibos')} variant="outline" size="lg">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700" size="lg">
          <Printer className="mr-2 h-4 w-4" />
          Imprimir Recibo
        </Button>
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
              <p className="font-bold">{receipt.companyName} – {receipt.companyLegalName}</p>
              <p className="text-xs">CNPJ: {receipt.companyCNPJ} | IE: {receipt.companyStateRegistration}</p>
              <p className="text-xs">{receipt.companyAddress}</p>
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
                <p className="text-black font-medium">{receipt.customerName}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-black">{receipt.cpf ? 'CPF:' : receipt.cnpj ? 'CNPJ:' : 'Documento:'}</p>
                <p className="text-black font-medium">{receipt.cpf || receipt.cnpj}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-black">Telefone:</p>
                <p className="text-black font-medium">{receipt.phone}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-black">Cidade/UF:</p>
                <p className="text-black font-medium">{receipt.city}/{receipt.state}</p>
              </div>
            </div>
          </div>

          {/* 3️⃣ DADOS DO SMARTPHONE (WITH VISUAL EMPHASIS) */}
          <div className="border-2 border-black p-2 bg-gray-50">
            <p className="text-xs font-extrabold text-black uppercase mb-1">Dados do Smartphone</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="col-span-2">
                <p className="text-xs font-medium text-black">Marca / Modelo:</p>
                <p className="text-black font-medium">{receipt.brand} {receipt.model}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-black">Memória:</p>
                <p className="text-black font-medium">{receipt.romMemory} / {receipt.ramMemory}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-black">IMEI:</p>
                <p className="text-black font-medium">{receipt.imei1}</p>
              </div>
            </div>
          </div>

          {/* 4️⃣ VALOR + DADOS DO PAGAMENTO */}
          <div className="space-y-2">
            {/* VALOR PAGO (WITH VISUAL EMPHASIS) */}
            <div className="border-2 border-black p-2 text-center">
              <p className="text-xs font-bold uppercase mb-1">Valor Pago</p>
              <p className="text-2xl font-black">R$ {receipt.saleValue.toFixed(2).replace(".", ",")}</p>
              <p className="text-xs font-medium mt-1">Por extenso: "{receipt.saleValueInWords.toLowerCase()}"</p>
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
              {getWarrantyText(receipt.warrantyDuration)}
            </p>
          </div>

          {/* 5.5️⃣ OBSERVAÇÕES ADICIONAIS (IF EXISTS) */}
          {receipt.observations && (
            <div className="border-2 border-black p-2">
              <p className="text-xs font-extrabold text-black uppercase mb-1">Observações</p>
              <p className="text-xs leading-tight">
                {receipt.observations}
              </p>
            </div>
          )}

          {/* 6️⃣ LOCAL, DATA E ASSINATURA (PROPORTIONAL SIGNATURE LINE) */}
          <div className="space-y-3">
            <div className="text-center">
              <p className="font-bold text-sm">{receipt.issueCity}, {receipt.issueDate}</p>
            </div>
            
            <div className="text-center pt-4">
              <div className="border-t border-black w-3/5 mx-auto h-0.5"></div>
              <p className="font-bold text-sm mt-1">{receipt.signatureName}</p>
            </div>
          </div>

          {/* 7️⃣ CONTATO DA EMPRESA (ULTRA COMPACT) */}
          <div className="text-center border-t-2 border-black pt-1">
            <p className="text-xs">
              Contato: WhatsApp {receipt.companyPhone2} | Tel. {receipt.companyPhone1} | Instagram @telecellmagazine
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}