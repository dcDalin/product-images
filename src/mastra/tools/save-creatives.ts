import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

/**
 * Tool to save generated creative files to disk with organized folder structure
 */

export const saveCreativesTool = createTool({
  id: "save-creatives",
  description:
    "Save generated creative images and metadata to organized folder structure",
  inputSchema: z.object({
    productTitle: z.string(),
    creatives: z.array(
      z.object({
        templateId: z.number(),
        templateName: z.string(),
        variationNumber: z.number(),
        imageData: z.string(),
        mimeType: z.string(),
        prompt: z.string(),
        aspectRatio: z.string(),
        generatedAt: z.string(),
        generationTime: z.number(),
        model: z.string(),
      }),
    ),
    outputDirectory: z.string().optional(),
  }),
  outputSchema: z.object({
    savedFiles: z.array(
      z.object({
        templateId: z.number(),
        variationNumber: z.number(),
        filePath: z.string(),
      }),
    ),
    manifestPath: z.string(),
    outputDirectory: z.string(),
  }),
  execute: async ({ productTitle, creatives, outputDirectory }) => {
    // Create output directory structure
    const timestamp =
      new Date().toISOString().replace(/[:.]/g, "-").split("T")[0] +
      "_" +
      Date.now();
    const sanitizedTitle = productTitle
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .toLowerCase();

    const baseDir =
      outputDirectory ||
      join(
        process.cwd(),
        "src/mastra/assets/GeneratedCreatives",
        sanitizedTitle,
        timestamp,
      );

    // Create base directory
    if (!existsSync(baseDir)) {
      mkdirSync(baseDir, { recursive: true });
    }

    const savedFiles: Array<{
      templateId: number;
      variationNumber: number;
      filePath: string;
    }> = [];

    // Group creatives by template
    const groupedByTemplate = creatives.reduce(
      (acc, creative) => {
        const key = `${creative.templateId}-${creative.templateName}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(creative);
        return acc;
      },
      {} as Record<string, typeof creatives>,
    );

    // Save each creative in its template folder
    for (const [templateKey, templateCreatives] of Object.entries(
      groupedByTemplate,
    )) {
      const templateDir = join(baseDir, templateKey);
      mkdirSync(templateDir, { recursive: true });

      for (const creative of templateCreatives) {
        const extension = creative.mimeType.includes("svg")
          ? "svg"
          : creative.mimeType.includes("png")
            ? "png"
            : creative.mimeType.includes("jpeg")
              ? "jpg"
              : creative.mimeType.includes("webp")
                ? "webp"
                : "png";

        const filename = `variation-${creative.variationNumber}.${extension}`;
        const filePath = join(templateDir, filename);

        // Decode base64 and save
        const buffer = Buffer.from(creative.imageData, "base64");
        writeFileSync(filePath, buffer);

        savedFiles.push({
          templateId: creative.templateId,
          variationNumber: creative.variationNumber,
          filePath,
        });
      }
    }

    // Create manifest file
    const manifest = {
      productTitle,
      generatedAt: new Date().toISOString(),
      totalCreatives: creatives.length,
      configuration: {
        templates: [...new Set(creatives.map((c) => c.templateId))],
        creativesPerTemplate: Math.max(
          ...Object.values(groupedByTemplate).map((g) => g.length),
        ),
      },
      creatives: creatives.map((c) => ({
        templateId: c.templateId,
        templateName: c.templateName,
        variationNumber: c.variationNumber,
        filePath: savedFiles.find(
          (f) =>
            f.templateId === c.templateId &&
            f.variationNumber === c.variationNumber,
        )?.filePath,
        prompt: c.prompt,
        aspectRatio: c.aspectRatio,
        generatedAt: c.generatedAt,
        generationTime: c.generationTime,
        model: c.model,
      })),
    };

    const manifestPath = join(baseDir, "manifest.json");
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    return {
      savedFiles,
      manifestPath,
      outputDirectory: baseDir,
    };
  },
});
