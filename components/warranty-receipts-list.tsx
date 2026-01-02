"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RefreshCw, Eye, Download, Calendar, Phone, MapPin, Printer, Trash2, Search, X, Filter, Upload, Download as DownloadIcon } from "lucide-react"
import { getAllWarrantyReceipts, WarrantyReceipt, deleteWarrantyReceipt } from "@/lib/firebase"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"
import { toast } from "sonner"
import { exportReceipts, importReceipts, downloadBackup as downloadBackupFile, readBackupFile } from "@/lib/backup"

interface SavedReceiptsListProps {
  onReceiptSelect?: (receipt: WarrantyReceipt) => void
}

export function SavedReceiptsList({ onReceiptSelect }: SavedReceiptsListProps) {
  const [receipts, setReceipts] = useState<WarrantyReceipt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  // Função para converter timestamp do Firebase para Date
  const convertTimestampToDate = (timestamp: any): Date | null => {
    try {
      if (timestamp?.toDate) {
        return timestamp.toDate();
      } else if (timestamp instanceof Date) {
        return timestamp;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  // Filtrar recibos com base nos critérios
  const filteredReceipts = useMemo(() => {
    return receipts.filter(receipt => {
      // Filtro de busca
      const matchesSearch = !searchTerm || 
        receipt.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.cpf?.includes(searchTerm) ||
        receipt.cnpj?.includes(searchTerm) ||
        receipt.phone.includes(searchTerm) ||
        receipt.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.romMemory.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.ramMemory.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro de data
      let matchesDate = true;
      if (startDate || endDate) {
        const receiptDate = convertTimestampToDate(receipt.createdAt);
        if (receiptDate) {
          const start = startDate ? new Date(startDate) : null;
          const end = endDate ? new Date(endDate) : null;
          
          if (start && receiptDate < start) matchesDate = false;
          if (end && receiptDate > end) matchesDate = false;
        } else {
          matchesDate = false;
        }
      }

      return matchesSearch && matchesDate;
    });
  }, [receipts, searchTerm, startDate, endDate]);

  // Limpar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
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

  const handleDelete = async (receiptId: string, customerName: string) => {
    if (confirm(`Tem certeza que deseja excluir o recibo de ${customerName}? Esta ação não pode ser desfeita.`)) {
      try {
        await deleteWarrantyReceipt(receiptId);
        toast.success(`Recibo de ${customerName} excluído com sucesso!`);
        loadReceipts(); // Recarrega a lista após exclusão
      } catch (error) {
        console.error("Erro ao excluir recibo:", error);
        toast.error("Erro ao excluir o recibo. Por favor, tente novamente.");
      }
    }
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

  if (receipts.length === 0 && !loading) {
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
      {/* Barra de Busca e Filtros */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por ID, nome, CPF, CNPJ, telefone, marca, modelo, memória ROM ou RAM..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Button 
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className={`${showFilters ? "bg-gray-100" : ""}`}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filtros Avançados
          </Button>
          
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        </div>

        {/* Filtros Avançados */}
        {showFilters && (
          <Card className="p-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Filtros Avançados</h3>
                <Button 
                  onClick={clearFilters}
                  variant="ghost" 
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="mr-1 h-4 w-4" />
                  Limpar Filtros
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-sm font-medium">
                    Data Inicial
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    max={endDate || undefined}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-sm font-medium">
                    Data Final
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || undefined}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button 
            onClick={async () => {
              setIsExporting(true);
              try {
                const backupData = await exportReceipts();
                downloadBackupFile(backupData);
                toast.success("Backup exportado com sucesso!");
              } catch (error) {
                console.error("Erro ao exportar recibos:", error);
                toast.error("Erro ao exportar recibos. Por favor, tente novamente.");
              } finally {
                setIsExporting(false);
              }
            }}
            variant="default"
            disabled={isExporting}
          >
            <DownloadIcon className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button 
            onClick={() => {
              fileInputRef.current?.click();
            }}
            variant="outline"
            disabled={isImporting}
          >
            <Upload className="mr-2 h-4 w-4" />
            Importar
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".json"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                setIsImporting(true);
                try {
                  const backupData = await readBackupFile(file);
                  const importedCount = await importReceipts(backupData);
                  toast.success(`${importedCount} recibos importados com sucesso!`);
                  loadReceipts();
                } catch (error) {
                  console.error("Erro ao importar recibos:", error);
                  toast.error(error instanceof Error ? error.message : "Erro ao importar recibos. Por favor, tente novamente.");
                } finally {
                  setIsImporting(false);
                }
              }
            }}
          />
        </div>
      </div>

      {/* Cabeçalho com contagem */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Recibos Salvos
          </h2>
          <p className="text-gray-600">
            {filteredReceipts.length} de {receipts.length} recibos encontrados
            {searchTerm && ` (buscando por "${searchTerm}")`}
            {(startDate || endDate) && ` (filtrados por data)`}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredReceipts.map((receipt) => (
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
                  <span className="text-gray-600">Memória:</span>
                  <span className="font-medium">{receipt.romMemory}/{receipt.ramMemory}</span>
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
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex-1"
                  onClick={() => receipt.id && handleDelete(receipt.id, receipt.customerName || 'cliente')}
                  title="Excluir recibo"
                >
                  <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}