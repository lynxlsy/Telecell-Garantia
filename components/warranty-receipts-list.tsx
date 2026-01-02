"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Eye, Download, Calendar, Phone, MapPin, Printer } from "lucide-react"
import { getAllWarrantyReceipts, WarrantyReceipt } from "@/lib/firebase"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"

interface SavedReceiptsListProps {
  onReceiptSelect?: (receipt: WarrantyReceipt) => void
}

export function SavedReceiptsList({ onReceiptSelect }: SavedReceiptsListProps) {
  const [receipts, setReceipts] = useState<WarrantyReceipt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadReceipts = async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedReceipts = await getAllWarrantyReceipts()
      setReceipts(fetchedReceipts)
    } catch (err) {
      console.error("Erro ao carregar recibos:", err)
      setError("Erro ao carregar recibos salvos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReceipts()
  }, [])

  const formatDate = (timestamp: any) => {
    try {
      if (timestamp?.toDate) {
        return format(timestamp.toDate(), "dd/MM/yyyy HH:mm", { locale: ptBR })
      }
      return "Data não disponível"
    } catch (error) {
      return "Data inválida"
    }
  }

  const handleRefresh = () => {
    loadReceipts()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando recibos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            <span>❌</span>
            Erro ao Carregar Recibos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (receipts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-gray-500">
            Nenhum Recibo Encontrado
          </CardTitle>
          <CardDescription className="text-center">
            Ainda não há recibos salvos no sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Recibos Salvos ({receipts.length})
        </h2>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {receipts.map((receipt) => (
          <Card key={receipt.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-1">
                  {receipt.customerName}
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {receipt.productType}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-1 text-sm">
                <MapPin className="h-3 w-3" />
                {receipt.city}, {receipt.state}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Marca:</span>
                  <span className="font-medium">{receipt.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Modelo:</span>
                  <span className="font-medium">{receipt.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valor:</span>
                  <span className="font-bold text-green-600">
                    R$ {receipt.saleValue.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Garantia:</span>
                  <span className="font-medium">{receipt.warrantyDuration}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                  <Calendar className="h-3 w-3" />
                  <span>Salvo em: {formatDate(receipt.createdAt)}</span>
                </div>
                
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Phone className="h-3 w-3" />
                  <span>{receipt.phone}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <Link href={`/recibos/visualizar/${receipt.id}`}>
                  <Button 
                    size="sm" 
                    className="flex-1"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Detalhes
                  </Button>
                </Link>
                <Link href={`/recibos/visualizar/${receipt.id}`}>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1"
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}