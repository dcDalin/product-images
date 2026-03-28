# Workflow State Usage Guide

The Ad Creative Generator workflow now includes comprehensive state tracking to monitor progress, performance, and execution details across all steps.

## What is Workflow State?

Workflow state is a shared data store that persists across all workflow steps. Unlike step input/output (which flows sequentially from one step to the next), state is accessible to all steps and provides:

- **Progress tracking** - Monitor which step is currently executing
- **Performance metrics** - Track execution time for each step
- **Statistics** - Count generated assets and creatives
- **Warnings** - Collect non-fatal issues encountered during execution
- **Template metadata** - Track which templates were selected and why

## State Schema

The workflow state includes:

```typescript
{
  // Progress tracking
  progressLog: string[]           // Log messages from each step
  currentStep: string             // Currently executing step name

  // Template selection metadata
  selectedTemplateIds?: number[]  // IDs of selected templates
  templateSelectionStrategy?: "ai" | "manual"

  // Generation statistics
  totalCreativesGenerated: number // Count of generated creatives
  totalAssets: {
    logoCount: number
    productImageCount: number
  }

  // Warnings and issues
  warnings: Array<{
    step: string
    message: string
    timestamp: string
  }>

  // Performance timings (in milliseconds)
  timings: {
    processAssets?: number
    analyzeProduct?: number
    prepareGenerationTasks?: number
    customizePrompts?: number
    generateImages?: number
    saveCreatives?: number
  }
}
```

## Running the Workflow with State

### Basic Usage

```typescript
import { generateAdCreativesWorkflow, createInitialState } from './workflows/generate-ad-creatives-workflow'

// Create a workflow run
const run = await generateAdCreativesWorkflow.createRun()

// Start with initial state
const result = await run.start({
  inputData: {
    productTitle: "EcoBottle Pro",
    productDescription: "Sustainable water bottle with temperature control",
    logo: "path/to/logo.png",
    productImages: ["path/to/product.jpg"],
    templateSelectionMode: "ai",
    creativesPerTemplate: 2
  },
  initialState: createInitialState()
})

console.log('Workflow completed:', result)
```

### Accessing State During Execution

State is automatically tracked throughout the workflow. You can access it in real-time using workflow snapshots or observability:

```typescript
// In Mastra Studio, view the state in the workflow execution details
// State updates are visible in the Observability traces
```

### Inspecting Final State

After workflow completion, you can view the complete state history in:

1. **Mastra Studio** - Observability tab shows all state updates
2. **Workflow snapshots** - State is persisted at each step
3. **Logs** - Progress messages are logged to console

## State Benefits

### 1. Progress Monitoring

Track exactly where the workflow is in its execution:

```
progressLog: [
  "Started processing assets",
  "Processed 1 logo and 3 product images in 245ms",
  "Started AI product analysis",
  "AI analysis complete: Recommended 12 templates in 1534ms",
  "Prepared 10 generation tasks...",
  ...
]
```

### 2. Performance Analysis

Identify bottlenecks and optimize slow steps:

```
timings: {
  processAssets: 245,
  analyzeProduct: 1534,
  prepareGenerationTasks: 23,
  customizePrompts: 156,
  generateImages: 8942,  // Slowest step
  saveCreatives: 312
}
```

### 3. Debugging

When issues occur, state provides context about:
- Which step failed
- What data was available at failure
- Any warnings that preceded the error

### 4. Auditing

Track template selection decisions:

```
selectedTemplateIds: [1, 5, 11, 15, 21]
templateSelectionStrategy: "ai"
```

## Advanced: Accessing State in Custom Steps

If you create additional workflow steps, you can access and update state:

```typescript
import { createStep } from "@mastra/core/workflows"
import { workflowStateSchema } from "./types/workflow-state-types"

const customStep = createStep({
  id: "custom-step",
  stateSchema: workflowStateSchema,
  execute: async ({ state, setState }) => {
    // Read current state
    console.log('Current step:', state.currentStep)
    console.log('Total creatives so far:', state.totalCreativesGenerated)

    // Update state
    await setState({
      ...state,
      currentStep: "custom-step",
      progressLog: [...state.progressLog, "Custom processing started"],
      warnings: [
        ...state.warnings,
        {
          step: "custom-step",
          message: "Example warning",
          timestamp: new Date().toISOString()
        }
      ]
    })

    return { /* step output */ }
  }
})
```

## State vs Step Input/Output

**Use state for:**
- Cross-cutting concerns (logging, timing, warnings)
- Metadata that doesn't affect step logic
- Accumulating statistics
- Progress tracking

**Use step input/output for:**
- Data that flows from one step to the next
- Required information for step execution
- Data transformations
- Business logic

## Observability Integration

State updates are automatically captured in Mastra's observability traces. View them in:

1. **Mastra Studio** → Observability tab
2. Select a workflow run
3. Expand any step to see state before/after execution

## Related Documentation

- [Mastra Workflow State Docs](https://mastra.ai/docs/workflows/workflow-state)
- [Observability](https://mastra.ai/docs/observability/tracing/overview)
- [Workflow Snapshots](https://mastra.ai/docs/workflows/snapshots)
