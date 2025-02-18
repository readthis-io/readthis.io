---
title: "LLMs as Rubber Ducks: Rethinking AI's Role in Development"
tags:
  - development
  - ai
  - llm
  - productivity
  - best-practices
topic: development
featuredImage: rubber-duck.webp
description: "A personal journey of how I transformed my development process by using LLMs as intelligent rubber ducks. Learn why copying AI-generated code is the wrong approach, and discover a better way to collaborate with AI."
created: "2025-02-18T10:00:00Z"
author: Senad Redzic
featured: true
---

## The Awakening

Let me tell you a story about how I was wrong about AI in development.

Like many developers, I initially dismissed LLMs as glorified code generators. I watched colleagues copy-paste solutions from ChatGPT, creating what I call "zombie codebases" - they walk and talk, but there's no soul inside. No understanding. No intentionality.

Then something changed. During a particularly frustrating debugging session, I found myself explaining my problem to ChatGPT, just like I used to do with my rubber duck. But unlike my faithful plastic companion, it asked questions back. Good questions. Questions that made me think.

That's when it hit me: I'd been looking at LLMs all wrong.

## The Rubber Duck Revolution

For those unfamiliar with rubber duck debugging, it's a method where you explain your code line by line to a rubber duck. The act of articulating your problem often leads to discovering the solution. It's surprisingly effective, but it has limitations - your rubber duck never challenges your assumptions.

This is where LLMs come in. They're like rubber ducks that:

- Ask probing questions
- Challenge your assumptions
- Suggest alternative perspectives
- Point out potential issues you haven't considered

But here's the crucial part: they do this without writing a single line of code for you.

## My Golden Rules

After months of refining my approach, I've developed three fundamental rules:

1. **Never Ask for Direct Solutions**
   Instead of "How do I implement X?", I ask "What should I consider when implementing X?" or "What are the potential pitfalls of approach Y?"

2. **Use LLMs as Thought Partners**
   I discuss architecture, debate trade-offs, and explore edge cases. The implementation remains my responsibility.

3. **Different Models for Different Conversations**

   Not all LLMs are created equal. I've found that each model has its own "personality" and strengths. Some are better at deep technical discussions, others excel at spotting patterns in code, and some are particularly good at architectural thinking.

   The key is understanding these differences. For example:

   - Some models are better at maintaining long-term context
   - Others are more precise with technical details
   - Some excel at creative problem-solving
   - Others are better at systematic analysis

   By matching the model to the type of conversation I want to have, I get much better results.

   The goal isn't to find the "best" model, but to understand how each one thinks and leverage that for different types of problems. This approach has made my development process much more efficient.

## Why Rubber Ducks?

The rubber duck analogy is fundamental to understanding how to use LLMs effectively. Here's why:

### The Power of Articulation

When you explain a problem to someone (or something), you're forced to:

- Break down complex issues into digestible pieces
- Question your assumptions
- Find gaps in your logic
- Discover solutions you overlooked

But LLMs take this further. They're interactive rubber ducks that can spot patterns in your thinking and challenge your blind spots.

## The Hallucination Problem

Let's talk about the elephant in the room: LLM hallucinations. I've seen developers blindly trust AI-generated code, leading to:

- Security vulnerabilities from imagined API parameters
- Performance issues from non-existent optimizations
- Integration bugs from hallucinated library features

This is why I never copy code directly from LLMs. Instead, I use them to:

- Validate my approach
- Explore potential edge cases
- Question my assumptions
- Guide my research

## Context Is King

One of the most powerful aspects of using LLMs as rubber ducks is their ability to maintain context. But this is also where you need to be careful.

### Managing Context Effectively

1. **Start Broad, Go Deep**

   ```
   ❌ "How do I fix this bug?"
   ✅ "I'm working on a Node.js microservice that handles..."
   ```

2. **Build Context Incrementally**

   - Start with system architecture
   - Add specific component details
   - Describe the current problem
   - Explain your attempted solutions

3. **Verify Understanding**

   Have the LLM summarize its understanding before proceeding with detailed discussions.

## Security Considerations

### Data Protection

Never share:

- API keys or secrets
- Production database schemas
- User data or PII
- Internal security measures

Instead, abstract sensitive information:

```python:blog/llms-as-rubber-ducks/index.md
# ❌ Don't share
api_key = "ak_live_12345..."

# ✅ Do share
api_key = "API_KEY_PLACEHOLDER"
```

### Code Security

When discussing security-related code:

1. Use pseudocode for sensitive logic
2. Focus on patterns rather than implementation
3. Verify suggestions against security best practices
4. Never trust security advice without verification

## Advanced Conversation Patterns

### The Art of Asking Questions

After spending countless nights debugging ML pipelines and architecting distributed systems, I've learned something crucial: the quality of your questions determines the quality of your solutions. When I first started using LLMs, I made the same mistake as everyone else - asking for quick fixes. Now, I treat them as architectural thought partners, and here's how:

1. **Start High, Go Deep**

   ```
   ❌ "Give me code for an ML pipeline"

   ✅ "I'm building a recommendation system that needs to:
   - Process user behavior in real-time
   - Update models daily without downtime
   - Handle 10M+ users
   Let's discuss potential architectures before diving into implementation."
   ```

2. **Focus on Understanding**

   ```
   ❌ "How do I fix this error?"

   ✅ "My distributed training job is failing with OOM errors.
   Current setup:
   - 8 GPU nodes
   - Batch size 256
   - Complex transformer architecture
   What areas should I investigate first?"
   ```

3. **Challenge Assumptions**

   ```
   ❌ "What's the best database for my app?"

   ✅ "I'm assuming PostgreSQL for our ML metadata store because:
   - We need ACID transactions
   - Complex query support
   - JSON field capabilities
   What trade-offs am I missing in this decision?"
   ```

## Conclusion

LLMs aren't magic - they're tools. Like any tool, their value comes from how you use them. By treating them as intelligent rubber ducks rather than code generators, we maintain control while leveraging their capabilities.

Remember:

- Question everything
- Understand deeply
- Implement thoughtfully
- Validate rigorously

The future of development isn't about letting AI write our code - it's about having smarter conversations about the code we write.
