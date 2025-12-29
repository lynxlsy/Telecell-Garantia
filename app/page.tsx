import { WarrantyForm } from "@/components/warranty-form"
import Image from "next/image"

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
