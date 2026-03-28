import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { getCreativeForPrompt, getAllCategories } from '../utils/prompt-creative-mapping';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Tool to lookup template information by ID
 */

export const lookupTemplateTool = createTool({
  id: 'lookup-template',
  description: 'Get template information including name, category, aspect ratio, and prompt text',
  inputSchema: z.object({
    templateId: z.number().int().min(1).max(40).describe('Template ID (1-40)'),
  }),
  outputSchema: z.object({
    templateId: z.number(),
    templateName: z.string(),
    category: z.string(),
    aspectRatio: z.string(),
    tags: z.array(z.string()),
    promptText: z.string(),
  }),
  execute: async ({ templateId }) => {
    const mapping = getCreativeForPrompt(templateId);

    if (!mapping) {
      throw new Error(`Template ${templateId} not found. Valid IDs are 1-40.`);
    }

    // Read the prompt text from template-prompts.md
    const promptsPath = join(process.cwd(), 'src/mastra/prompts/template-prompts.md');
    const promptsContent = readFileSync(promptsPath, 'utf-8');

    // Extract the specific template prompt
    // Look for the section with the template number
    const sectionRegex = new RegExp(
      `## (?:\\*\\*)?${templateId}\\.?\\s+([^\\n]+)([\\s\\S]+?)(?=\\n## |$)`,
      'i'
    );
    const match = promptsContent.match(sectionRegex);

    let promptText = '';
    if (match) {
      // Extract just the "Template Prompt:" section
      const templatePromptMatch = match[2].match(/\*\*Template Prompt:\*\*([^]*?)(?=\n##|$)/);
      if (templatePromptMatch) {
        promptText = templatePromptMatch[1].trim();
      }
    }

    if (!promptText) {
      throw new Error(`Could not extract prompt text for template ${templateId}`);
    }

    return {
      templateId: mapping.prompt.id,
      templateName: mapping.prompt.name,
      category: mapping.prompt.category,
      aspectRatio: mapping.prompt.aspectRatio,
      tags: mapping.prompt.tags,
      promptText,
    };
  },
});

/**
 * Tool to list all available templates
 */

export const listTemplatesTool = createTool({
  id: 'list-templates',
  description: 'List all 40 available ad creative templates with their categories',
  inputSchema: z.object({
    category: z.string().optional().describe('Filter by category (optional)'),
  }),
  outputSchema: z.object({
    templates: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        category: z.string(),
        aspectRatio: z.string(),
        tags: z.array(z.string()),
      })
    ),
    availableCategories: z.array(z.string()),
  }),
  execute: async ({ category }) => {
    const { getAllMappings, getPromptsByCategory } = await import('../utils/prompt-creative-mapping');

    const mappings = category
      ? getPromptsByCategory(category)
      : getAllMappings();

    return {
      templates: mappings.map(m => ({
        id: m.prompt.id,
        name: m.prompt.name,
        category: m.prompt.category,
        aspectRatio: m.prompt.aspectRatio,
        tags: m.prompt.tags,
      })),
      availableCategories: getAllCategories(),
    };
  },
});
