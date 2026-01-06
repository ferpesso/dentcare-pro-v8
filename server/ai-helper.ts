import { invokeLLM } from "./_core/llm";

/**
 * Helper para funcionalidades de IA do DentCare Pro
 * Usa Grok (xAI) para análise inteligente
 */

export interface DiagnosticoSugestao {
  diagnostico: string;
  probabilidade: "alta" | "media" | "baixa";
  fundamentacao: string;
  tratamentosRecomendados: string[];
  alertas?: string[];
}

export interface VerificacaoMedicamento {
  seguro: boolean;
  alertas: string[];
  alternativas?: string[];
  ajusteDosagem?: string;
}

export interface ResumoConsulta {
  resumo: string;
  pontosChave: string[];
  proximosPassos: string[];
}

export interface AnaliseRisco {
  nivelRisco: "baixo" | "medio" | "alto";
  fatores: string[];
  recomendacoes: string[];
}

/**
 * Assistente de Diagnóstico Inteligente
 */
export async function analisarSintomas(dados: {
  sintomas: string;
  historicoMedico?: string;
  alergias?: string[];
  medicamentos?: string[];
  idade: number;
  genero: string;
}): Promise<DiagnosticoSugestao[]> {
  const prompt = `Você é um assistente de diagnóstico dentário especializado. Analise os seguintes dados do paciente e sugira possíveis diagnósticos:

**Sintomas relatados:** ${dados.sintomas}
**Idade:** ${dados.idade} anos
**Género:** ${dados.genero}
${dados.historicoMedico ? `**Histórico médico:** ${dados.historicoMedico}` : ""}
${dados.alergias?.length ? `**Alergias:** ${dados.alergias.join(", ")}` : ""}
${dados.medicamentos?.length ? `**Medicamentos atuais:** ${dados.medicamentos.join(", ")}` : ""}

Forneça 2-3 diagnósticos prováveis em formato JSON seguindo este schema:
{
  "diagnosticos": [
    {
      "diagnostico": "nome do diagnóstico",
      "probabilidade": "alta|media|baixa",
      "fundamentacao": "explicação baseada nos sintomas",
      "tratamentosRecomendados": ["tratamento 1", "tratamento 2"],
      "alertas": ["alerta importante se houver"]
    }
  ]
}`;

  const response = await invokeLLM({
    messages: [
      { role: "system", content: "Você é um assistente médico dentário especializado. Sempre responda em português de Portugal." },
      { role: "user", content: prompt },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "diagnostico_analise",
        strict: true,
        schema: {
          type: "object",
          properties: {
            diagnosticos: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  diagnostico: { type: "string" },
                  probabilidade: { type: "string", enum: ["alta", "media", "baixa"] },
                  fundamentacao: { type: "string" },
                  tratamentosRecomendados: {
                    type: "array",
                    items: { type: "string" },
                  },
                  alertas: {
                    type: "array",
                    items: { type: "string" },
                  },
                },
                required: ["diagnostico", "probabilidade", "fundamentacao", "tratamentosRecomendados"],
                additionalProperties: false,
              },
            },
          },
          required: ["diagnosticos"],
          additionalProperties: false,
        },
      },
    },
  });

  const result = JSON.parse(response.choices[0].message.content as string);
  return result.diagnosticos;
}

/**
 * Verificação Inteligente de Medicamentos
 */
export async function verificarMedicamento(dados: {
  medicamento: string;
  dosagem: string;
  alergias: string[];
  medicamentosAtuais: string[];
  condicoesMedicas: string[];
  idade: number;
  peso?: number;
}): Promise<VerificacaoMedicamento> {
  const prompt = `Você é um farmacêutico especializado. Verifique a segurança deste medicamento:

**Medicamento:** ${dados.medicamento} ${dados.dosagem}
**Idade do paciente:** ${dados.idade} anos
${dados.peso ? `**Peso:** ${dados.peso} kg` : ""}
**Alergias conhecidas:** ${dados.alergias.join(", ") || "Nenhuma"}
**Medicamentos atuais:** ${dados.medicamentosAtuais.join(", ") || "Nenhum"}
**Condições médicas:** ${dados.condicoesMedicas.join(", ") || "Nenhuma"}

Analise:
1. Interações medicamentosas perigosas
2. Contraindicações com alergias
3. Contraindicações com condições médicas
4. Dosagem apropriada para idade/peso
5. Medicamentos alternativos se houver problemas

Responda em JSON seguindo este schema:
{
  "seguro": true/false,
  "alertas": ["lista de alertas"],
  "alternativas": ["medicamentos alternativos se não for seguro"],
  "ajusteDosagem": "sugestão de ajuste se necessário"
}`;

  const response = await invokeLLM({
    messages: [
      { role: "system", content: "Você é um farmacêutico especializado. Sempre responda em português de Portugal." },
      { role: "user", content: prompt },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "verificacao_medicamento",
        strict: true,
        schema: {
          type: "object",
          properties: {
            seguro: { type: "boolean" },
            alertas: {
              type: "array",
              items: { type: "string" },
            },
            alternativas: {
              type: "array",
              items: { type: "string" },
            },
            ajusteDosagem: { type: "string" },
          },
          required: ["seguro", "alertas"],
          additionalProperties: false,
        },
      },
    },
  });

  const result = JSON.parse(response.choices[0].message.content as string);
  return result;
}

