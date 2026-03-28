import { createStep } from "@mastra/core/workflows";
import { z } from "zod";
import {
  generateAdCreativesInputSchema,
  productAnalysisSchema,
  generationTaskSchema,
  customizedPromptSchema,
} from "../../types/ad-creative-types";
import { workflowStateSchema } from "../../types/workflow-state-types";
import { lookupTemplateTool } from "../../tools/lookup-template";

/**
 * Step 4: Customize prompts for each task
 */
export const customizePromptsStep = createStep({
  id: "customize-prompts",
  description: "Customize template prompts with product-specific details",
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
    analysis: productAnalysisSchema,
    tasks: z.array(generationTaskSchema),
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
    customizedPrompts: z.array(customizedPromptSchema),
  }),
  execute: async ({ inputData, requestContext, mastra, state, setState }) => {
    const startTime = Date.now();
    console.log("✍️  Customizing prompts...");

    // Update state
    await setState({
      ...state,
      currentStep: "customize-prompts",
      progressLog: [...state.progressLog, "Customizing prompts with product details"],
    });

    const { originalInput, analysis, tasks } = inputData;
    const customizedPrompts: z.infer<typeof customizedPromptSchema>[] = [];

    for (const task of tasks) {
      // Get template prompt text
      const templateInfo = await lookupTemplateTool.execute!(
        { templateId: task.templateId },
        { requestContext, mastra }
      );

      if (!('promptText' in templateInfo)) {
        throw new Error(`Failed to lookup template ${task.templateId}`);
      }

      let customizedPrompt = templateInfo.promptText;

      // Replace common placeholders with product-specific information
      const replacements: Record<string, string> = {
        "[YOUR PRODUCT]": originalInput.productTitle,
        "[PRODUCT]": originalInput.productTitle,
        "[BRAND]": originalInput.productTitle,
        "[YOUR BRAND]": originalInput.productTitle,
        "YOUR FIRST MONTH FREE": "LIMITED TIME OFFER",
        "[YOUR HEADLINE, under 10 words]":
          analysis.keyMessages[0] || originalInput.productTitle,
        "[SHORT HEADLINE]":
          analysis.keyMessages[0] || originalInput.productTitle,
      };

      // Apply replacements
      for (const [placeholder, value] of Object.entries(replacements)) {
        customizedPrompt = customizedPrompt.replace(
          new RegExp(placeholder, "g"),
          value,
        );
      }

      // Add variation modifier for variations beyond the first
      if (task.variationNumber > 1) {
        customizedPrompt += `\n\nVariation ${task.variationNumber}: Apply slight creative differences while maintaining the core concept.`;
      }

      customizedPrompts.push({
        templateId: task.templateId,
        templateName: task.templateName,
        variationNumber: task.variationNumber,
        prompt: customizedPrompt,
        aspectRatio: task.aspectRatio,
      });
    }

    console.log(`Customized ${customizedPrompts.length} prompts`);

    // Update state with timing
    const customizeTime = Date.now() - startTime;
    await setState({
      ...state,
      timings: {
        ...state.timings,
        customizePrompts: customizeTime,
      },
      progressLog: [
        ...state.progressLog,
        `Customized ${customizedPrompts.length} prompts in ${customizeTime}ms`,
      ],
    });

    return {
      originalInput: inputData.originalInput,
      logo: inputData.logo,
      productImages: inputData.productImages,
      analysis: inputData.analysis,
      customizedPrompts,
    };
  },
});
