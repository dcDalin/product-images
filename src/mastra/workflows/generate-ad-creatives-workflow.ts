import { createWorkflow } from "@mastra/core/workflows";
import {
  generateAdCreativesInputSchema,
  workflowOutputSchema,
} from "../types/ad-creative-types";
import { workflowStateSchema } from "../types/workflow-state-types";
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
  "productDescription": "Detailed multi-paragraph product description highlighting key features, benefits, and unique selling points. You can include multiple paragraphs to provide comprehensive information about your product.",
  "logo": "https://example.com/logo.png",
  "productImages": ["https://example.com/product1.jpg", "https://example.com/product2.jpg"],
  "templateSelectionMode": "ai",
  "creativesPerTemplate": 1
}

🎯 TEMPLATE MODES:
• "ai": AI picks best templates (set aiSelectTemplateCount)
• "manual": You choose (set templateIds: [1, 11, 21])

📸 IMAGE REQUIREMENTS:
• All images must be publicly accessible URLs
• Supported formats: PNG, JPG, WEBP, GIF, SVG
• Logo: Single URL to your brand logo
• Product Images: 1-10 URLs to product photos
`,
})
  .then(processAssetsStep)
  .then(analyzeProductStep)
  .then(prepareGenerationTasksStep)
  .then(customizePromptsStep)
  .then(generateImagesStep)
  .then(saveCreativesStep);

generateAdCreativesWorkflow.commit();

export { generateAdCreativesWorkflow as default };
