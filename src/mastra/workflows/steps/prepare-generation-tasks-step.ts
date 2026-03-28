import { createStep } from "@mastra/core/workflows";
import { z } from "zod";
import {
  generateAdCreativesInputSchema,
  productAnalysisSchema,
  generationTaskSchema,
} from "../../types/ad-creative-types";
import { workflowStateSchema } from "../../types/workflow-state-types";

/**
 * Step 3: Select templates and prepare generation tasks
 */
export const prepareGenerationTasksStep = createStep({
  id: "prepare-generation-tasks",
  description: "Select final templates and create generation task list",
  stateSchema: workflowStateSchema,
  inputSchema: z.object({
    originalInput: generateAdCreativesInputSchema,
    logo: z.any(),
    productImages: z.any(),
    analysis: productAnalysisSchema,
  }),
  outputSchema: z.object({
    originalInput: generateAdCreativesInputSchema,
    logo: z.any(),
    productImages: z.any(),
    analysis: productAnalysisSchema,
    tasks: z.array(generationTaskSchema),
  }),
  execute: async ({ inputData, state, setState }) => {
    const startTime = Date.now();
    console.log("📋 Preparing generation tasks...");

    // Update state
    await setState({
      ...state,
      currentStep: "prepare-generation-tasks",
      progressLog: [...state.progressLog, "Preparing generation tasks"],
    });

    const { originalInput, analysis } = inputData;

    // Determine final template IDs
    let finalTemplateIds: number[];
    let selectionStrategy: "ai" | "manual";

    if (
      originalInput.templateSelectionMode === "manual" &&
      originalInput.templateIds?.length
    ) {
      // User specified templates
      finalTemplateIds = originalInput.templateIds;
      selectionStrategy = "manual";
      console.log(`Using ${finalTemplateIds.length} user-specified templates`);
    } else {
      // AI-selected templates
      const count = originalInput.aiSelectTemplateCount || 5;
      finalTemplateIds = analysis.recommendedTemplates
        .sort((a, b) => {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        })
        .slice(0, count)
        .map((t) => t.templateId);
      selectionStrategy = "ai";
      console.log(`Using ${finalTemplateIds.length} AI-recommended templates`);
    }

    // Get template details for each ID
    const { getCreativeForPrompt } =
      await import("../../utils/prompt-creative-mapping");

    const tasks: z.infer<typeof generationTaskSchema>[] = [];

    for (const templateId of finalTemplateIds) {
      const templateInfo = getCreativeForPrompt(templateId);
      if (!templateInfo) {
        console.warn(`Template ${templateId} not found, skipping`);
        continue;
      }

      // Create N tasks for this template (variations)
      for (let i = 1; i <= originalInput.creativesPerTemplate; i++) {
        tasks.push({
          templateId,
          templateName: templateInfo.prompt.name,
          variationNumber: i,
          aspectRatio: templateInfo.prompt.aspectRatio,
        });
      }
    }

    console.log(`Created ${tasks.length} generation tasks`);

    // Update state with template selection metadata
    const taskPrepTime = Date.now() - startTime;
    await setState({
      ...state,
      selectedTemplateIds: finalTemplateIds,
      templateSelectionStrategy: selectionStrategy,
      timings: {
        ...state.timings,
        prepareGenerationTasks: taskPrepTime,
      },
      progressLog: [
        ...state.progressLog,
        `Prepared ${tasks.length} generation tasks (${finalTemplateIds.length} templates × ${originalInput.creativesPerTemplate} variations) in ${taskPrepTime}ms`,
      ],
    });

    return {
      ...inputData,
      tasks,
    };
  },
});
