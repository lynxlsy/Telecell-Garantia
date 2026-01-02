"use client"

import { ArrowLeft, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SavedReceiptsList } from "@/components/warranty-receipts-list"
import { WarrantyReceipt } from "@/lib/firebase"

export default function RecibosPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Recibos de Garantia Salvos
        </h1>
        <p className="text-lg text-gray-600">
          Visualize e imprima todos os recibos de garantia armazenados
        </p>
      </div>
      
      <SavedReceiptsList />
    </div>
  )
}