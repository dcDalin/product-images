import { createStep } from "@mastra/core/workflows";
import { z } from "zod";
import {
  generateAdCreativesInputSchema,
  customizedPromptSchema,
  creativeOutputSchema,
} from "../../types/ad-creative-types";
import { workflowStateSchema } from "../../types/workflow-state-types";
import { generateImageTool } from "../../tools/generate-image";

/**
 * Step 5: Generate images (parallel)
 */
export const generateImagesStep = createStep({
  id: "generate-images",
  description: "Generate ad creative images using AI",
  stateSchema: workflowStateSchema,
  inputSchema: z.object({
    originalInput: generateAdCreativesInputSchema,
    logo: z.any(),
    productImages: z.any(),
    customizedPrompts: z.array(customizedPromptSchema),
  }),
  outputSchema: z.object({
    originalInput: generateAdCreativesInputSchema,
    creatives: z.array(creativeOutputSchema),
  }),
  execute: async ({ inputData, requestContext, mastra, state, setState }) => {
    const startTime = Date.now();
    console.log("🎨 Generating images...");

    // Update state
    await setState({
      ...state,
      currentStep: "generate-images",
      progressLog: [
        ...(state.progressLog || []),
        `Starting image generation for ${inputData.customizedPrompts.length} creatives`,
      ],
    });

    const { originalInput, logo, productImages, customizedPrompts } = inputData;
    const creatives: z.infer<typeof creativeOutputSchema>[] = [];

    // Prepare reference images
    const referenceImages = [
      { data: logo.data, type: "logo" as const },
      ...productImages.map(
        (img: {
          data: string;
          mimeType: string;
          originalSource: string;
          filename: string;
        }) => ({
          data: img.data,
          type: "product" as const,
        }),
      ),
    ];

    // Generate images (could be parallelized with Promise.all for faster generation)
    for (const promptConfig of customizedPrompts) {
      const result = await generateImageTool.execute!(
        {
          prompt: promptConfig.prompt,
          aspectRatio: promptConfig.aspectRatio as "1:1" | "4:5" | "9:16",
          model: originalInput.imageGenerationModel,
          referenceImages,
        },
        { requestContext, mastra },
      );

      if (!("imageData" in result)) {
        throw new Error(
          `Failed to generate image for template ${promptConfig.templateId}`,
        );
      }

      const { getCreativeForPrompt } =
        await import("../../utils/prompt-creative-mapping");
      const templateInfo = getCreativeForPrompt(promptConfig.templateId);

      creatives.push({
        templateId: promptConfig.templateId,
        templateName: promptConfig.templateName,
        variationNumber: promptConfig.variationNumber,
        imageData: result.imageData,
        localPath: "", // Will be set in save step
        prompt: promptConfig.prompt,
        aspectRatio: promptConfig.aspectRatio,
        generatedAt: new Date().toISOString(),
        generationTime: result.generationTime,
        metadata: {
          productTitle: originalInput.productTitle,
          modelUsed: result.model,
          templateCategory: templateInfo?.prompt.category || "Unknown",
        },
      });

      console.log(
        `Generated ${promptConfig.templateName} variation ${promptConfig.variationNumber}`,
      );
    }

    console.log(`✅ Generated ${creatives.length} creatives`);

    // Update state with generation stats and timing
    const generationTime = Date.now() - startTime;
    await setState({
      ...state,
      totalCreativesGenerated: creatives.length,
      timings: {
        ...state.timings,
        generateImages: generationTime,
      },
      progressLog: [
        ...state.progressLog,
        `Generated ${creatives.length} creatives in ${generationTime}ms (avg: ${Math.round(generationTime / creatives.length)}ms per creative)`,
      ],
    });

    return {
      originalInput,
      creatives,
    };
  },
});
