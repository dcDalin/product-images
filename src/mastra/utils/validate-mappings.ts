/**
 * Validation script to check if all prompt-creative mappings are correct
 * Run this to ensure all 40 prompts have valid creative files
 */

import { validateMapping, getAllCategories, getAllTags, getPromptsByAspectRatio } from './prompt-creative-mapping';

function runValidation() {
  console.log('🔍 Validating Prompt-Creative Mappings...\n');

  const result = validateMapping();

  if (result.isValid) {
    console.log('✅ All mappings are valid!\n');
  } else {
    console.log('❌ Validation failed!\n');
  }

  if (result.errors.length > 0) {
    console.log('Errors:');
    result.errors.forEach(error => console.log(`  - ${error}`));
    console.log('');
  }

  if (result.warnings.length > 0) {
    console.log('Warnings:');
    result.warnings.forEach(warning => console.log(`  - ${warning}`));
    console.log('');
  }

  // Print statistics
  console.log('📊 Statistics:');
  console.log(`  Total mappings: 40`);
  console.log(`  Categories: ${getAllCategories().length}`);
  console.log(`  Tags: ${getAllTags().length}`);
  console.log(`  1:1 aspect ratio: ${getPromptsByAspectRatio('1:1').length}`);
  console.log(`  4:5 aspect ratio: ${getPromptsByAspectRatio('4:5').length}`);
  console.log(`  9:16 aspect ratio: ${getPromptsByAspectRatio('9:16').length}`);
  console.log('');

  console.log('📁 Categories:');
  getAllCategories().forEach(category => console.log(`  - ${category}`));

  return result.isValid;
}

export { runValidation };

// Run validation if this file is executed directly
const isValid = runValidation();
if (!isValid) {
  process.exit(1);
}
