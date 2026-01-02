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
  ImageRun,
  Header,
} from "docx"
// import { generateHalfPageWarrantyDocx } from "./generate-docx" // This import seems redundant as the function is defined in the same file.

export interface WarrantyData {
  // Customer
  customerName: string
  cpf?: string
  cnpj?: string
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

export async function generateWarrantyDocx(data: WarrantyData): Promise<Blob> {
  let logoBuffer: ArrayBuffer | undefined
  try {
    const response = await fetch("/images/telecell-magazine-logo-transparent.png")
    if (response.ok) {
      logoBuffer = await response.arrayBuffer()
    }
  } catch (error) {
    console.error("[v0] Failed to fetch logo:", error)
  }

  const createHeader = () => {
    return new Header({
      children: [
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.NONE },
            insideVertical: { style: BorderStyle.NONE },
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 25, type: WidthType.PERCENTAGE },
                  shading: { fill: "000000", type: ShadingType.SOLID },
                  margins: { top: 200, bottom: 200, left: 150, right: 100 },
                  verticalAlign: "center",
                  children: logoBuffer
                    ? [
                        new Paragraph({
                          alignment: AlignmentType.LEFT,
                          children: [
                            new ImageRun({
                              data: logoBuffer,
                              transformation: { width: 120, height: 40 },
                            }),
                          ],
                        }),
                      ]
                    : [
                        new Paragraph({
                          alignment: AlignmentType.LEFT,
                          children: [
                            new TextRun({
                              text: data.companyName.toUpperCase(),
                              bold: true,
                              size: 20,
                              color: "FFFFFF",
                            }),
                          ],
                        }),
                      ],
                }),
                new TableCell({
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  shading: { fill: "000000", type: ShadingType.SOLID },
                  margins: { top: 200, bottom: 200, left: 100, right: 100 },
                  verticalAlign: "center",
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: "RECIBO DE GARANTIA",
                          bold: true,
                          size: 28,
                          color: "FFFFFF",
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCell({
                  width: { size: 25, type: WidthType.PERCENTAGE },
                  shading: { fill: "000000", type: ShadingType.SOLID },
                  margins: { top: 200, bottom: 200, left: 100, right: 150 },
                  verticalAlign: "center",
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.RIGHT,
                      spacing: { line: 240 },
                      children: [
                        new TextRun({
                          text: `${data.companyName}\n`,
                          bold: true,
                          size: 18,
                          color: "FFFFFF",
                        }),
                        new TextRun({
                          text: `Razão Social: E dos Santos Silva\n`,
                          size: 14,
                          color: "D1D5DB",
                        }),
                        new TextRun({
                          text: `CNPJ: ${data.companyCNPJ}\n`,
                          size: 14,
                          color: "D1D5DB",
                        }),
                        new TextRun({
                          text: `I.E.: ${data.companyStateRegistration}\n`,
                          size: 14,
                          color: "D1D5DB",
                        }),
                        new TextRun({
                          text: `${data.companyAddress}\n`,
                          size: 13,
                          color: "D1D5DB",
                        }),
                        new TextRun({
                          text: data.companyPhone1,
                          size: 14,
                          bold: true,
                          color: "FFFFFF",
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    })
  }

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
        headers: {
          default: createHeader(),
        },
        children: [
          // CONTATO DA EMPRESA
          new Paragraph({
            spacing: { before: 300, after: 200 },
            children: [
              new TextRun({
                text: "CONTATO DA EMPRESA",
                bold: true,
                size: 26,
                color: "000000",
              }),
            ],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
              bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
              left: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
              right: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              // Company Details Row
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    margins: { top: 120, bottom: 80, left: 150, right: 150 },
                    children: [
                      new Paragraph({
                        spacing: { line: 240, after: 100 },
                        children: [
                          new TextRun({
                            text: "Endereço: ",
                            bold: true,
                            size: 20,
                            color: "000000",
                          }),
                          new TextRun({
                            text: data.companyAddress,
                            size: 20,
                            color: "000000",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              // Contact Channels Row
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    margins: { top: 80, bottom: 120, left: 150, right: 150 },
                    children: [
                      new Paragraph({
                        spacing: { line: 240 },
                        children: [
                          new TextRun({
                            text: "WhatsApp: ",
                            bold: true,
                            size: 20,
                            color: "000000",
                          }),
                          new TextRun({
                            text: `${data.companyPhone2}  |  `,
                            size: 20,
                            color: "000000",
                          }),
                          new TextRun({
                            text: "Tel: ",
                            bold: true,
                            size: 20,
                            color: "000000",
                          }),
                          new TextRun({
                            text: `${data.companyPhone1}  |  `,
                            size: 20,
                            color: "000000",
                          }),
                          new TextRun({
                            text: "Instagram: ",
                            bold: true,
                            size: 20,
                            color: "000000",
                          }),
                          new TextRun({
                            text: "@telecellmagazine",
                            size: 20,
                            color: "000000",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 200 },
            children: [new TextRun("")],
          }),

          // DADOS DO BENEFICIÁRIO
          new Paragraph({
            spacing: { before: 300, after: 200 },
            children: [
              new TextRun({
                text: "DADOS DO BENEFICIÁRIO",
                bold: true,
                size: 26,
                color: "000000",
              }),
            ],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: "4B5563" },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: "4B5563" },
              left: { style: BorderStyle.SINGLE, size: 1, color: "4B5563" },
              right: { style: BorderStyle.SINGLE, size: 1, color: "4B5563" },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "9CA3AF" },
              insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "9CA3AF" },
            },
            rows: [
              new TableRow({
                children: [createInfoCell("Nome", data.customerName, 50), createInfoCell(data.cpf ? 'CPF' : data.cnpj ? 'CNPJ' : 'Documento', data.cpf || data.cnpj || '', 50)],
              }),
              new TableRow({
                children: [
                  createInfoCell("Telefone", data.phone, 50),
                  createInfoCell("Cidade / Estado", `${data.city} - ${data.state}`, 50),
                ],
              }),
            ],
          }),

          // DADOS DO SMARTPHONE
          new Paragraph({
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: "DADOS DO SMARTPHONE",
                bold: true,
                size: 26,
                color: "000000",
              }),
            ],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: "4B5563" },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: "4B5563" },
              left: { style: BorderStyle.SINGLE, size: 1, color: "4B5563" },
              right: { style: BorderStyle.SINGLE, size: 1, color: "4B5563" },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "9CA3AF" },
              insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "9CA3AF" },
            },
            rows: [
              new TableRow({
                children: [createInfoCell("Marca", data.brand, 50), createInfoCell("Modelo", data.model, 50)],
              }),
              new TableRow({
                children: [createInfoCell("ROM", data.romMemory, 50), createInfoCell("RAM", data.ramMemory, 50)],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    columnSpan: 2,
                    margins: { top: 150, bottom: 150, left: 200, right: 200 },
                    shading: { fill: "F3F4F6", type: ShadingType.SOLID },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "IMEI 1: ",
                            bold: true,
                            size: 22,
                            color: "374151",
                          }),
                          new TextRun({
                            text: data.imei1,
                            size: 22,
                            color: "1F2937",
                            font: "Courier New",
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
                          shading: { fill: "F9FAFB", type: ShadingType.SOLID },
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: "IMEI 2: ",
                                  bold: true,
                                  size: 22,
                                  color: "374151",
                                }),
                                new TextRun({
                                  text: data.imei2,
                                  size: 22,
                                  color: "1F2937",
                                  font: "Courier New",
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
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: "DADOS DO PAGAMENTO",
                bold: true,
                size: 26,
                color: "000000",
              }),
            ],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: "4B5563" },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: "4B5563" },
              left: { style: BorderStyle.SINGLE, size: 1, color: "4B5563" },
              right: { style: BorderStyle.SINGLE, size: 1, color: "4B5563" },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    shading: { fill: "FFFFFF", type: ShadingType.SOLID },
                    margins: { top: 200, bottom: 200, left: 250, right: 250 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { line: 360 },
                        children: [
                          new TextRun({
                            text: `A importância de (${data.saleValueInWords.toLowerCase()}), correspondente ao valor total pago, referente à compra de 01 (um) aparelho smartphone, com memória ${data.romMemory}ROM / ${data.ramMemory}RAM, marca ${data.brand}, modelo ${data.model}, IMEI ${data.imei1}${data.imei2 ? ` e IMEI ${data.imei2}` : ""}, conforme dados informados neste recibo.`,
                            size: 22,
                            color: "1F2937",
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
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: "OBSERVAÇÕES DA GARANTIA",
                bold: true,
                size: 26,
                color: "000000",
              }),
            ],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
              bottom: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
              left: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
              right: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    shading: { fill: "F3F4F6", type: ShadingType.SOLID },
                    margins: { top: 250, bottom: 250, left: 300, right: 300 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { line: 400 },
                        children: [
                          new TextRun({
                            text: "Garantia válida por 365 dias (12 meses). A garantia não cobre impacto, oxidação ou qualquer dano provocado por mau uso do aparelho.",
                            size: 24,
                            color: "1F2937",
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
                  spacing: { before: 400, after: 200 },
                  children: [
                    new TextRun({
                      text: "OBSERVAÇÕES",
                      bold: true,
                      size: 26,
                      color: "000000",
                    }),
                  ],
                }),
                new Table({
                  width: { size: 100, type: WidthType.PERCENTAGE },
                  borders: {
                    top: { style: BorderStyle.SINGLE, size: 1, color: "4B5563" },
                    bottom: { style: BorderStyle.SINGLE, size: 1, color: "4B5563" },
                    left: { style: BorderStyle.SINGLE, size: 1, color: "4B5563" },
                    right: { style: BorderStyle.SINGLE, size: 1, color: "4B5563" },
                    insideHorizontal: { style: BorderStyle.NONE },
                    insideVertical: { style: BorderStyle.NONE },
                  },
                  rows: [
                    new TableRow({
                      children: [
                        new TableCell({
                          width: { size: 100, type: WidthType.PERCENTAGE },
                          shading: { fill: "FAFAFA", type: ShadingType.SOLID },
                          margins: { top: 250, bottom: 250, left: 250, right: 250 },
                          children: [
                            new Paragraph({
                              alignment: AlignmentType.JUSTIFIED,
                              spacing: { line: 360 },
                              children: [
                                new TextRun({
                                  text: data.observations,
                                  size: 22,
                                  color: "374151",
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
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: `${data.issueCity}, ${data.issueDate}`,
                bold: true,
                size: 22,
                color: "000000",
              }),
            ],
          }),

          // Compact contact info - 2 lines max
          new Paragraph({
            spacing: { before: 200, after: 100 },
            border: {
              top: {
                color: "000000",
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6,
              },
            },
            children: [
              new TextRun({
                text: "Contato: ",
                bold: true,
                size: 20,
                color: "000000",
              }),
              new TextRun({
                text: `WhatsApp ${data.companyPhone2} | Tel. ${data.companyPhone1} | Instagram @telecellmagazine`,
                size: 20,
                color: "000000",
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: data.companyAddress,
                size: 18,
                color: "000000",
              }),
            ],
          }),
        ],
      },
    ],
  })

  const blob = await doc.toBlob()
  return blob
}

export async function generateHalfPageWarrantyDocx(data: WarrantyData): Promise<Blob> {
  let logoBuffer: ArrayBuffer | undefined
  try {
    const response = await fetch("/images/telecell-magazine-logo-transparent.png")
    if (response.ok) {
      logoBuffer = await response.arrayBuffer()
    }
  } catch (error) {
    console.error("[v0] Failed to fetch logo:", error)
  }

  const createCompactHeader = (label: string, isCustomer: boolean) => {
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 20, type: WidthType.PERCENTAGE },
              shading: { fill: "000000", type: ShadingType.SOLID },
              margins: { top: 120, bottom: 120, left: 100, right: 60 },
              verticalAlign: "center",
              children: logoBuffer
                ? [
                    new Paragraph({
                      alignment: AlignmentType.LEFT,
                      children: [
                        new ImageRun({
                          data: logoBuffer,
                          transformation: { width: 90, height: 29 },
                        }),
                      ],
                    }),
                  ]
                : [
                    new Paragraph({
                      alignment: AlignmentType.LEFT,
                      children: [
                        new TextRun({
                          text: data.companyName.toUpperCase(),
                          bold: true,
                          size: 14,
                          color: "FFFFFF",
                        }),
                      ],
                    }),
                  ],
            }),
            new TableCell({
              width: { size: 35, type: WidthType.PERCENTAGE },
              shading: { fill: "000000", type: ShadingType.SOLID },
              margins: { top: 120, bottom: 120, left: 60, right: 60 },
              verticalAlign: "center",
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "RECIBO DE GARANTIA",
                      bold: true,
                      size: 18,
                      color: "FFFFFF",
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 45, type: WidthType.PERCENTAGE },
              shading: { fill: "000000", type: ShadingType.SOLID },
              margins: { top: 120, bottom: 120, left: 60, right: 100 },
              verticalAlign: "center",
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  spacing: { line: 240 },
                  children: [
                    new TextRun({
                      text: `${data.companyName}\n`,
                      bold: true,
                      size: 12,
                      color: "FFFFFF",
                    }),
                    new TextRun({
                      text: `${data.companyLegalName}\n`,
                      size: 10,
                      color: "D1D5DB",
                    }),
                    new TextRun({
                      text: `CNPJ: ${data.companyCNPJ} | IE: ${data.companyStateRegistration}\n`,
                      size: 9,
                      color: "D1D5DB",
                    }),
                    new TextRun({
                      text: `${data.companyAddress}\n`,
                      size: 9,
                      color: "D1D5DB",
                    }),
                    new TextRun({
                      text: `${data.companyPhone1} | ${data.companyPhone2}`,
                      size: 9,
                      color: "D1D5DB",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    })
  }

  const createCompactInfoCell = (label: string, value: string, width: number, mono = false): TableCell => {
    return new TableCell({
      width: { size: width, type: WidthType.PERCENTAGE },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      shading: { fill: "FAFAFA", type: ShadingType.SOLID },
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: `${label} `,
              bold: true,
              size: 16,
              color: "374151",
            }),
            new TextRun({
              text: value,
              size: 16,
              color: "1F2937",
              font: mono ? "Courier New" : undefined,
            }),
          ],
        }),
      ],
    })
  }

  // Customer Copy (simplified)
  const customerCopy = [
    createCompactHeader("Via do Cliente", true),

    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 80, after: 100 },
      children: [
        new TextRun({
          text: "VIA DO CLIENTE",
          bold: true,
          size: 12,
          color: "6B7280",
        }),
      ],
    }),

    new Paragraph({
      spacing: { before: 50, after: 50 },
      children: [
        new TextRun({
          text: "DADOS DO BENEFICIÁRIO",
          bold: true,
          size: 14,
          color: "1F2937",
        }),
      ],
    }),

    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
        left: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
        right: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
      },
      rows: [
        new TableRow({
          children: [
            createCompactInfoCell("Nome:", data.customerName, 70),
            createCompactInfoCell(data.cpf ? 'CPF:' : data.cnpj ? 'CNPJ:' : 'Documento:', data.cpf || data.cnpj || '', 30, true),
          ],
        }),
        new TableRow({
          children: [
            createCompactInfoCell("Cidade/Estado:", `${data.city} / ${data.state}`, 50),
            createCompactInfoCell("Telefone:", data.phone, 50),
          ],
        }),
      ],
    }),

    new Paragraph({
      spacing: { before: 120, after: 50 },
      children: [
        new TextRun({
          text: "DADOS DO PAGAMENTO",
          bold: true,
          size: 14,
          color: "1F2937",
        }),
      ],
    }),

    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 2, color: "DC2626" },
        bottom: { style: BorderStyle.SINGLE, size: 2, color: "DC2626" },
        left: { style: BorderStyle.SINGLE, size: 2, color: "DC2626" },
        right: { style: BorderStyle.SINGLE, size: 2, color: "DC2626" },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 40, type: WidthType.PERCENTAGE },
              shading: { fill: "FEF2F2", type: ShadingType.SOLID },
              margins: { top: 100, bottom: 100, left: 150, right: 100 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: "Valor:",
                      bold: true,
                      size: 20,
                      color: "991B1B",
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 60, type: WidthType.PERCENTAGE },
              shading: { fill: "FEF2F2", type: ShadingType.SOLID },
              margins: { top: 100, bottom: 100, left: 100, right: 150 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: `R$ ${data.saleValue.toFixed(2).replace(".", ",")}`,
                      bold: true,
                      size: 24,
                      color: "DC2626",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),

    new Paragraph({
      spacing: { before: 120, after: 50 },
      children: [
        new TextRun({
          text: "DADOS DO SMARTPHONE",
          bold: true,
          size: 14,
          color: "1F2937",
        }),
      ],
    }),

    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
        left: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
        right: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
      },
      rows: [
        new TableRow({
          children: [createCompactInfoCell("Produto:", "Smartphone", 100)],
        }),
        new TableRow({
          children: [createCompactInfoCell("Marca:", data.brand, 50), createCompactInfoCell("Modelo:", data.model, 50)],
        }),
        new TableRow({
          children: [
            createCompactInfoCell("Memória ROM:", data.romMemory, 50),
            createCompactInfoCell("Memória RAM:", data.ramMemory, 50),
          ],
        }),
        new TableRow({
          children: [
            createCompactInfoCell("IMEI 1:", data.imei1, 50, true),
            createCompactInfoCell("IMEI 2:", data.imei2 || "Não informado", 50, true),
          ],
        }),
      ],
    }),

    new Paragraph({
      spacing: { before: 120, after: 80 },
      children: [new TextRun({ text: "" })],
    }),

    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 3, color: "F59E0B" },
        bottom: { style: BorderStyle.SINGLE, size: 3, color: "F59E0B" },
        left: { style: BorderStyle.SINGLE, size: 3, color: "F59E0B" },
        right: { style: BorderStyle.SINGLE, size: 3, color: "F59E0B" },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: "FEF9C3", type: ShadingType.SOLID },
              margins: { top: 150, bottom: 150, left: 200, right: 200 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { line: 300 },
                  children: [
                    new TextRun({
                      text: "⚠ OBSERVAÇÃO\n\n",
                      bold: true,
                      size: 16,
                      color: "92400E",
                    }),
                    new TextRun({
                      text: "Garantia válida por 365 dias (12 meses).\n",
                      bold: true,
                      size: 16,
                      color: "92400E",
                    }),
                    new TextRun({
                      text: "A garantia não cobre impacto, oxidação ou qualquer dano provocado por mau uso do aparelho.",
                      size: 14,
                      color: "78350F",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),

    new Paragraph({
      spacing: { before: 150, after: 50 },
      children: [new TextRun("")],
    }),

    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              margins: { top: 0, bottom: 0, left: 0, right: 0 },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
              },
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: `${data.issueCity}, ${data.issueDate}`,
                      bold: true,
                      size: 16,
                      color: "000000",
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              margins: { top: 0, bottom: 0, left: 0, right: 0 },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
              },
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  spacing: { before: 200 },
                  children: [
                    new TextRun({
                      text: "_".repeat(35),
                      size: 16,
                      color: "6B7280",
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  spacing: { before: 50 },
                  children: [
                    new TextRun({
                      text: data.signatureName,
                      bold: true,
                      size: 14,
                      color: "1F2937",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),

    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100 },
      children: [
        new TextRun({
          text: "Via do Cliente",
          size: 11,
          color: "9CA3AF",
          italics: true,
        }),
      ],
    }),
  ]

  // Divider line
  const divider = [
    new Paragraph({
      spacing: { before: 200, after: 200 },
      border: {
        top: {
          style: BorderStyle.DASH_DOT_STROKED,
          size: 6,
          color: "9CA3AF",
        },
      },
      children: [new TextRun({ text: "" })],
    }),
  ]

  // Store Copy (complete)
  const storeCopy = [
    createCompactHeader("Via do Lojista", false),

    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 150 },
      children: [
        new TextRun({
          text: "VIA DO LOJISTA – USO INTERNO / CONTABILIZAÇÃO",
          bold: true,
          size: 14,
          color: "DC2626",
        }),
      ],
    }),

    // Customer and product in compact grid
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
        left: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
        right: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
      },
      rows: [
        new TableRow({
          children: [
            createCompactInfoCell("Cliente:", data.customerName, 60),
            createCompactInfoCell(data.cpf ? 'CPF:' : data.cnpj ? 'CNPJ:' : 'Documento:', data.cpf || data.cnpj || '', 40),
          ],
        }),
        new TableRow({
          children: [
            createCompactInfoCell("Telefone:", data.phone, 40),
            createCompactInfoCell("Cidade:", `${data.city} - ${data.state}`, 60),
          ],
        }),
        new TableRow({
          children: [createCompactInfoCell("Marca:", data.brand, 40), createCompactInfoCell("Modelo:", data.model, 60)],
        }),
        new TableRow({
          children: [
            createCompactInfoCell("ROM:", data.romMemory, 25),
            createCompactInfoCell("RAM:", data.ramMemory, 25),
            createCompactInfoCell("IMEI 1:", data.imei1, 50, true),
          ],
        }),
        ...(data.imei2
          ? [
              new TableRow({
                children: [
                  createCompactInfoCell("IMEI 2:", data.imei2, 50, true),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    shading: { fill: "F9FAFB", type: ShadingType.SOLID },
                    children: [new Paragraph({ text: "" })],
                  }),
                ],
              }),
            ]
          : []),
      ],
    }),

    new Paragraph({
      spacing: { before: 150, after: 100 },
      children: [new TextRun({ text: "" })],
    }),

    // Value
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 2, color: "DC2626" },
        bottom: { style: BorderStyle.SINGLE, size: 2, color: "DC2626" },
        left: { style: BorderStyle.SINGLE, size: 2, color: "DC2626" },
        right: { style: BorderStyle.SINGLE, size: 2, color: "DC2626" },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 40, type: WidthType.PERCENTAGE },
              shading: { fill: "FEF2F2", type: ShadingType.SOLID },
              margins: { top: 100, bottom: 100, left: 150, right: 100 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: "Valor:",
                      bold: true,
                      size: 20,
                      color: "991B1B",
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 60, type: WidthType.PERCENTAGE },
              shading: { fill: "FEF2F2", type: ShadingType.SOLID },
              margins: { top: 100, bottom: 100, left: 100, right: 150 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: `R$ ${data.saleValue.toFixed(2).replace(".", ",")}`,
                      bold: true,
                      size: 24,
                      color: "DC2626",
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
            spacing: { before: 150, after: 80 },
            children: [
              new TextRun({
                text: "OBS: ",
                bold: true,
                size: 14,
              }),
              new TextRun({
                text: data.observations,
                size: 14,
                color: "374151",
              }),
            ],
          }),
        ]
      : []),

    new Paragraph({
      spacing: { before: 150, after: 80 },
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({
          text: `${data.issueCity}, ${data.issueDate}`,
          bold: true,
          size: 18,
          color: "000000",
        }),
      ],
    }),

    new Paragraph({
      spacing: { before: 200, after: 50 },
      alignment: AlignmentType.RIGHT,
      children: [
        new TextRun({
          text: "_".repeat(40),
          size: 16,
          color: "6B7280",
        }),
      ],
    }),

    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: data.signatureName,
          bold: true,
          size: 16,
          color: "1F2937",
        }),
      ],
    }),
  ]

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              right: 1440,
              bottom: 720,
              left: 1440,
            },
          },
        },
        children: [...customerCopy, ...divider, ...storeCopy],
      },
    ],
  })

  const blob = await doc.toBlob()
  return blob
}

function createInfoCell(label: string, value: string, width: number, mono = false): TableCell {
  return new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE },
    margins: { top: 150, bottom: 150, left: 200, right: 200 },
    shading: { fill: "FAFAFA", type: ShadingType.SOLID },
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: `${label} `,
            bold: true,
            size: 22,
            color: "374151",
          }),
          new TextRun({
            text: value,
            size: 22,
            color: "1F2937",
            font: mono ? "Courier New" : undefined,
          }),
        ],
      }),
    ],
  })
}