/**
 * Geração de Resumo de Consulta
 */
export async function gerarResumoConsulta(dados: {
  notasConsulta: string;
  tratamentosRealizados?: string[];
  proximaConsulta?: string;
}): Promise<ResumoConsulta> {
  const prompt = `Você é um assistente médico. Crie um resumo profissional desta consulta dentária:

**Notas da consulta:**
${dados.notasConsulta}

${dados.tratamentosRealizados?.length ? `**Tratamentos realizados:** ${dados.tratamentosRealizados.join(", ")}` : ""}
${dados.proximaConsulta ? `**Próxima consulta:** ${dados.proximaConsulta}` : ""}

Crie um resumo estruturado em JSON:
{
  "resumo": "resumo conciso da consulta (2-3 frases)",
  "pontosChave": ["ponto importante 1", "ponto importante 2"],
  "proximosPassos": ["ação recomendada 1", "ação recomendada 2"]
}`;

  const response = await invokeLLM({
    messages: [
      { role: "system", content: "Você é um assistente médico especializado. Sempre responda em português de Portugal." },
      { role: "user", content: prompt },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "resumo_consulta",
        strict: true,
        schema: {
          type: "object",
          properties: {
            resumo: { type: "string" },
            pontosChave: {
              type: "array",
              items: { type: "string" },
            },
            proximosPassos: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: ["resumo", "pontosChave", "proximosPassos"],
          additionalProperties: false,
        },
      },
    },
  });

  const result = JSON.parse(response.choices[0].message.content as string);
  return result;
}

/**
 * Análise Preditiva de Risco
 */
export async function analisarRiscoPaciente(dados: {
  historicoMedico: string;
  condicoesMedicas: string[];
  idade: number;
  ultimaConsulta?: string;
  tratamentosPendentes?: string[];
}): Promise<AnaliseRisco> {
  const prompt = `Você é um analista de saúde dentária. Avalie o nível de risco deste paciente:

**Idade:** ${dados.idade} anos
**Histórico médico:** ${dados.historicoMedico}
**Condições médicas:** ${dados.condicoesMedicas.join(", ") || "Nenhuma"}
${dados.ultimaConsulta ? `**Última consulta:** ${dados.ultimaConsulta}` : ""}
${dados.tratamentosPendentes?.length ? `**Tratamentos pendentes:** ${dados.tratamentosPendentes.join(", ")}` : ""}

Analise:
1. Risco de complicações dentárias
2. Necessidade de acompanhamento
3. Fatores de risco identificados

Responda em JSON:
{
  "nivelRisco": "baixo|medio|alto",
  "fatores": ["fator de risco 1", "fator de risco 2"],
  "recomendacoes": ["recomendação 1", "recomendação 2"]
}`;

  const response = await invokeLLM({
    messages: [
      { role: "system", content: "Você é um analista de saúde especializado. Sempre responda em português de Portugal." },
      { role: "user", content: prompt },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "analise_risco",
        strict: true,
        schema: {
          type: "object",
          properties: {
            nivelRisco: { type: "string", enum: ["baixo", "medio", "alto"] },
            fatores: {
              type: "array",
              items: { type: "string" },
            },
            recomendacoes: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: ["nivelRisco", "fatores", "recomendacoes"],
          additionalProperties: false,
        },
      },
    },
  });

  const result = JSON.parse(response.choices[0].message.content as string);
  return result;
}

