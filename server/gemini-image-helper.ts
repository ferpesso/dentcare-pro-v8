/**
 * Helper para análise de imagens usando Google Gemini diretamente
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

export interface AnaliseImagem {
  tipoImagem: string;
  qualidade: string;
  problemasDetectados: string[];
  observacoes: string[];
  recomendacoes: string[];
  nivelUrgencia: "baixo" | "medio" | "alto";
  relatorioCompleto: string;
}

export async function analisarImagemComGemini(dados: {
  imagemBase64: string;
  tipoImagem: string;
  contexto?: string;
}): Promise<AnaliseImagem> {
  console.log("🤖 [Gemini] Iniciando análise de imagem...");
  console.log("📊 [Gemini] Tipo:", dados.tipoImagem);
  console.log("📊 [Gemini] Tamanho base64:", dados.imagemBase64.length);

  // Verificar se a chave API está configurada
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY não está configurada");
  }

  console.log("✅ [Gemini] API Key encontrada");

  // Inicializar o cliente Gemini
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash-exp",
    generationConfig: {
      temperature: 0.4,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    },
  });

  console.log("✅ [Gemini] Modelo inicializado");

  const prompt = `Você é um especialista em radiologia dentária e análise de imagens odontológicas. Analise esta imagem dentária em detalhes.

**Tipo de imagem:** ${dados.tipoImagem}
${dados.contexto ? `**Contexto:** ${dados.contexto}` : ""}

Por favor, forneça uma análise completa incluindo:

1. **Identificação do tipo de imagem** (raio-X periapical, panorâmica, bite-wing, foto intraoral, etc.)
2. **Avaliação da qualidade** da imagem (excelente, boa, regular, ruim)
3. **Problemas detectados** (cáries, fraturas, infecções, perda óssea, restaurações defeituosas, etc.)
4. **Observações gerais** sobre a saúde bucal visível
5. **Recomendações** de tratamento ou exames adicionais
6. **Nível de urgência** (baixo, médio, alto)
7. **Relatório completo** em formato narrativo

Responda APENAS com um objeto JSON válido (sem markdown, sem \`\`\`json) com as seguintes chaves:
{
  "tipoImagem": "string",
  "qualidade": "string",
  "problemasDetectados": ["string"],
  "observacoes": ["string"],
  "recomendacoes": ["string"],
  "nivelUrgencia": "baixo" | "medio" | "alto",
  "relatorioCompleto": "string (relatório narrativo completo)"
}

IMPORTANTE: Seja específico e técnico, mas também claro. Se não conseguir identificar algo com certeza, mencione isso. Sempre indique que esta é uma análise preliminar e que um profissional deve fazer o diagnóstico final.`;

  // Extrair apenas a parte base64 da string (remover prefixo data:image/...)
  let base64Data = dados.imagemBase64;
  if (base64Data.includes(',')) {
    base64Data = base64Data.split(',')[1];
    console.log("📊 [Gemini] Removido prefixo data:image");
  }

  console.log("🚀 [Gemini] Enviando requisição...");

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data,
        },
      },
    ]);

    console.log("✅ [Gemini] Resposta recebida");

    const response = result.response;
    const text = response.text();
    
    console.log("📊 [Gemini] Tamanho da resposta:", text.length);

    // Parse do JSON
    const analise = JSON.parse(text) as AnaliseImagem;
    
    console.log("✅ [Gemini] JSON parseado com sucesso");
    console.log("📊 [Gemini] Problemas detectados:", analise.problemasDetectados.length);
    console.log("📊 [Gemini] Nível de urgência:", analise.nivelUrgencia);

    return analise;
  } catch (error) {
    console.error("❌ [Gemini] Erro:", error);
    throw error;
  }
}

