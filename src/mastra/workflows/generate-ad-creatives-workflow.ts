import { createWorkflow } from "@mastra/core/workflows";
import {
  generateAdCreativesInputSchema,
  workflowOutputSchema,
} from "../types/ad-creative-types";
import {
  workflowStateSchema,
  createInitialState,
} from "../types/workflow-state-types";
import {
  processAssetsStep,
  analyzeProductStep,
  prepareGenerationTasksStep,
  customizePromptsStep,
  generateImagesStep,
  saveCreativesStep,
} from "./steps";

/**
 * Main workflow
 */
export const generateAdCreativesWorkflow = createWorkflow({
  id: "generate-ad-creatives",
  inputSchema: generateAdCreativesInputSchema,
  outputSchema: workflowOutputSchema,
  stateSchema: workflowStateSchema,
  description: `🎨 Ad Creative Generator Workflow

Generates professional ad creatives from product information using AI-powered template selection and image generation.

📋 QUICK START:

Minimal config:
{
  "productTitle": "Your Product",
  "productDescription": "Amazing product description",
  "logo": "path/to/logo.png",
  "productImages": ["path/to/product.jpg"],
  "templateSelectionMode": "ai",
  "creativesPerTemplate": 1
}

🎯 TEMPLATE MODES:
• "ai": AI picks best templates (set aiSelectTemplateCount)
• "manual": You choose (set templateIds: [1, 11, 21])

📊 Input formats supported:
• File paths: "src/mastra/assets/image.jpg"
• Base64: { type: "base64", value: "..." }
• URLs: { type: "url", value: "https://..." }
`,
})
  .then(processAssetsStep)
  .then(analyzeProductStep)
  .then(prepareGenerationTasksStep)
  .then(customizePromptsStep)
  .then(generateImagesStep)
  .then(saveCreativesStep);

generateAdCreativesWorkflow.commit();

// Export the workflow and state helper
export { generateAdCreativesWorkflow as default, createInitialState };
