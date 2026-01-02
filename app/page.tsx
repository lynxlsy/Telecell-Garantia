import { WarrantyForm } from "@/components/warranty-form"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, FolderOpen } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 space-y-4">
          <div className="flex justify-center mb-4">
            <Image
              src="/telecell-logo.png"
              alt="Telecell Magazine"
              width={250}
              height={75}
              priority
              className="h-16 w-auto"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">TELECELL MAGAZINE - Recibos</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-balance">
            Gere recibos de garantia profissionais em poucos passos. Preencha os dados e baixe o documento em formato
            editável.
          </p>
          
          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Link href="/recibos">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3">
                <FolderOpen className="mr-2 h-5 w-5" />
                Ver Recibos Salvos
              </Button>
            </Link>
            <Button variant="outline" className="px-6 py-3">
              <FileText className="mr-2 h-5 w-5" />
              Novo Recibo
            </Button>
          </div>
        </div>

        {/* Form */}
        <WarrantyForm />

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>© 2025 Telecell Magazine - Todos os direitos reservados</p>
        </div>
      </div>
    </main>
  )
}