/**
 * Assistente Virtual - Responde perguntas sobre o paciente
 */
export async function assistenteVirtual(dados: {
  pergunta: string;
  contextoUtente: {
    nome: string;
    idade: number;
    historicoMedico?: string;
    alergias?: string[];
    medicamentos?: string[];
    condicoesMedicas?: string[];
  };
}): Promise<string> {
  const contexto = `
**Paciente:** ${dados.contextoUtente.nome}, ${dados.contextoUtente.idade} anos
${dados.contextoUtente.historicoMedico ? `**Histórico:** ${dados.contextoUtente.historicoMedico}` : ""}
${dados.contextoUtente.alergias?.length ? `**Alergias:** ${dados.contextoUtente.alergias.join(", ")}` : ""}
${dados.contextoUtente.medicamentos?.length ? `**Medicamentos:** ${dados.contextoUtente.medicamentos.join(", ")}` : ""}
${dados.contextoUtente.condicoesMedicas?.length ? `**Condições:** ${dados.contextoUtente.condicoesMedicas.join(", ")}` : ""}
`;

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: "Você é um assistente virtual de uma clínica dentária. Responda perguntas sobre pacientes de forma profissional e útil. Sempre responda em português de Portugal.",
      },
      {
        role: "user",
        content: `Contexto do paciente:\n${contexto}\n\nPergunta: ${dados.pergunta}`,
      },
    ],
  });

  return response.choices[0].message.content as string;
}




/**
 * Análise de Imagem Dentária com IA
 */
export interface AnaliseImagem {
  tipoImagem: string;
  qualidade: string;
  problemasDetectados: string[];
  observacoes: string[];
  recomendacoes: string[];
  nivelUrgencia: "baixo" | "medio" | "alto";
  relatorioCompleto: string;
}

export async function analisarImagemDentaria(dados: {
  imagemBase64: string;
  tipoImagem: string;
  contexto?: string;
}): Promise<AnaliseImagem> {
  console.log("🔬 [AI-Helper] Iniciando analisarImagemDentaria...");
  console.log("📊 [AI-Helper] Tipo:", dados.tipoImagem);
  console.log("📊 [AI-Helper] Tamanho base64:", dados.imagemBase64.length);
  
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

Responda em JSON estruturado com as seguintes chaves:
- tipoImagem: string
- qualidade: string
- problemasDetectados: array de strings
- observacoes: array de strings
- recomendacoes: array de strings
- nivelUrgencia: "baixo" | "medio" | "alto"
- relatorioCompleto: string (relatório narrativo completo)

IMPORTANTE: Seja específico e técnico, mas também claro. Se não conseguir identificar algo com certeza, mencione isso. Sempre indique que esta é uma análise preliminar e que um profissional deve fazer o diagnóstico final.`;

  // Extrair apenas a parte base64 da string (remover prefixo data:image/...)
  let base64Data = dados.imagemBase64;
  if (base64Data.includes(',')) {
    base64Data = base64Data.split(',')[1];
  }

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: "Você é um especialista em radiologia dentária e análise de imagens odontológicas. Sempre responda em português de Portugal com terminologia técnica apropriada.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt,
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Data}`,
            },
          },
        ],
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "analise_imagem",
        strict: true,
        schema: {
          type: "object",
          properties: {
            tipoImagem: { type: "string" },
            qualidade: { type: "string" },
            problemasDetectados: {
              type: "array",
              items: { type: "string" },
            },
            observacoes: {
              type: "array",
              items: { type: "string" },
            },
            recomendacoes: {
              type: "array",
              items: { type: "string" },
            },
            nivelUrgencia: {
              type: "string",
              enum: ["baixo", "medio", "alto"],
            },
            relatorioCompleto: { type: "string" },
          },
          required: [
            "tipoImagem",
            "qualidade",
            "problemasDetectados",
            "observacoes",
            "recomendacoes",
            "nivelUrgencia",
            "relatorioCompleto",
          ],
          additionalProperties: false,
        },
      },
    },
  });

  console.log("✅ [AI-Helper] Resposta recebida do LLM");
  
  const content = response.choices[0].message.content as string;
  console.log("📊 [AI-Helper] Tamanho conteúdo:", content?.length || 0);
  
  const resultado = JSON.parse(content);
  console.log("✅ [AI-Helper] Análise concluída e JSON parseado");
  
  return resultado;
}

