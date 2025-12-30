import { NextRequest } from 'next/server'
import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  ShadingType,
} from 'docx'
import { Packer } from 'docx'

interface WarrantyData {
  // Customer
  customerName: string
  cpf: string
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

function createInfoCell(label: string, value: string, width: number, mono = false): TableCell {
  return new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE },
    margins: { top: 150, bottom: 150, left: 200, right: 200 },
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: `${label}: `,
            bold: true,
            size: 22,
            color: '374151',
          }),
          new TextRun({
            text: value,
            size: 22,
            color: '1F2937',
            font: mono ? 'Courier New' : undefined,
          }),
        ],
      }),
    ],
  })
}

function getWarrantyText(warrantyDuration: string): string {
  // Parse the warranty duration string to extract months
  // Expected format: "X meses (Y dias)" where X is months and Y is days
  const monthsMatch = warrantyDuration.match(/(\d+)\s*meses?/);
  const months = monthsMatch ? parseInt(monthsMatch[1]) : 12;
  
  // Calculate days based on months (using 30 days per month as standard)
  const days = months * 30;
  
  return `Garantia válida por ${months} meses (${days} dias). Não cobre impacto, oxidação ou qualquer dano provocado por mau uso do aparelho.`;
}

export async function POST(request: NextRequest) {
  try {
    const data: WarrantyData = await request.json()

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 720,
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          children: [
            // BLACK HEADER
            new Paragraph({
              children: [
                new TextRun({
                  text: data.companyName.toUpperCase(),
                  bold: true,
                  size: 28,
                  color: 'FFFFFF',
                }),
                new TextRun({
                  text: ' - RECIBO DE GARANTIA',
                  bold: true,
                  size: 28,
                  color: 'FFFFFF',
                }),
              ],
              shading: {
                fill: '000000',
              },
              alignment: AlignmentType.CENTER,
            }),

            new Paragraph({
              spacing: { after: 200 },
              children: [new TextRun('')],
            }),

            // DADOS DO BENEFICIÁRIO
            new Paragraph({
              children: [
                new TextRun({
                  text: 'DADOS DO BENEFICIÁRIO',
                  bold: true,
                  size: 26,
                  color: '000000',
                }),
              ],
              spacing: { before: 300, after: 200 },
            }),

            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1, color: '4B5563' },
                bottom: { style: BorderStyle.SINGLE, size: 1, color: '4B5563' },
                left: { style: BorderStyle.SINGLE, size: 1, color: '4B5563' },
                right: { style: BorderStyle.SINGLE, size: 1, color: '4B5563' },
                insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: '9CA3AF' },
                insideVertical: { style: BorderStyle.SINGLE, size: 1, color: '9CA3AF' },
              },
              rows: [
                new TableRow({
                  children: [createInfoCell('Nome', data.customerName, 50), createInfoCell('CPF', data.cpf, 50)],
                }),
                new TableRow({
                  children: [
                    createInfoCell('Telefone', data.phone, 50),
                    createInfoCell('Cidade / Estado', `${data.city} - ${data.state}`, 50),
                  ],
                }),
              ],
            }),

            // DADOS DO SMARTPHONE
            new Paragraph({
              children: [
                new TextRun({
                  text: 'DADOS DO SMARTPHONE',
                  bold: true,
                  size: 26,
                  color: '000000',
                }),
              ],
              spacing: { before: 400, after: 200 },
            }),

            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1, color: '4B5563' },
                bottom: { style: BorderStyle.SINGLE, size: 1, color: '4B5563' },
                left: { style: BorderStyle.SINGLE, size: 1, color: '4B5563' },
                right: { style: BorderStyle.SINGLE, size: 1, color: '4B5563' },
                insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: '9CA3AF' },
                insideVertical: { style: BorderStyle.SINGLE, size: 1, color: '9CA3AF' },
              },
              rows: [
                new TableRow({
                  children: [createInfoCell('Marca', data.brand, 50), createInfoCell('Modelo', data.model, 50)],
                }),
                new TableRow({
                  children: [createInfoCell('ROM', data.romMemory, 50), createInfoCell('RAM', data.ramMemory, 50)],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 100, type: WidthType.PERCENTAGE },
                      columnSpan: 2,
                      margins: { top: 150, bottom: 150, left: 200, right: 200 },
                      shading: { fill: 'F3F4F6', type: ShadingType.SOLID },
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: 'IMEI 1: ',
                              bold: true,
                              size: 22,
                              color: '374151',
                            }),
                            new TextRun({
                              text: data.imei1,
                              size: 22,
                              color: '1F2937',
                              font: 'Courier New',
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                ...(data.imei2
                  ? [
                      new TableRow({
                        children: [
                          new TableCell({
                            width: { size: 100, type: WidthType.PERCENTAGE },
                            columnSpan: 2,
                            margins: { top: 150, bottom: 150, left: 200, right: 200 },
                            shading: { fill: 'F9FAFB', type: ShadingType.SOLID },
                            children: [
                              new Paragraph({
                                children: [
                                  new TextRun({
                                    text: 'IMEI 2: ',
                                    bold: true,
                                    size: 22,
                                    color: '374151',
                                  }),
                                  new TextRun({
                                    text: data.imei2,
                                    size: 22,
                                    color: '1F2937',
                                    font: 'Courier New',
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    ]
                  : []),
              ],
            }),

            // DADOS DO PAGAMENTO
            new Paragraph({
              children: [
                new TextRun({
                  text: 'DADOS DO PAGAMENTO',
                  bold: true,
                  size: 26,
                  color: '000000',
                }),
              ],
              spacing: { before: 400, after: 200 },
            }),

            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1, color: '4B5563' },
                bottom: { style: BorderStyle.SINGLE, size: 1, color: '4B5563' },
                left: { style: BorderStyle.SINGLE, size: 1, color: '4B5563' },
                right: { style: BorderStyle.SINGLE, size: 1, color: '4B5563' },
                insideHorizontal: { style: BorderStyle.NONE },
                insideVertical: { style: BorderStyle.NONE },
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 100, type: WidthType.PERCENTAGE },
                      shading: { fill: 'FFFFFF', type: ShadingType.SOLID },
                      margins: { top: 200, bottom: 200, left: 250, right: 250 },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.JUSTIFIED,
                          spacing: { line: 360 },
                          children: [
                            new TextRun({
                              text: `A importância de (${data.saleValueInWords.toLowerCase()}), correspondente ao valor total pago, referente à compra de 01 (um) aparelho smartphone, com memória ${data.romMemory}ROM / ${data.ramMemory}RAM, marca ${data.brand}, modelo ${data.model}, IMEI ${data.imei1}${data.imei2 ? ` e IMEI ${data.imei2}` : ''}, conforme dados informados neste recibo.`,
                              size: 22,
                              color: '1F2937',
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),

            // WARRANTY OBSERVATION
            new Paragraph({
              children: [
                new TextRun({
                  text: 'OBSERVAÇÕES DA GARANTIA',
                  bold: true,
                  size: 26,
                  color: '000000',
                }),
              ],
              spacing: { before: 400, after: 200 },
            }),

            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 2, color: '000000' },
                bottom: { style: BorderStyle.SINGLE, size: 2, color: '000000' },
                left: { style: BorderStyle.SINGLE, size: 2, color: '000000' },
                right: { style: BorderStyle.SINGLE, size: 2, color: '000000' },
                insideHorizontal: { style: BorderStyle.NONE },
                insideVertical: { style: BorderStyle.NONE },
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 100, type: WidthType.PERCENTAGE },
                      shading: { fill: 'F3F4F6', type: ShadingType.SOLID },
                      margins: { top: 250, bottom: 250, left: 300, right: 300 },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.JUSTIFIED,
                          spacing: { line: 400 },
                          children: [
                            new TextRun({
                              text: getWarrantyText(data.warrantyDuration),
                              size: 24,
                              color: '1F2937',
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),

            ...(data.observations
              ? [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: 'OBSERVAÇÕES',
                        bold: true,
                        size: 26,
                        color: '000000',
                      }),
                    ],
                    spacing: { before: 400, after: 200 },
                  }),
                  new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 1, color: '4B5563' },
                      bottom: { style: BorderStyle.SINGLE, size: 1, color: '4B5563' },
                      left: { style: BorderStyle.SINGLE, size: 1, color: '4B5563' },
                      right: { style: BorderStyle.SINGLE, size: 1, color: '4B5563' },
                      insideHorizontal: { style: BorderStyle.NONE },
                      insideVertical: { style: BorderStyle.NONE },
                    },
                    rows: [
                      new TableRow({
                        children: [
                          new TableCell({
                            width: { size: 100, type: WidthType.PERCENTAGE },
                            shading: { fill: 'FAFAFA', type: ShadingType.SOLID },
                            margins: { top: 250, bottom: 250, left: 250, right: 250 },
                            children: [
                              new Paragraph({
                                alignment: AlignmentType.JUSTIFIED,
                                spacing: { line: 360 },
                                children: [
                                  new TextRun({
                                    text: data.observations,
                                    size: 22,
                                    color: '374151',
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ]
              : []),

            // LOCATION, DATE AND SIGNATURE
            new Paragraph({
              children: [
                new TextRun({
                  text: `${data.issueCity}, ${data.issueDate}`,
                  bold: true,
                  size: 22,
                  color: '000000',
                }),
              ],
              spacing: { before: 300, after: 150 },
            }),

            // Compact contact info - 2 lines max
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Contato: ',
                  bold: true,
                  size: 20,
                  color: '000000',
                }),
                new TextRun({
                  text: `WhatsApp ${data.companyPhone2} | Tel. ${data.companyPhone1} | Instagram @telecellmagazine`,
                  size: 20,
                  color: '000000',
                }),
              ],
              spacing: { before: 200, after: 100 },
              border: {
                top: {
                  color: '000000',
                  space: 1,
                  style: BorderStyle.SINGLE,
                  size: 6,
                },
              },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: data.companyAddress,
                  size: 18,
                  color: '000000',
                }),
              ],
              spacing: { after: 200 },
            }),
          ],
        },
      ],
    })

    const buffer = await Packer.toBuffer(doc) // This is the correct method for getting buffer from docx document in server environment
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })

    return new Response(blob, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="Recibo_Garantia_${data.customerName.replace(/\s+/g, '_')}.docx"`,
      },
    })
  } catch (error) {
    console.error('Error generating DOCX:', error)
    return new Response(JSON.stringify({ error: 'Failed to generate DOCX' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}