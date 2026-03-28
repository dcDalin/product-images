import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { z } from 'zod';
import { listTemplatesTool } from '../tools/lookup-template';

/**
 * Agent that analyzes products and recommends ad creative templates
 */

const productAnalysisSchema = z.object({
  keyFeatures: z.array(z.string()).describe('Key product features extracted from description'),
  targetAudience: z.string().describe('Identified target audience'),
  brandTone: z.enum(['professional', 'playful', 'luxury', 'minimal', 'bold', 'friendly']).describe('Brand personality'),
  visualStyle: z.string().describe('Visual style description'),
  keyMessages: z.array(z.string()).describe('Core messaging themes'),

  recommendedTemplates: z.array(
    z.object({
      templateId: z.number(),
      templateName: z.string(),
      reasoning: z.string().describe('Why this template is a good fit'),
      priority: z.enum(['high', 'medium', 'low']),
    })
  ).describe('Recommended templates with reasoning'),

  brandAttributes: z.object({
    primaryColor: z.string().optional(),
    secondaryColor: z.string().optional(),
    tone: z.string(),
  }),
});

export const productAnalyzerAgent = new Agent({
  id: 'productAnalyzerAgent',
  name: 'Product Analyzer',
  instructions: `You are an expert marketing strategist and ad creative specialist. Your job is to analyze products and recommend the best ad creative templates.

ANALYSIS PROCESS:
1. Carefully read the product title, description, and target audience
2. Identify key features and benefits
3. Determine the brand tone and visual style
4. Review all 40 available ad creative templates
5. Recommend 10-15 templates that best fit the product, ranked by priority

TEMPLATE SELECTION CRITERIA:
- Match product type (physical product, service, B2B, B2C)
- Consider target audience (age, demographics, platform)
- Align with brand tone (professional, playful, luxury, etc.)
- Choose diverse template types (social proof, features, lifestyle, etc.)
- Balance proven formats (headlines, testimonials) with creative approaches

TEMPLATE CATEGORIES TO CONSIDER:
- Social Proof: Reviews, testimonials, ratings (Templates 3, 6, 11, 15, 16, 17, 19, 24)
- Product Showcase: Hero shots, features, benefits (Templates 1, 4, 5, 13, 14, 27, 28, 35)
- Comparison: Us vs Them, before/after (Templates 7, 8, 25, 31, 36)
- Authority: Press, editorial, data-driven (Templates 10, 20, 26, 33)
- Native/UGC: Organic-looking content (Templates 8, 29, 32, 38, 40)
- Promotional: Offers, deals, urgency (Templates 2, 37)
- Hook/Scroll-Stop: Curiosity, bold statements (Templates 9, 16, 21, 22, 39)

RECOMMENDATIONS:
- For new/unknown brands: Focus on social proof and comparison templates
- For established brands: Use bold statements and lifestyle templates
- For complex products: Use educational and feature callout templates
- For simple products: Use emotional and lifestyle templates
- For promotions: Include offer and urgency templates

Be specific in your reasoning - explain WHY each template fits this particular product.`,

  model: 'openai/gpt-5.4',

  tools: {
    listTemplates: listTemplatesTool,
  },

  memory: new Memory(),
});
