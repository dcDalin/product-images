import { createStep } from "@mastra/core/workflows";
import { z } from "zod";
import {
  generateAdCreativesInputSchema,
  creativeOutputSchema,
  workflowOutputSchema,
} from "../../types/ad-creative-types";
import { workflowStateSchema } from "../../types/workflow-state-types";
import { saveCreativesTool } from "../../tools/save-creatives";

/**
 * Step 6: Save creatives to disk
 */
export const saveCreativesStep = createStep({
  id: "save-creatives",
  description: "Save generated creatives to organized folder structure",
  stateSchema: workflowStateSchema,
  inputSchema: z.object({
    originalInput: generateAdCreativesInputSchema,
    creatives: z.array(creativeOutputSchema),
  }),
  outputSchema: workflowOutputSchema,
  execute: async ({ inputData, requestContext, mastra, state, setState }) => {
    const startTime = Date.now();
    console.log("💾 Saving creatives...");

    // Update state
    await setState({
      ...state,
      currentStep: "save-creatives",
      progressLog: [...state.progressLog, `Saving ${inputData.creatives.length} creatives to disk`],
    });

    const { originalInput, creatives } = inputData;

    // Prepare data for save tool
    const creativesToSave = creatives.map((c) => ({
      templateId: c.templateId,
      templateName: c.templateName,
      variationNumber: c.variationNumber,
      imageData: c.imageData || "",
      mimeType: "image/png",
      prompt: c.prompt,
      aspectRatio: c.aspectRatio,
      generatedAt: c.generatedAt,
      generationTime: c.generationTime,
      model: c.metadata.modelUsed,
    }));

    const result = await saveCreativesTool.execute!(
      {
        productTitle: originalInput.productTitle,
        creatives: creativesToSave,
        outputDirectory: originalInput.outputDirectory,
      },
      { requestContext, mastra }
    );

    if (!('savedFiles' in result)) {
      throw new Error(`Failed to save creatives`);
    }

    // Update creatives with saved paths
    const updatedCreatives = creatives.map((c, idx) => ({
      ...c,
      localPath: result.savedFiles[idx]?.filePath || "",
    }));

    console.log(`✅ Saved all creatives to ${result.outputDirectory}`);

    // Update state with final timing and completion
    const saveTime = Date.now() - startTime;
    const totalTime = Object.values(state.timings).reduce((sum, time) => sum + (time || 0), 0) + saveTime;

    await setState({
      ...state,
      currentStep: "completed",
      timings: {
        ...state.timings,
        saveCreatives: saveTime,
      },
      progressLog: [
        ...state.progressLog,
        `Saved ${creatives.length} creatives in ${saveTime}ms`,
        `Workflow completed in ${totalTime}ms total`,
      ],
    });

    return {
      success: true,
      totalCreativesGenerated: creatives.length,
      creatives: updatedCreatives,
      outputDirectory: result.outputDirectory,
      manifestPath: result.manifestPath,
      summary: `Successfully generated ${creatives.length} ad creatives for "${originalInput.productTitle}". Files saved to: ${result.outputDirectory}`,
    };
  },
});
