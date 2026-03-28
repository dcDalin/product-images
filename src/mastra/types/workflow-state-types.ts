import { z } from "zod";

/**
 * Workflow state schema for the Ad Creative Generator
 *
 * State persists across all steps and can be used to:
 * - Track progress and execution flow
 * - Share metadata without cluttering input/output schemas
 * - Accumulate warnings and statistics
 * - Monitor performance timings
 */
export const workflowStateSchema = z.object({
  // Progress tracking
  progressLog: z.array(z.string()).default([]).describe("Log of progress messages from each step"),
  currentStep: z.string().default("initialization").describe("Name of the currently executing step"),

  // Template selection metadata
  selectedTemplateIds: z.array(z.number()).optional().describe("Template IDs selected for generation"),
  templateSelectionStrategy: z.enum(["ai", "manual"]).optional().describe("How templates were selected"),

  // Generation statistics
  totalCreativesGenerated: z.number().default(0).describe("Running count of creatives generated"),
  totalAssets: z.object({
    logoCount: z.number().default(0),
    productImageCount: z.number().default(0),
  }).default({ logoCount: 0, productImageCount: 0 }).describe("Count of processed assets"),

  // Warnings and issues
  warnings: z.array(z.object({
    step: z.string(),
    message: z.string(),
    timestamp: z.string(),
  })).default([]).describe("Non-fatal warnings encountered during execution"),

  // Performance timings
  timings: z.object({
    processAssets: z.number().optional(),
    analyzeProduct: z.number().optional(),
    prepareGenerationTasks: z.number().optional(),
    customizePrompts: z.number().optional(),
    generateImages: z.number().optional(),
    saveCreatives: z.number().optional(),
  }).default({}).describe("Time spent in milliseconds for each step"),
});

export type WorkflowState = z.infer<typeof workflowStateSchema>;
