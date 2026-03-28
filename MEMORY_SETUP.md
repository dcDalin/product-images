# Memory Setup Guide

Memory has been enabled for the Ad Creative Generator project, allowing the product analyzer agent to maintain context across conversations.

## What's Configured

### 1. Storage Provider (src/mastra/index.ts)

The Mastra instance has LibSQLStore configured as the storage backend:

```typescript
export const mastra = new Mastra({
  storage: new LibSQLStore({
    id: "mastra-storage",
    url: "file:./mastra.db",
  }),
  // ... other config
})
```

This enables:
- Persistent storage for message history
- Observability data
- Scores and evaluations
- All memory-related data

### 2. Agent Memory (src/mastra/agents/product-analyzer-agent.ts)

The productAnalyzerAgent now has memory enabled:

```typescript
export const productAnalyzerAgent = new Agent({
  id: 'productAnalyzerAgent',
  name: 'Product Analyzer',
  model: 'openai/gpt-5.4',
  tools: { listTemplates: listTemplatesTool },
  memory: new Memory(),
})
```

## How Memory Works

### Message History

When you call the agent with memory identifiers, it will remember the conversation:

```typescript
const response = await productAnalyzerAgent.generate(
  'Analyze this product: EcoBottle Pro - sustainable water bottle',
  {
    memory: {
      resource: 'user-123',       // Stable user/entity identifier
      thread: 'conversation-456'  // Specific conversation thread
    }
  }
)
```

In subsequent calls with the same `resource` and `thread`, the agent will recall previous exchanges:

```typescript
const followUp = await productAnalyzerAgent.generate(
  'What templates did you recommend for that product?',
  {
    memory: {
      resource: 'user-123',
      thread: 'conversation-456'  // Same thread = remembers context
    }
  }
)
// Agent will remember it analyzed EcoBottle Pro
```

### Memory in Workflows

Currently, the productAnalyzerAgent is used within the workflow via a single structured output call. Memory is most useful when:

1. **Testing in Studio** - Interactive conversations with the agent
2. **Direct API calls** - Multi-turn conversations outside the workflow
3. **Future enhancements** - If you add conversational features to the workflow

### Memory Scope

- **Resource** (`resource: 'user-123'`): Identifies the user or entity
- **Thread** (`thread: 'conversation-456'`): Isolates specific conversations

Different threads for the same resource = separate conversations
Same thread = continues the conversation

## Storage Location

Memory data is persisted in:
- `./mastra.db` - SQLite database file
- `./mastra.db-shm` - Shared memory file
- `./mastra.db-wal` - Write-ahead log

These files are automatically managed by Mastra.

## Memory Features Available

With the current setup, you can use:

### 1. Message History (Enabled)
- Tracks user messages and agent responses
- Accessible across workflow runs with same resource/thread

### 2. Observational Memory (Optional)
To enable compressed long-term memory:

```typescript
memory: new Memory({
  options: {
    observationalMemory: true,
  },
})
```

### 3. Working Memory (Optional)
To store persistent structured data:

```typescript
memory: new Memory({
  options: {
    workingMemory: true,
  },
})
```

### 4. Semantic Recall (Optional)
To enable vector-based message retrieval:

```typescript
memory: new Memory({
  options: {
    semanticRecall: true,
  },
})
```

## Viewing Memory in Studio

1. Start the dev server: `npm run dev`
2. Open Mastra Studio: `http://localhost:4111`
3. Navigate to the Product Analyzer agent
4. Start a conversation - memory info appears in the right sidebar
5. View message history, observations, and context

## Memory in Observability

Memory operations are tracked in Mastra's observability:

1. Go to **Observability** tab in Studio
2. Select an agent run
3. Expand spans to see:
   - Memory retrieval operations
   - Messages included in context
   - Observation generation (if enabled)

## Best Practices

### For Product Analysis

Since the agent is primarily used in workflows for single analyses:
- Memory is useful for interactive testing in Studio
- Consider adding conversational features if users need to refine recommendations
- Use different `thread` IDs for each product analysis to keep contexts separate

### Thread Management

```typescript
// New product analysis = new thread
const thread1 = `analysis-${Date.now()}`
await agent.generate('Analyze Product A', {
  memory: { resource: 'user-123', thread: thread1 }
})

// Different product = different thread
const thread2 = `analysis-${Date.now()}`
await agent.generate('Analyze Product B', {
  memory: { resource: 'user-123', thread: thread2 }
})
```

### Resource IDs

Use stable identifiers:
- User ID: `user-${userId}`
- Session ID: `session-${sessionId}`
- Organization: `org-${orgId}`

## Troubleshooting

### Memory not persisting
- Check that `mastra.db` file exists
- Verify `resource` and `thread` IDs match across calls
- Ensure storage is configured in `src/mastra/index.ts`

### Context too large
- Enable `observationalMemory` to compress old messages
- Limit `lastMessages` in Memory config
- Use memory processors to filter content

### Performance issues
- Monitor message history size
- Enable observational memory for long conversations
- Use semantic recall instead of full history when needed

## Related Documentation

- [Mastra Memory Docs](https://mastra.ai/docs/memory/overview)
- [Observational Memory](https://mastra.ai/docs/memory/observational-memory)
- [Working Memory](https://mastra.ai/docs/memory/working-memory)
- [Storage Providers](https://mastra.ai/docs/memory/storage)
