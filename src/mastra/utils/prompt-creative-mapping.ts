import { existsSync } from 'fs';
import { join } from 'path';

/**
 * Type definitions for template prompts and ad creatives
 */

export interface TemplatePrompt {
  id: number;
  name: string;
  category: string;
  aspectRatio: '1:1' | '4:5' | '9:16';
  tags: string[];
}

export interface AdCreative {
  fileName: string;
  path: string;
}

export interface PromptCreativeMapping {
  prompt: TemplatePrompt;
  creative: AdCreative;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Complete mapping of all 40 template prompts to their respective ad creatives
 */
export const PROMPT_CREATIVE_MAPPINGS: PromptCreativeMapping[] = [
  {
    prompt: {
      id: 1,
      name: 'Headline',
      category: 'Text Rendering',
      aspectRatio: '4:5',
      tags: ['headline', 'copy', 'text', 'static']
    },
    creative: {
      fileName: 'headline.webp',
      path: 'src/mastra/assets/AdCreatives/headline.webp'
    }
  },
  {
    prompt: {
      id: 2,
      name: 'Offer/Promotion',
      category: 'Promotional',
      aspectRatio: '9:16',
      tags: ['offer', 'promotion', 'deal', 'cta']
    },
    creative: {
      fileName: 'offer-promotion.webp',
      path: 'src/mastra/assets/AdCreatives/offer-promotion.webp'
    }
  },
  {
    prompt: {
      id: 3,
      name: 'Testimonials',
      category: 'Social Proof',
      aspectRatio: '9:16',
      tags: ['testimonial', 'quote', 'review', 'environment']
    },
    creative: {
      fileName: 'testimonials.webp',
      path: 'src/mastra/assets/AdCreatives/testimonials.webp'
    }
  },
  {
    prompt: {
      id: 4,
      name: 'Features/Benefits Point-Out',
      category: 'Educational',
      aspectRatio: '4:5',
      tags: ['features', 'benefits', 'diagram', 'educational']
    },
    creative: {
      fileName: 'features-benefits-point-out.webp',
      path: 'src/mastra/assets/AdCreatives/features-benefits-point-out.webp'
    }
  },
  {
    prompt: {
      id: 5,
      name: 'Bullet-Points',
      category: 'Educational',
      aspectRatio: '4:5',
      tags: ['benefits', 'list', 'split-layout', 'bullets']
    },
    creative: {
      fileName: 'bullet-points.webp',
      path: 'src/mastra/assets/AdCreatives/bullet-points.webp'
    }
  },
  {
    prompt: {
      id: 6,
      name: 'Social Proof',
      category: 'Trust Building',
      aspectRatio: '4:5',
      tags: ['social-proof', 'reviews', 'press', 'trust']
    },
    creative: {
      fileName: 'social-proof.webp',
      path: 'src/mastra/assets/AdCreatives/social-proof.webp'
    }
  },
  {
    prompt: {
      id: 7,
      name: 'Us vs Them',
      category: 'Comparison',
      aspectRatio: '4:5',
      tags: ['comparison', 'vs', 'competitor', 'side-by-side']
    },
    creative: {
      fileName: 'us-vs-them.webp',
      path: 'src/mastra/assets/AdCreatives/us-vs-them.webp'
    }
  },
  {
    prompt: {
      id: 8,
      name: 'Before & After (UGC Native)',
      category: 'UGC',
      aspectRatio: '9:16',
      tags: ['before-after', 'ugc', 'transformation', 'native']
    },
    creative: {
      fileName: 'before-and-after-ugc-native.webp',
      path: 'src/mastra/assets/AdCreatives/before-and-after-ugc-native.webp'
    }
  },
  {
    prompt: {
      id: 9,
      name: 'Negative Marketing (Bait & Switch)',
      category: 'Hook',
      aspectRatio: '4:5',
      tags: ['negative-marketing', 'bait-switch', 'hook', 'scroll-stop']
    },
    creative: {
      fileName: 'negative-marketing-bait-and-switch.webp',
      path: 'src/mastra/assets/AdCreatives/negative-marketing-bait-and-switch.webp'
    }
  },
  {
    prompt: {
      id: 10,
      name: 'Press/Editorial',
      category: 'Authority',
      aspectRatio: '4:5',
      tags: ['press', 'editorial', 'authority', 'publications']
    },
    creative: {
      fileName: 'press-editorial.webp',
      path: 'src/mastra/assets/AdCreatives/press-editorial.webp'
    }
  },
  {
    prompt: {
      id: 11,
      name: 'Pull-Quote Review Card',
      category: 'Social Proof',
      aspectRatio: '1:1',
      tags: ['review', 'quote', 'card', 'emotional']
    },
    creative: {
      fileName: 'pull-quote-review-card.webp',
      path: 'src/mastra/assets/AdCreatives/pull-quote-review-card.webp'
    }
  },
  {
    prompt: {
      id: 12,
      name: 'Lifestyle Action + Product Colorway Array',
      category: 'Lifestyle',
      aspectRatio: '1:1',
      tags: ['lifestyle', 'action', 'product-array', 'variants']
    },
    creative: {
      fileName: 'lifestyle-action-product-colorway-array.webp',
      path: 'src/mastra/assets/AdCreatives/lifestyle-action-product-colorway-array.webp'
    }
  },
  {
    prompt: {
      id: 13,
      name: 'Stat Surround / Callout Radial (Product Hero)',
      category: 'Data-Driven',
      aspectRatio: '1:1',
      tags: ['stats', 'callout', 'radial', 'product-hero']
    },
    creative: {
      fileName: 'stat-surround-callout-radial-product-hero.webp',
      path: 'src/mastra/assets/AdCreatives/stat-surround-callout-radial-product-hero.webp'
    }
  },
  {
    prompt: {
      id: 14,
      name: 'Bundle Showcase + Benefit Bar',
      category: 'Product Showcase',
      aspectRatio: '1:1',
      tags: ['bundle', 'system', 'benefits', 'showcase']
    },
    creative: {
      fileName: 'bundle-showcase-benefit-bar.webp',
      path: 'src/mastra/assets/AdCreatives/bundle-showcase-benefit-bar.webp'
    }
  },
  {
    prompt: {
      id: 15,
      name: 'Social Comment Screenshot + Product',
      category: 'Social Proof',
      aspectRatio: '1:1',
      tags: ['social', 'comment', 'screenshot', 'organic']
    },
    creative: {
      fileName: 'social-comment-screenshot-product.webp',
      path: 'src/mastra/assets/AdCreatives/social-comment-screenshot-product.webp'
    }
  },
  {
    prompt: {
      id: 16,
      name: 'Curiosity Gap / Hook Quote Testimonial',
      category: 'Hook',
      aspectRatio: '1:1',
      tags: ['curiosity', 'hook', 'testimonial', 'provocative']
    },
    creative: {
      fileName: 'curiosity-gap-hook-quote-testimonial.webp',
      path: 'src/mastra/assets/AdCreatives/curiosity-gap-hook-quote-testimonial.webp'
    }
  },
  {
    prompt: {
      id: 17,
      name: 'Verified Review Card',
      category: 'Social Proof',
      aspectRatio: '1:1',
      tags: ['review', 'verified', 'card', 'trust']
    },
    creative: {
      fileName: 'verified-review-card.webp',
      path: 'src/mastra/assets/AdCreatives/verified-review-card.webp'
    }
  },
  {
    prompt: {
      id: 18,
      name: 'Stat Surround / Callout Radial (Lifestyle Flatlay)',
      category: 'Data-Driven',
      aspectRatio: '1:1',
      tags: ['stats', 'callout', 'lifestyle', 'flatlay']
    },
    creative: {
      fileName: 'stat-surround-callout-radial-lifestyle-flatlay.webp',
      path: 'src/mastra/assets/AdCreatives/stat-surround-callout-radial-lifestyle-flatlay.webp'
    }
  },
  {
    prompt: {
      id: 19,
      name: 'Highlighted / Annotated Testimonial',
      category: 'Social Proof',
      aspectRatio: '1:1',
      tags: ['testimonial', 'highlighted', 'annotated', 'long-form']
    },
    creative: {
      fileName: 'highlighted-annotated-testimonial.webp',
      path: 'src/mastra/assets/AdCreatives/highlighted-annotated-testimonial.webp'
    }
  },
  {
    prompt: {
      id: 20,
      name: 'Advertorial / Editorial Content Card',
      category: 'Native',
      aspectRatio: '4:5',
      tags: ['advertorial', 'editorial', 'native', 'organic']
    },
    creative: {
      fileName: 'advertorial-editorial-content-card.webp',
      path: 'src/mastra/assets/AdCreatives/advertorial-editorial-content-card.webp'
    }
  },
  {
    prompt: {
      id: 21,
      name: 'Bold Statement / Reaction Headline',
      category: 'Brand Energy',
      aspectRatio: '1:1',
      tags: ['bold', 'statement', 'brand', 'provocative']
    },
    creative: {
      fileName: 'bold-statement-reaction-headline.webp',
      path: 'src/mastra/assets/AdCreatives/bold-statement-reaction-headline.webp'
    }
  },
  {
    prompt: {
      id: 22,
      name: 'Flavor Story / "Tastes Like"',
      category: 'Product Appeal',
      aspectRatio: '1:1',
      tags: ['flavor', 'taste', 'food', 'sensory']
    },
    creative: {
      fileName: 'flavor-story-tastes-like.webp',
      path: 'src/mastra/assets/AdCreatives/flavor-story-tastes-like.webp'
    }
  },
  {
    prompt: {
      id: 23,
      name: 'Long-Form Manifesto / Letter Ad',
      category: 'Copy-Driven',
      aspectRatio: '1:1',
      tags: ['manifesto', 'copy', 'long-form', 'persuasive']
    },
    creative: {
      fileName: 'long-form-manifesto-letter-ad.webp',
      path: 'src/mastra/assets/AdCreatives/long-form-manifesto-letter-ad.webp'
    }
  },
  {
    prompt: {
      id: 24,
      name: 'Product + Comment Callout (Faux Social Proof)',
      category: 'Social Proof',
      aspectRatio: '1:1',
      tags: ['product', 'comment', 'social', 'organic']
    },
    creative: {
      fileName: 'product-comment-callout-faux-social-proof.webp',
      path: 'src/mastra/assets/AdCreatives/product-comment-callout-faux-social-proof.webp'
    }
  },
  {
    prompt: {
      id: 25,
      name: 'Us vs. Them Color Split',
      category: 'Comparison',
      aspectRatio: '1:1',
      tags: ['comparison', 'vs', 'split', 'color-block']
    },
    creative: {
      fileName: 'us-vs-them-color-split.webp',
      path: 'src/mastra/assets/AdCreatives/us-vs-them-color-split.webp'
    }
  },
  {
    prompt: {
      id: 26,
      name: 'Stat Callout (Data-Driven Lifestyle)',
      category: 'Data-Driven',
      aspectRatio: '4:5',
      tags: ['stats', 'data', 'lifestyle', 'results']
    },
    creative: {
      fileName: 'stat-callout-data-driven-lifestyle.webp',
      path: 'src/mastra/assets/AdCreatives/stat-callout-data-driven-lifestyle.webp'
    }
  },
  {
    prompt: {
      id: 27,
      name: 'Benefit Checklist Showcase (Split Product + Info)',
      category: 'Product Showcase',
      aspectRatio: '1:1',
      tags: ['benefits', 'checklist', 'split', 'info']
    },
    creative: {
      fileName: 'benefit-checklist-showcase-split-product-info.webp',
      path: 'src/mastra/assets/AdCreatives/benefit-checklist-showcase-split-product-info.webp'
    }
  },
  {
    prompt: {
      id: 28,
      name: 'Feature Arrow Callout / Product Annotation',
      category: 'Educational',
      aspectRatio: '1:1',
      tags: ['features', 'arrows', 'callout', 'annotation']
    },
    creative: {
      fileName: 'feature-arrow-callout-product-annotation.webp',
      path: 'src/mastra/assets/AdCreatives/feature-arrow-callout-product-annotation.webp'
    }
  },
  {
    prompt: {
      id: 29,
      name: 'UGC + Viral Post Overlay',
      category: 'UGC',
      aspectRatio: '9:16',
      tags: ['ugc', 'viral', 'post', 'native', 'organic']
    },
    creative: {
      fileName: 'ugc-viral-post-overlay.webp',
      path: 'src/mastra/assets/AdCreatives/ugc-viral-post-overlay.webp'
    }
  },
  {
    prompt: {
      id: 30,
      name: 'Hero Statement + Icon Benefit Bar',
      category: 'Product Hero',
      aspectRatio: '1:1',
      tags: ['hero', 'statement', 'icons', 'benefits']
    },
    creative: {
      fileName: 'hero-statement-icon-benefit-bar.webp',
      path: 'src/mastra/assets/AdCreatives/hero-statement-icon-benefit-bar.webp'
    }
  },
  {
    prompt: {
      id: 31,
      name: 'Comparison Grid / Table',
      category: 'Comparison',
      aspectRatio: '1:1',
      tags: ['comparison', 'grid', 'table', 'structured']
    },
    creative: {
      fileName: 'comparison-grid-table.webp',
      path: 'src/mastra/assets/AdCreatives/comparison-grid-table.webp'
    }
  },
  {
    prompt: {
      id: 32,
      name: 'UGC Story Callout / Text Bubble Explainer',
      category: 'UGC',
      aspectRatio: '9:16',
      tags: ['ugc', 'story', 'text-bubble', 'educational']
    },
    creative: {
      fileName: 'ugc-story-callout-text-bubble-explainer.webp',
      path: 'src/mastra/assets/AdCreatives/ugc-story-callout-text-bubble-explainer.webp'
    }
  },
  {
    prompt: {
      id: 33,
      name: 'Faux Press / News Articles Screenshot',
      category: 'Authority',
      aspectRatio: '4:5',
      tags: ['press', 'news', 'screenshot', 'authority']
    },
    creative: {
      fileName: 'faux-press-news-articles-screenshot.webp',
      path: 'src/mastra/assets/AdCreatives/faux-press-news-articles-screenshot.webp'
    }
  },
  {
    prompt: {
      id: 34,
      name: 'Faux iPhone Notes / App Screenshot',
      category: 'Native',
      aspectRatio: '1:1',
      tags: ['iphone', 'notes', 'app', 'screenshot', 'native']
    },
    creative: {
      fileName: 'faux-iphone-notes-app-screenshot.webp',
      path: 'src/mastra/assets/AdCreatives/faux-iphone-notes-app-screenshot.webp'
    }
  },
  {
    prompt: {
      id: 35,
      name: 'Hero Product Showcase + Stat Bar',
      category: 'Product Hero',
      aspectRatio: '1:1',
      tags: ['hero', 'product', 'stats', 'showcase']
    },
    creative: {
      fileName: 'hero-product-showcase-stat-bar.webp',
      path: 'src/mastra/assets/AdCreatives/hero-product-showcase-stat-bar.webp'
    }
  },
  {
    prompt: {
      id: 36,
      name: 'Whiteboard Before / After + Product Hold',
      category: 'Educational',
      aspectRatio: '4:5',
      tags: ['before-after', 'whiteboard', 'educational', 'ugc']
    },
    creative: {
      fileName: 'whiteboard-before-after-product-hold.webp',
      path: 'src/mastra/assets/AdCreatives/whiteboard-before-after-product-hold.webp'
    }
  },
  {
    prompt: {
      id: 37,
      name: 'Hero Statement + Icon Bar + Offer Burst (Promo Variant)',
      category: 'Promotional',
      aspectRatio: '1:1',
      tags: ['hero', 'promo', 'offer', 'burst', 'sale']
    },
    creative: {
      fileName: 'hero-statement-icon-bar-offer-burst-promo-variant.webp',
      path: 'src/mastra/assets/AdCreatives/hero-statement-icon-bar-offer-burst-promo-variant.webp'
    }
  },
  {
    prompt: {
      id: 38,
      name: 'UGC Lifestyle + Product + Review Card (Split)',
      category: 'UGC',
      aspectRatio: '4:5',
      tags: ['ugc', 'lifestyle', 'review', 'split']
    },
    creative: {
      fileName: 'ugc-lifestyle-product-review-card-split.webp',
      path: 'src/mastra/assets/AdCreatives/ugc-lifestyle-product-review-card-split.webp'
    }
  },
  {
    prompt: {
      id: 39,
      name: 'Curiosity Gap + Scroll-Stopper Hook',
      category: 'Hook',
      aspectRatio: '1:1',
      tags: ['curiosity', 'hook', 'scroll-stop', 'provocative']
    },
    creative: {
      fileName: 'curiosity-gap-scroll-stopper-hook.webp',
      path: 'src/mastra/assets/AdCreatives/curiosity-gap-scroll-stopper-hook.webp'
    }
  },
  {
    prompt: {
      id: 40,
      name: 'Native / Ugly Post-It Note Style (Product Hero)',
      category: 'Native',
      aspectRatio: '4:5',
      tags: ['native', 'post-it', 'ugc', 'organic']
    },
    creative: {
      fileName: 'native-ugly-post-it-note-style-product-hero.webp',
      path: 'src/mastra/assets/AdCreatives/native-ugly-post-it-note-style-product-hero.webp'
    }
  }
];

/**
 * Get the base path for the project
 * Handles both development and production environments
 */
function getBasePath(): string {
  // In development, use process.cwd()
  // In production, you might need to adjust this based on your build setup
  return process.cwd();
}

/**
 * Validates the complete mapping to ensure all prompts have corresponding creatives
 * and that all creative files exist on disk
 */
export function validateMapping(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const basePath = getBasePath();

  // Check if we have exactly 40 mappings
  if (PROMPT_CREATIVE_MAPPINGS.length !== 40) {
    errors.push(
      `Expected 40 mappings but found ${PROMPT_CREATIVE_MAPPINGS.length}`
    );
  }

  // Check for duplicate prompt IDs
  const promptIds = new Set<number>();
  const creativeFileNames = new Set<string>();

  for (const mapping of PROMPT_CREATIVE_MAPPINGS) {
    const { prompt, creative } = mapping;

    // Check for duplicate prompt ID
    if (promptIds.has(prompt.id)) {
      errors.push(`Duplicate prompt ID found: ${prompt.id}`);
    }
    promptIds.add(prompt.id);

    // Check for duplicate creative file
    if (creativeFileNames.has(creative.fileName)) {
      warnings.push(`Duplicate creative file found: ${creative.fileName}`);
    }
    creativeFileNames.add(creative.fileName);

    // Check if file exists
    const fullPath = join(basePath, creative.path);
    if (!existsSync(fullPath)) {
      errors.push(
        `Creative file not found: ${creative.fileName} at ${fullPath}`
      );
    }

    // Validate prompt ID range
    if (prompt.id < 1 || prompt.id > 40) {
      errors.push(`Invalid prompt ID: ${prompt.id} (must be between 1 and 40)`);
    }

    // Validate aspect ratio
    if (!['1:1', '4:5', '9:16'].includes(prompt.aspectRatio)) {
      errors.push(
        `Invalid aspect ratio for prompt ${prompt.id}: ${prompt.aspectRatio}`
      );
    }
  }

  // Check for missing prompt IDs (should be sequential from 1 to 40)
  for (let i = 1; i <= 40; i++) {
    if (!promptIds.has(i)) {
      errors.push(`Missing prompt ID: ${i}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Get the ad creative for a specific prompt ID
 */
export function getCreativeForPrompt(promptId: number): PromptCreativeMapping | undefined {
  return PROMPT_CREATIVE_MAPPINGS.find(mapping => mapping.prompt.id === promptId);
}

/**
 * Get all prompts for a specific aspect ratio
 */
export function getPromptsByAspectRatio(aspectRatio: '1:1' | '4:5' | '9:16'): PromptCreativeMapping[] {
  return PROMPT_CREATIVE_MAPPINGS.filter(
    mapping => mapping.prompt.aspectRatio === aspectRatio
  );
}

/**
 * Get all prompts for a specific category
 */
export function getPromptsByCategory(category: string): PromptCreativeMapping[] {
  return PROMPT_CREATIVE_MAPPINGS.filter(
    mapping => mapping.prompt.category === category
  );
}

/**
 * Get all prompts that have a specific tag
 */
export function getPromptsByTag(tag: string): PromptCreativeMapping[] {
  return PROMPT_CREATIVE_MAPPINGS.filter(
    mapping => mapping.prompt.tags.includes(tag)
  );
}

/**
 * Get all available categories
 */
export function getAllCategories(): string[] {
  const categories = new Set<string>();
  PROMPT_CREATIVE_MAPPINGS.forEach(mapping => {
    categories.add(mapping.prompt.category);
  });
  return Array.from(categories).sort();
}

/**
 * Get all available tags
 */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  PROMPT_CREATIVE_MAPPINGS.forEach(mapping => {
    mapping.prompt.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
}

/**
 * Get all mappings
 */
export function getAllMappings(): PromptCreativeMapping[] {
  return PROMPT_CREATIVE_MAPPINGS;
}

/**
 * Get a mapping by prompt name (case-insensitive)
 */
export function getCreativeByPromptName(name: string): PromptCreativeMapping | undefined {
  const normalizedName = name.toLowerCase();
  return PROMPT_CREATIVE_MAPPINGS.find(
    mapping => mapping.prompt.name.toLowerCase() === normalizedName
  );
}
