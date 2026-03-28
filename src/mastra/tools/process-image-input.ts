import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Tool to process image inputs (file paths, base64, or URLs)
 * Converts all inputs to a standard format for downstream processing
 */

export const processImageInputTool = createTool({
  id: 'process-image-input',
  description: 'Process image input from file path, base64 data, or URL',
  inputSchema: z.object({
    input: z.union([
      z.object({
        type: z.literal('path'),
        value: z.string(),
      }),
      z.object({
        type: z.literal('base64'),
        value: z.string(),
        filename: z.string().optional(),
      }),
      z.object({
        type: z.literal('url'),
        value: z.string(),
      }),
      z.string(),
    ]),
  }),
  outputSchema: z.object({
    data: z.string().describe('Base64 encoded image data'),
    mimeType: z.string(),
    originalSource: z.string(),
    filename: z.string(),
  }),
  execute: async ({ input }) => {
    // Handle simple string input (treat as file path)
    if (typeof input === 'string') {
      input = { type: 'path', value: input };
    }

    switch (input.type) {
      case 'path': {
        const filePath = input.value.startsWith('/')
          ? input.value
          : join(process.cwd(), input.value);

        if (!existsSync(filePath)) {
          throw new Error(`File not found: ${filePath}`);
        }

        const buffer = readFileSync(filePath);
        const base64 = buffer.toString('base64');

        // Determine MIME type from extension
        const ext = filePath.split('.').pop()?.toLowerCase();
        const mimeType =
          ext === 'png' ? 'image/png' :
          ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' :
          ext === 'gif' ? 'image/gif' :
          ext === 'webp' ? 'image/webp' :
          ext === 'svg' ? 'image/svg+xml' :
          'image/png'; // default

        return {
          data: base64,
          mimeType,
          originalSource: filePath,
          filename: filePath.split('/').pop() || 'unknown',
        };
      }

      case 'base64': {
        let base64Data = input.value;
        let mimeType = 'image/png';

        // Extract mime type if data URL format
        if (base64Data.startsWith('data:')) {
          const matches = base64Data.match(/^data:([^;]+);base64,(.+)$/);
          if (matches) {
            mimeType = matches[1];
            base64Data = matches[2];
          }
        }

        return {
          data: base64Data,
          mimeType,
          originalSource: 'base64-upload',
          filename: input.filename || 'uploaded-image',
        };
      }

      case 'url': {
        // Fetch image from URL
        const response = await fetch(input.value);
        if (!response.ok) {
          throw new Error(`Failed to fetch image from URL: ${response.statusText}`);
        }

        const buffer = await response.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const mimeType = response.headers.get('content-type') || 'image/png';

        return {
          data: base64,
          mimeType,
          originalSource: input.value,
          filename: input.value.split('/').pop() || 'remote-image',
        };
      }

      default:
        throw new Error(`Unsupported input type: ${(input as any).type}`);
    }
  },
});
