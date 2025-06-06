# Recoup Evaluation System

This directory contains our **Braintrust-based evaluation framework** for testing and improving our AI systems.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- Braintrust API key in `.env` file: `BRAINTRUST_API_KEY=your_key_here`

### Running Evaluations
```bash
# Run any evaluation script
pnpm dlx braintrust eval evals/tutorial.eval.ts

# Run specific evaluation
pnpm dlx braintrust eval evals/your-eval.eval.ts
```

## 📁 Structure

```
evals/
├── README.md                    # This documentation
├── tutorial.eval.ts             # Working Braintrust tutorial example
├── data/                        # Evaluation datasets
│   └── recoup-questions.jsonl   # 20 legacy questions about music/fan data
└── [future-evaluations].eval.ts # Additional evaluations
```

## 📊 Current Evaluations

### `tutorial.eval.ts`
- **Purpose**: Basic Braintrust tutorial example
- **Score**: 77.78% (Levenshtein distance)
- **Status**: ✅ Working
- **URL**: [View Results](https://www.braintrust.dev/app/Recoup/p/Say%20Hi%20Bot/experiments/sidney%2Finstallevals-1749233257)

### Legacy Data (`data/recoup-questions.jsonl`)
- **Source**: Archived Python evaluation system
- **Content**: 20 questions about music streaming & fan engagement
- **Purpose**: Available for migration to Braintrust format
- **Example Questions**:
  - "What is the total number of fans with a premium Spotify account?"
  - "How many fans have a free Spotify account?"
  - "What are the top five artists that fans are listening to?"

## 🛠️ Creating New Evaluations

Follow the Braintrust pattern in `tutorial.eval.ts`:

```typescript
import { Eval } from "braintrust";
import { Levenshtein } from "autoevals";

Eval("Your Eval Name", {
  data: () => [
    { input: "test input", expected: "expected output" }
  ],
  task: async (input: string) => {
    // Your AI system call here
    return "actual output";
  },
  scores: [Levenshtein], // or other scoring functions
});
```

## 📈 Viewing Results

All evaluation results are available in the [Braintrust Dashboard](https://www.braintrust.dev/app/Recoup).

## 🗃️ Archive

The previous Python-based evaluation system has been archived in `evals-archive-python/` for reference. 