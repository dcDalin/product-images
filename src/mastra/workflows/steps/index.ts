/**
 * Workflow steps for the Ad Creative Generator
 *
 * Each step is responsible for a specific part of the workflow:
 * 1. Process Assets - Convert various image inputs to base64
 * 2. Analyze Product - AI agent recommends best templates
 * 3. Prepare Tasks - Select templates and create generation tasks
 * 4. Customize Prompts - Replace placeholders with product details
 * 5. Generate Images - Create ad creatives using AI image generation
 * 6. Save Creatives - Write files to disk with organized structure
 */

export { processAssetsStep } from "./process-assets-step";
export { analyzeProductStep } from "./analyze-product-step";
export { prepareGenerationTasksStep } from "./prepare-generation-tasks-step";
export { customizePromptsStep } from "./customize-prompts-step";
export { generateImagesStep } from "./generate-images-step";
export { saveCreativesStep } from "./save-creatives-step";
