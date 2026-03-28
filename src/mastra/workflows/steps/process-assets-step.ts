import { createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { generateAdCreativesInputSchema } from "../../types/ad-creative-types";
import { workflowStateSchema } from "../../types/workflow-state-types";
import { processImageInputTool } from "../../tools/process-image-input";

/**
 * Step 1: Process and validate input assets
 */
export const processAssetsStep = createStep({
  id: "process-assets",
  description: "Process logo and product images from various input formats",
  inputSchema: generateAdCreativesInputSchema,
  stateSchema: workflowStateSchema,
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
  }),
  execute: async ({ inputData, requestContext, mastra, state, setState }) => {
    const startTime = Date.now();
    console.log("📁 Processing assets...");

    // Update state - current step
    await setState({
      ...state,
      currentStep: "process-assets",
      progressLog: [...state.progressLog, "Started processing assets"],
    });

    // Process logo
    const logoResult = await processImageInputTool.execute!(
      { input: inputData.logo },
      { requestContext, mastra }
    );

    // Process product images
    const productImagesResults = await Promise.all(
      inputData.productImages.map((img) =>
        processImageInputTool.execute!(
          { input: img },
          { requestContext, mastra }
        ),
      ),
    );

    // Update state with asset counts and timing
    const processingTime = Date.now() - startTime;
    await setState({
      ...state,
      totalAssets: {
        logoCount: 1,
        productImageCount: productImagesResults.length,
      },
      timings: {
        ...state.timings,
        processAssets: processingTime,
      },
      progressLog: [
        ...state.progressLog,
        `Processed 1 logo and ${productImagesResults.length} product images in ${processingTime}ms`,
      ],
    });

    return {
      originalInput: inputData,
      logo: logoResult as { data: string; mimeType: string; originalSource: string; filename: string },
      productImages: productImagesResults as Array<{ data: string; mimeType: string; originalSource: string; filename: string }>,
    };
  },
});
