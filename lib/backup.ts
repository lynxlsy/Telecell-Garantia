import { WarrantyReceipt, getAllWarrantyReceipts, saveWarrantyReceipt } from "./firebase";

export interface BackupData {
  version: string;
  exportedAt: string;
  receipts: WarrantyReceipt[];
}

/**
 * Exporta todos os recibos salvos para um arquivo JSON
 * @returns Promise com os dados do backup como string JSON
 */
export async function exportReceipts(): Promise<string> {
  try {
    const receipts = await getAllWarrantyReceipts();
    
    // Remover o campo id do documento do Firestore, já que ele será gerado novamente na importação
    const sanitizedReceipts = receipts.map(receipt => {
      const { id, ...sanitizedReceipt } = receipt;
      return sanitizedReceipt;
    });
    
    const backupData: BackupData = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      receipts: sanitizedReceipts
    };
    
    return JSON.stringify(backupData, null, 2);
  } catch (error) {
    console.error("Erro ao exportar recibos:", error);
    throw new Error("Falha ao exportar os recibos. Por favor, tente novamente.");
  }
}

/**
 * Importa recibos de um arquivo de backup
 * @param backupData Dados do backup como string JSON
 * @returns Promise com o número de recibos importados
 */
export async function importReceipts(backupData: string): Promise<number> {
  try {
    const parsedData = JSON.parse(backupData) as BackupData;
    
    if (!parsedData.version || !parsedData.receipts) {
      throw new Error("Arquivo de backup inválido ou corrompido.");
    }
    
    let importedCount = 0;
    
    for (const receipt of parsedData.receipts) {
      try {
        // Salvar cada recibo individualmente no Firebase
        await saveWarrantyReceipt(receipt);
        importedCount++;
      } catch (error) {
        console.error("Erro ao importar recibo:", error);
        // Continuar com os próximos recibos mesmo se um falhar
        continue;
      }
    }
    
    return importedCount;
  } catch (error) {
    console.error("Erro ao importar recibos:", error);
    if (error instanceof SyntaxError) {
      throw new Error("Arquivo de backup inválido. Formato JSON incorreto.");
    }
    throw new Error("Falha ao importar os recibos. Por favor, verifique o arquivo e tente novamente.");
  }
}

/**
 * Faz o download do backup como arquivo JSON
 */
export function downloadBackup(backupData: string, filename: string = "backup-recibos.json"): void {
  const blob = new Blob([backupData], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  // Limpar
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Lê o conteúdo de um arquivo
 */
export function readBackupFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        resolve(content);
      } else {
        reject(new Error("Falha ao ler o arquivo de backup."));
      }
    };
    reader.onerror = () => {
      reject(new Error("Erro ao ler o arquivo de backup."));
    };
    reader.readAsText(file);
  });
}