import { createStep } from "@mastra/core/workflows";
import { z } from "zod";
import {
  generateAdCreativesInputSchema,
  productAnalysisSchema,
} from "../../types/ad-creative-types";
import { workflowStateSchema } from "../../types/workflow-state-types";

/**
 * Step 2: Analyze product and recommend templates
 */
export const analyzeProductStep = createStep({
  id: "analyze-product",
  description: "AI agent analyzes product and recommends best-fit templates",
  stateSchema: workflowStateSchema,
  inputSchema: z.object({
    originalInput: generateAdCreativesInputSchema,
    logo: z.object({
      data: z.string(),
      mimeType: z.string(),
      originalSource: z.string(),
      filename: z.string(),
    }),
    productImages: z.array(
      z.object({
        data: z.string(),
        mimeType: z.string(),
        originalSource: z.string(),
        filename: z.string(),
      }),
    ),
  }),
  outputSchema: z.object({
    originalInput: generateAdCreativesInputSchema,
    logo: z.object({
      data: z.string(),
      mimeType: z.string(),
      originalSource: z.string(),
      filename: z.string(),
    }),
    productImages: z.array(
      z.object({
        data: z.string(),
        mimeType: z.string(),
        originalSource: z.string(),
        filename: z.string(),
      }),
    ),
    analysis: productAnalysisSchema,
  }),
  execute: async ({ inputData, mastra, state, setState }) => {
    const startTime = Date.now();
    console.log("🤖 Analyzing product...");

    // Update state
    await setState({
      ...state,
      currentStep: "analyze-product",
      progressLog: [...state.progressLog, "Started AI product analysis"],
    });

    const agent = mastra?.getAgent("productAnalyzerAgent");
    if (!agent) {
      throw new Error("Product analyzer agent not found");
    }

    const prompt = `Analyze this product and recommend the best ad creative templates:

PRODUCT INFORMATION:
Title: ${inputData.originalInput.productTitle}
Description: ${inputData.originalInput.productDescription}
${inputData.originalInput.targetAudience ? `Target Audience: ${inputData.originalInput.targetAudience}` : ""}
${inputData.originalInput.brandTone ? `Brand Tone: ${inputData.originalInput.brandTone}` : ""}
${inputData.originalInput.brandColors ? `Brand Colors: Primary: ${inputData.originalInput.brandColors.primary}${inputData.originalInput.brandColors.secondary ? `, Secondary: ${inputData.originalInput.brandColors.secondary}` : ""}` : ""}

TASK:
1. First use the listTemplates tool to see all 40 available templates
2. Analyze the product thoroughly
3. Recommend 10-15 templates that best fit this product
4. Provide clear reasoning for each recommendation
5. Rank them by priority (high/medium/low)

Return your analysis in structured format with all required fields.`;

    const response = await agent.generate(prompt, {
      structuredOutput: {
        schema: productAnalysisSchema,
      },
    });

    if (!response.object) {
      throw new Error("Failed to get structured analysis from agent");
    }

    // Update state with timing and completion info
    const analysisTime = Date.now() - startTime;
    await setState({
      ...state,
      timings: {
        ...state.timings,
        analyzeProduct: analysisTime,
      },
      progressLog: [
        ...state.progressLog,
        `AI analysis complete: Recommended ${response.object.recommendedTemplates.length} templates in ${analysisTime}ms`,
      ],
    });

    return {
      ...inputData,
      analysis: response.object,
    };
  },
});
