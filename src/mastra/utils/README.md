# Prompt-Creative Mapping System

This directory contains the TypeScript mapping system that links template prompts to their corresponding ad creative files.

## Files

- `prompt-creative-mapping.ts` - Main mapping file with all 40 prompts mapped to creatives
- `validate-mappings.ts` - Validation script to ensure integrity

## Usage

### Import the mapping in your code

```typescript
import {
  getCreativeForPrompt,
  getPromptsByAspectRatio,
  getPromptsByCategory,
  getPromptsByTag,
  getAllMappings,
  validateMapping
} from './utils/prompt-creative-mapping';

// Get a specific creative by prompt ID
const creative = getCreativeForPrompt(1);
console.log(creative?.creative.path); // src/mastra/assets/AdCreatives/headline.webp

// Get all prompts for a specific aspect ratio
const squarePrompts = getPromptsByAspectRatio('1:1');
console.log(`Found ${squarePrompts.length} square format prompts`);

// Get all prompts in a category
const socialProof = getPromptsByCategory('Social Proof');

// Get prompts by tag
const ugcPrompts = getPromptsByTag('ugc');

// Get all mappings
const allMappings = getAllMappings();
```

### Validate the mappings

```bash
# Run validation to check all mappings are correct
npx tsx src/mastra/utils/validate-mappings.ts
```

The validation checks:
- All 40 prompts are mapped
- No duplicate prompt IDs
- All creative files exist on disk
- Valid aspect ratios (1:1, 4:5, or 9:16)
- Sequential prompt IDs from 1-40

## Data Structure

### PromptCreativeMapping

```typescript
interface PromptCreativeMapping {
  prompt: {
    id: number;              // 1-40
    name: string;            // Human-readable name
    category: string;        // Template category
    aspectRatio: '1:1' | '4:5' | '9:16';
    tags: string[];          // Searchable tags
  };
  creative: {
    fileName: string;        // kebab-case filename
    path: string;            // Relative path from project root
  };
}
```

## Statistics

- **Total Templates**: 40
- **Categories**: 17
- **Unique Tags**: 99
- **Aspect Ratios**:
  - 1:1 (Square): 22 templates
  - 4:5 (Portrait): 13 templates
  - 9:16 (Story): 5 templates

## Categories

- Authority
- Brand Energy
- Comparison
- Copy-Driven
- Data-Driven
- Educational
- Hook
- Lifestyle
- Native
- Product Appeal
- Product Hero
- Product Showcase
- Promotional
- Social Proof
- Text Rendering
- Trust Building
- UGC

## File Naming Convention

All ad creative files use kebab-case naming:
- Spaces → hyphens
- Special characters (`:`, `&`, `/`, `(`, `)`) → removed or converted
- Example: `"Before & After (UGC Native).webp"` → `"before-and-after-ugc-native.webp"`
