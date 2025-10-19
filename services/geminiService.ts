
import { GoogleGenAI, Type } from "@google/genai";
import type { Question } from '../types';

const LOGISTICS_CONTEXT = `
Saca só: Logística Integrada nada mais é do que juntar tudo que acontece dentro de uma empresa, desde pegar o material lá no começo até entregar o produto na mão do cliente. É igual fazer todas as partes do rolê se conectarem, sem bagunça e sem atraso.

Imagina um time dando um show, cada um sabendo o que tem que fazer e passando a bola na hora certa. É exatamente isso! A empresa ganha tempo, economiza dinheiro e o cliente recebe tudo bem de boa.

A Logística Integrada surgiu da necessidade das empresas de:
- Reduzir custos operacionais (combustível, armazenagem e mão de obra).
- Aumentar a eficiência (menos falhas e atrasos).
- Responder de forma rápida e flexível às mudanças do mercado.
- Integrar informações em tempo real entre setores.
- Garantir satisfação do cliente e fidelização.
- Se diferenciar em um mercado cada vez mais competitivo

Importância:
- Integração de processos: conecta suprimentos, produção, armazenagem, transporte e distribuição;
- Fluxo de informações: uso de sistemas para acompanhar em tempo real pedidos, estoques e entregas;
- Redução de custos: elimina desperdícios e atividades duplicadas;
- Agilidade e flexibilidade: melhora a capacidade de resposta às mudanças de mercado;
- Foco no cliente: garante que o produto certo chegue no lugar certo, na hora certa, com qualidade e menor custo.

Características:
- Integração de processos: conecta suprimentos, produção, armazenagem, transporte e distribuição.
- Fluxo de informações: uso de sistemas para acompanhar em tempo real pedidos, estoques e entregas.
- Redução de custos: elimina desperdícios e atividades duplicadas.
- Agilidade e flexibilidade: melhora a capacidade de resposta às mudanças de mercado.
- Foco no cliente: garante que o produto certo chegue no lugar certo, na hora certa, com qualidade e menor custo.

Linha do tempo resumida:
- Antes dos anos 1950 → a logística era vista apenas como transporte e armazenagem. O foco era movimentar produtos de um ponto a outro.
- Década de 1950–1960 → após a 2ª Guerra Mundial, empresas começaram a aplicar conceitos militares de logística (movimentação estratégica de suprimentos) no setor empresarial.
- Década de 1970 → crises do petróleo aumentaram os custos, e as empresas perceberam a necessidade de reduzir desperdícios e integrar melhor suas operações.
- Década de 1980 → surge o conceito de Supply Chain Management (Gestão da Cadeia de Suprimentos), com visão mais ampla, considerando fornecedores, produção e clientes como partes de um mesmo sistema.
- Década de 1990 → avanço da tecnologia da informação (sistemas ERP, código de barras, rastreamento) permite integração em tempo real entre áreas da empresa e parceiros externos.
- Anos 2000 em diante → globalização, e-commerce e logística 4.0 (uso de IA, IoT, Big Data, automações) consolidam a logística integrada como diferencial competitivo.

Objetivos:
- Redução de custos → eliminar desperdícios, evitar retrabalho e otimizar recursos.
- Eficiência operacional → garantir que todos os processos estejam sincronizados e fluindo sem gargalos.
- Agilidade e flexibilidade → responder rapidamente a mudanças de demanda ou imprevistos no mercado.
- Qualidade no atendimento → entregar o produto certo, no lugar certo, no tempo certo.
- Integração da cadeia de suprimentos → conectar fornecedores, produção, armazenagem, transporte e cliente final em um só sistema.
- Satisfação e fidelização do cliente → aumentar a competitividade ao oferecer melhor experiência de compra.
`;

const quizSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: {
        type: Type.STRING,
        description: "A pergunta do quiz.",
      },
      options: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Uma lista de 4 possíveis respostas.",
      },
      answer: {
        type: Type.STRING,
        description: "A resposta correta, que deve ser uma das opções listadas.",
      },
    },
    required: ["question", "options", "answer"],
  },
};

export async function generateQuizQuestions(numberOfQuestions: number = 7): Promise<Question[]> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Com base no seguinte texto sobre Logística Integrada, gere um quiz com ${numberOfQuestions} perguntas de múltipla escolha. Cada pergunta deve ter 4 opções e apenas uma resposta correta. O tom deve ser dinâmico e direto, como no texto. \n\nContexto: \n${LOGISTICS_CONTEXT}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
      },
    });

    const jsonText = response.text.trim();
    const quizData = JSON.parse(jsonText) as Question[];

    // Validate data structure
    if (!Array.isArray(quizData) || quizData.some(q => !q.question || !q.options || !q.answer)) {
        throw new Error("Formato de dados do quiz inválido recebido da API.");
    }

    return quizData;
  } catch (error) {
    console.error("Erro ao gerar perguntas do quiz:", error);
    throw new Error("Não foi possível gerar as perguntas. Tente novamente mais tarde.");
  }
}
