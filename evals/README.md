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

# Evaluations

Evaluations are a method to measure the performance of your AI application. Performance is an overloaded word in AI—in traditional
software it means "speed" (e.g. the number of milliseconds required to complete a request), but in AI, it usually means "accuracy"
or “quality”.

![Eval Screenshot](/docs/diff-view.png)

## Why are evals important?

In AI development, it's hard for teams to understand how an update will impact performance. This breaks the dev loop, making
iteration feel like guesswork instead of engineering.

Evaluations solve this, helping you distill the craziness of AI applications into an effective feedback loop that enables you
to ship more reliable, higher quality products.

Specifically, great evals help you:

* Understand whether an update is an improvement or a regression
* Quickly drill down into good / bad examples
* Diff specific examples vs. prior runs
* Avoid playing whack-a-mole

## Breaking down evals

Evals consist of 3 parts:

* Data: a set of examples to test your application on
* Task: the AI function you want to test (any function that takes in an `input` and returns an `output`)
* Scores: a set of scoring functions that take an `input`, `output`, and optional `expected` value and compute a score

You can establish an `Eval()` function with these 3 pieces:

<CodeTabs>
  <TSTab>
    ```typescript
    import { Eval } from "braintrust";
    import { Levenshtein } from "autoevals";

    Eval(
      "Say Hi Bot", // Replace with your project name
      {
        data: () => {
          return [
            {
              input: "Foo",
              expected: "Hi Foo",
            },
            {
              input: "Bar",
              expected: "Hello Bar",
            },
          ]; // Replace with your eval dataset
        },
        task: async (input) => {
          return "Hi " + input; // Replace with your LLM call
        },
        scores: [Levenshtein],
      },
    );
    ```
  </TSTab>

  <PYTab>
    ```python
    from braintrust import Eval

    from autoevals import Levenshtein

    Eval(
        "Say Hi Bot",  # Replace with your project name
        data=lambda: [
            {
                "input": "Foo",
                "expected": "Hi Foo",
            },
            {
                "input": "Bar",
                "expected": "Hello Bar",
            },
        ],  # Replace with your eval dataset
        task=lambda input: "Hi " + input,  # Replace with your LLM call
        scores=[Levenshtein],
    )
    ```
  </PYTab>
</CodeTabs>

(see the [full tutorial](/docs/welcome/start) for more details)

## Viewing evals

Running your eval function will automatically log your results to Braintrust,
display a summary in your terminal, and populate the UI:

![Eval in UI](./eval-summary.png)

This gives you great visibility into how your AI application performed.
Specifically, you can:

1. Preview each test case and score in a table
2. Filter by high/low scores
3. Click into any individual example and see detailed tracing
4. See high level scores
5. Sort by improvements or regressions

## Where to go from here

Now that you understand the basics of evals, you can dive deeper into the following topics:

* [Run through a tutorial to get your first eval running](/docs/welcome/start)
* [Writing evals](/docs/guides/evals/write)
* [Running evals locally, in CI, or in production](/docs/guides/evals/run)
* [Interpreting eval results](/docs/guides/evals/interpret)

# Write evals

An `Eval()` statement logs results to a Braintrust project. (Note: you can have multiple eval statements for one project and/or multiple eval statements in one file.)

<CodeTabs>
  <TSTab>
    The first argument is the name of the project, and the second argument is an object with the following properties:

    * `data`, a function that returns an evaluation dataset: a list of inputs, expected outputs (optional), and metadata
    * `task`, a function that takes a single input and returns an output (usually an LLM completion)
    * `scores`, a set of scoring functions that take an input, output, and expected output (optional) and return a score
    * `metadata` about the experiment, like the model you're using or configuration values
    * `experimentName` a name to use for the experiment. Braintrust will automatically add a unique suffix if this name already exists.

    The return value of `Eval()` includes the full results of the eval as well as a summary that you can use to
    see the average scores, duration, improvements, regressions, and other metrics.

    ```typescript title="basic.eval.ts"
    import { Eval } from "braintrust";
    import { Factuality } from "autoevals";

    Eval(
      "Say Hi Bot", // Replace with your project name
      {
        data: () => {
          return [
            {
              input: "David",
              expected: "Hi David",
            },
          ]; // Replace with your eval dataset
        },
        task: (input) => {
          return "Hi " + input; // Replace with your LLM call
        },
        scores: [Factuality],
      },
    );
    ```

    For a full list of parameters, see the [SDK docs](/docs/reference/libs/nodejs/interfaces/Evaluator).
  </TSTab>

  <PYTab>
    The first argument is the name of the project, and the remaining arguments allow you to specify the following:

    * `data`, a function that returns an evaluation dataset: a list of inputs, expected outputs (optional), and metadata
    * `task`, a function that takes a single input and returns an output like an LLM completion
    * `scores`, a set of scoring functions that take an input, output, and expected output (optional) and return a score
    * `metadata` about the experiment, like the model you're using or configuration values
    * `experiment_name` a name to use for the experiment. Braintrust will automatically add a unique suffix if this name already exists.

    The return value of `Eval()` includes the full results of the eval as well as a summary that you can use to
    see the average scores, duration, improvements, regressions, and other metrics.

    ```python title="eval_basic.py"
    from braintrust import Eval

    from autoevals import Factuality

    Eval(
        "Say Hi Bot",  # Replace with your project name
        data=lambda: [
            {
                "input": "David",
                "expected": "Hi David",
            },
        ],  # Replace with your eval dataset
        task=lambda input: "Hi " + input,  # Replace with your LLM call
        scores=[Factuality],
    )
    ```

    For a full list of parameters, see the [SDK docs](/docs/reference/libs/python#evaluator-objects).
  </PYTab>
</CodeTabs>

## Data

An evaluation dataset is a list of test cases. Each has an input and optional expected output, metadata, and tags. The key fields in a data record are:

* **Input**: The arguments that uniquely define a test case (an arbitrary, JSON serializable object). Braintrust uses the `input` to know whether
  two test cases are the same between evaluation runs, so the cases should not contain run-specific state. A simple rule of thumb is that if you run the same
  eval twice, the `input` should be identical.
* **Expected**. (Optional) the ground truth value (an arbitrary, JSON serializable object) that you'd compare to `output` to determine if your `output` value is
  correct or not. Braintrust currently does not compare `output` to `expected` for you, since there are many different ways to do that correctly. For example, you
  may use a subfield in `expected` to compare to a subfield in `output` for a certain scoring function. Instead, these values are just used to help you navigate
  your evals while debugging and comparing results.
* **Metadata**. (Optional) a dictionary with additional data about the test example, model outputs, or just about anything else that's relevant, that you can use
  to help find and analyze examples later. For example, you could log the `prompt`, example's `id`, model parameters, or anything else that would be useful to
  slice/dice later.
* **Tags**. (Optional) a list of strings that you can use to filter and group records later.

### Getting started

To get started with evals, you need some test data. A fine starting point is to write 5-10 examples that you believe are representative. The data must have an input
field (which could be complex JSON, or just a string) and should ideally have an expected output field, (although this is not required).

Once you have an evaluation set up end-to-end, you can always add more test cases. You'll know you need more data if your eval scores and outputs seem fine, but your production
app doesn't look right. And once you have Braintrust's [Logging](/docs/guides/logging) set up, your real application data will provide a rich source of examples to use as test cases.

As you scale, Braintrust's [Datasets](/docs/guides/datasets) are a great tool for managing your test cases.

<Callout type="warn">
  It's a common misconception that you need a large volume of perfectly labeled
  evaluation data, but that's not the case. In practice, it's better to assume
  your data is noisy, your AI model is imperfect, and your scoring methods are a little
  bit wrong. The goal of evaluation is to assess each of these components and
  improve them over time.
</Callout>

### Specifying an existing dataset in evals

In addition to providing inline data examples when you call the `Eval()` function, you can also [pass an existing or newly initialized dataset](/docs/guides/datasets#using-a-dataset-in-an-evaluation).

## Scorers

A scoring function allows you to compare the expected output of a task to the actual output and produce a score
between 0 and 1. You use a scoring function by referencing it in the `scores` array in your eval.

We recommend starting with the scorers provided by Braintrust's [autoevals library](/docs/autoevals). They work out of the box and will get you up and running quickly. Just like with test cases, once you begin running evaluations, you will find areas that need improvement. This will lead you create your own scorers, customized to your usecases, to get a well rounded view of your application's
performance.

### Define your own scorers

You can define your own score, e.g.

<CodeTabs>
  <TSTab>
    ```typescript {4-9, 25}
    import { Eval } from "braintrust";
    import { Factuality } from "autoevals";

    const exactMatch = (args: {
      input: string;
      output: string;
      expected: string;
    }) => {
      return {
        name: "Exact match",
        score: args.output === args.expected ? 1 : 0,
      };
    };

    Eval(
      "Say Hi Bot", // Replace with your project name
      {
        data: () => {
          return [
            {
              input: "David",
              expected: "Hi David",
            },
          ]; // Replace with your eval dataset
        },
        task: (input) => {
          return "Hi " + input; // Replace with your LLM call
        },
        scores: [Factuality, exactMatch],
      },
    );
    ```
  </TSTab>

  <PYTab>
    ```python {4-5, 16}
    from braintrust import Eval

    from autoevals import Factuality


    def exact_match(input, expected, output):
        return 1 if output == expected else 0


    Eval(
        "Say Hi Bot",  # Replace with your project name
        data=lambda: [
            {
                "input": "David",
                "expected": "Hi David",
            },
        ],  # Replace with your eval dataset
        task=lambda input: "Hi " + input,  # Replace with your LLM call
        scores=[Factuality, exact_match],
    )
    ```
  </PYTab>
</CodeTabs>

### Score using AI

You can also define your own prompt-based scoring functions. For example,

<CodeTabs>
  <TSTab>
    ```typescript {4-12, 28}
    import { Eval } from "braintrust";
    import { LLMClassifierFromTemplate } from "autoevals";

    const noApology = LLMClassifierFromTemplate({
      name: "No apology",
      promptTemplate: "Does the response contain an apology? (Y/N)\n\n{{output}}",
      choiceScores: {
        Y: 0,
        N: 1,
      },
      useCoT: true,
    });

    Eval(
      "Say Hi Bot", // Replace with your project name
      {
        data: () => {
          return [
            {
              input: "David",
              expected: "Hi David",
            },
          ]; // Replace with your eval dataset
        },
        task: (input) => {
          return "Sorry " + input; // Replace with your LLM call
        },
        scores: [noApology],
      },
    );
    ```
  </TSTab>

  <PYTab>
    ```python {5-10, 21}
    from braintrust import Eval

    from autoevals import LLMClassifier

    no_apology = LLMClassifier(
        name="No apology",
        prompt_template="Does the response contain an apology? (Y/N)\n\n{{output}}",
        choice_scores={"Y": 0, "N": 1},
        use_cot=True,
    )

    Eval(
        "Say Hi Bot",  # Replace with your project name
        data=lambda: [
            {
                "input": "David",
                "expected": "Hi David",
            },
        ],  # Replace with your eval dataset
        task=lambda input: "Sorry " + input,  # Replace with your LLM call
        scores=[no_apology],
    )
    ```
  </PYTab>
</CodeTabs>

### Conditional scoring

Sometimes, the scoring function(s) you want to use depend on the input data. For example, if you're evaluating a
chatbot, you might want to use a scoring function that measures whether calculator-style inputs are correctly
answered.

#### Skip scorers

Return `null`/`None` to skip a scorer for a particular test case.

<CodeTabs>
  <TSTab>
    ```typescript title="calculator.eval.ts"
    import { NumericDiff } from "autoevals";

    interface QueryInput {
      type: string;
      text: string;
    }

    const calculatorAccuracy = ({
      input,
      output,
    }: {
      input: QueryInput;
      output: number;
    }) => {
      if (input.type !== "calculator") {
        return null;
      }
      return NumericDiff({ output, expected: eval(input.text) });
    };
    ```
  </TSTab>

  <PYTab>
    ```python title="eval_calculator.py"
    from autoevals import NumericDiff


    def calculator_accuracy(input, output, **kwargs):
        if input["type"] != "calculator":
            return None

        return NumericDiff()(output=output, expected=eval(input["text"]))
    ```
  </PYTab>
</CodeTabs>

<Callout emoji="💡">
  Scores with `null`/`None` values will be ignored when computing the overall
  score, improvements/regressions, and summary metrics like standard deviation.
</Callout>

##### Handling scorers on errored test cases

By default, eval tasks or scorers that throw an exception will not generate score values.
This means you may encounter a computed overall score that shows a higher value than if there were no errored test cases. If you would like to change this behavior,
you can pass an unhandled score function to your `Eval` call. We provide a default handler that logs 0% values
to any score that doesn't complete successfully.

<CodeTabs>
  <TSTab>
    ```typescript title="unhandled_scores.eval.ts"
    import { Eval, defaultErrorScoreHandler } from "braintrust";
    import { Factuality } from "autoevals";

    Eval(
      "Say Hi Bot", // Replace with your project name
      {
        data: () => {
          return [
            {
              input: "foo",
            },
          ];
        },
        task: (input) => {
          throw new Error("Task error");
        },
        scores: [Factuality],
        errorScoreHandler: defaultErrorScoreHandler, // Replace with your own custom function
      },
    );
    ```
  </TSTab>

  <PYTab>
    ```python title="unhandled_scores.py"
    from braintrust import Eval, framework

    from autoevals import Factuality


    def error_task(input):
        raise Exception("Task error")


    Eval(
        "Say Hi Bot",  # Replace with your project name
        data=lambda: [
            {
                "input": "foo",
            },
        ],
        task=error_task,
        scores=[Factuality],
        error_score_handler=framework.default_error_score_handler,  # Replace with your own custom function
    )
    ```
  </PYTab>
</CodeTabs>

#### List of scorers

You can also return a list of scorers from a scorer function. This allows you to dynamically generate scores based on the input data, or even combine scores together into a single score. When you return a list of scores, you must return a `Score` object, which has a `name` and a `score` field.

<CodeTabs>
  <TSTab>
    ```typescript title="calculator_accuracy.eval.ts"
    import { NumericDiff } from "autoevals";

    interface QueryInput {
      type: string;
      text: string;
    }

    const calculatorAccuracy = ({
      input,
      output,
    }: {
      input: QueryInput;
      output: number;
    }) => {
      if (input.type !== "calculator") {
        return null;
      }
      return [
        {
          name: "Numeric diff",
          score: NumericDiff({ output, expected: eval(input.text) }),
        },
        {
          name: "Exact match",
          score: output === eval(input.text) ? 1 : 0,
        },
      ];
    };
    ```
  </TSTab>

  <PYTab>
    ```python title="eval_calculator_accuracy.py"
    from autoevals import NumericDiff, Score


    def calculator_accuracy(input, output, **kwargs):
        if input["type"] != "calculator":
            return None

        return [
            NumericDiff()(output=output, expected=eval(input["text"])),
            Score(
                name="Exact match",
                score=1 if output == eval(input["text"]) else 0,
            ),
        ]
    ```
  </PYTab>
</CodeTabs>

### Scorers with additional fields

Certain scorers, like [ClosedQA](https://github.com/braintrustdata/autoevals/blob/main/templates/closed_q_a.yaml),
allow additional fields to be passed in. You can pass them in by initializing them with `.partial(...)`.

<CodeTabs>
  <TSTab>
    ```typescript title="closed_q_a.eval.ts"
    import { Eval, wrapOpenAI } from "braintrust";
    import { ClosedQA } from "autoevals";
    import { OpenAI } from "openai";

    const client = wrapOpenAI(
      new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      }),
    );

    Eval("QA bot", {
      data: () => [
        {
          input: "Which insect has the highest population?",
          expected: "ant",
        },
      ],
      task: async (input) => {
        const response = await client.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content:
                "Answer the following question. Specify how confident you are (or not)",
            },
            { role: "user", content: "Question: " + input },
          ],
        });
        return response.choices[0].message.content || "Unknown";
      },
      scores: [
        ClosedQA.partial({
          criteria:
            "Does the submission specify whether or not it can confidently answer the question?",
        }),
      ],
    });
    ```
  </TSTab>

  <PYTab>
    ```python title="eval_closed_q_a.py"
    import os

    from braintrust import Eval, wrap_openai
    from openai import OpenAI

    from autoevals import ClosedQA

    openai = wrap_openai(OpenAI(api_key=os.environ["OPENAI_API_KEY"]))

    Eval(
        "QA bot",
        data=lambda: [
            {
                "input": "Which insect has the highest population?",
                "expected": "ant",
            },
        ],
        task=lambda input: openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "Answer the following question."},
                {"role": "user", "content": "Question: " + input},
            ],
        )
        .choices[0]
        .message.content
        or "Unknown",
        scores=[
            ClosedQA.partial(criteria="Does the submission specify whether or not it can confidently answer the question?")
        ],
    )
    ```
  </PYTab>
</CodeTabs>

This approach works well if the criteria is static, but if the criteria is dynamic, you can pass them in via a wrapper function, e.g.

<CodeTabs>
  <TSTab>
    ```typescript title="closed_q_a.eval.ts"
    import { Eval, wrapOpenAI } from "braintrust";
    import { ClosedQA } from "autoevals";
    import { OpenAI } from "openai";

    const openai = wrapOpenAI(new OpenAI());

    interface Metadata {
      criteria: string;
    }

    const closedQA = (args: {
      input: string;
      output: string;
      metadata: Metadata;
    }) => {
      return ClosedQA({
        input: args.input,
        output: args.output,
        criteria: args.metadata.criteria,
      });
    };

    Eval("QA bot", {
      data: () => [
        {
          input: "Which insect has the highest population?",
          expected: "ant",
          metadata: {
            criteria:
              "Does the submission specify whether or not it can confidently answer the question?",
          },
        },
      ],
      task: async (input) => {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "Answer the following question. Specify how confident you are (or not)",
            },
            { role: "user", content: "Question: " + input },
          ],
        });
        return response.choices[0].message.content || "Unknown";
      },
      scores: [closedQA],
    });
    ```
  </TSTab>

  <PYTab>
    ```python title="eval_closed_q_a.py"
    from braintrust import Eval, wrap_openai
    from openai import OpenAI

    from autoevals import ClosedQA

    openai = wrap_openai(OpenAI())


    def closed_q_a(input, output, metadata):
        # NOTE: You need to instantiate the scorer class before passing
        # arguments to it directly.
        return ClosedQA()(
            input=input,
            output=output,
            criteria=metadata["criteria"],
        )


    Eval(
        "QA bot",
        data=lambda: [
            {
                "input": "Which insect has the highest population?",
                "expected": "ant",
                "metadata": {
                    "criteria": "Does the submission specify whether or not it can confidently answer the question?",
                },
            },
        ],
        task=lambda input: openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "Answer the following question. Specify how confident you are (or not)",
                },
                {"role": "user", "content": "Question: " + input},
            ],
        )
        .choices[0]
        .message.content
        or "Unknown",
        scores=[closed_q_a],
    )
    ```
  </PYTab>
</CodeTabs>

### Composing scorers

Sometimes, it's useful to build scorers that call other scorers. For example, if you're building a translation app,
you could reverse translate the output, and use `EmbeddingSimilarity` to compare it to the original input.

To compose scorers, simply call one scorer from another.

<CodeTabs>
  <TSTab>
    ```typescript title="translation.eval.ts"
    import { EmbeddingSimilarity } from "autoevals";
    import { Eval, wrapOpenAI } from "braintrust";
    import OpenAI from "openai";

    const client = wrapOpenAI(
      new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      }),
    );

    async function translationScore({
      input,
      output,
    }: {
      input: string;
      output: string;
    }) {
      const completion = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that translates from French to English.",
          },
          { role: "user", content: output },
        ],
      });
      const reverseTranslated = completion.choices[0].message.content ?? "";
      const similarity = await EmbeddingSimilarity({
        output: reverseTranslated,
        expected: input,
      });
      return {
        name: "TranslationScore",
        score: similarity.score,
        metadata: {
          original: input,
          translated: output,
          reverseTranslated,
        },
      };
    }

    Eval("Translate", {
      data: [
        { input: "May I order a pizza?" },
        { input: "Where is the nearest bank?" },
      ],
      task: async (input) => {
        const completion = await client.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant that translates from English to French.",
            },
            { role: "user", content: input },
          ],
        });
        return completion.choices[0].message.content ?? "";
      },
      scores: [translationScore],
    });
    ```
  </TSTab>

  <PYTab>
    ```python title="translate.py"
    import os

    from braintrust import Eval, wrap_openai
    from openai import OpenAI

    from autoevals import EmbeddingSimilarity, Score

    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


    def translation_score(input, output):
        completion = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that translates from French to English."},
                {"role": "user", "content": output},
            ],
        )
        reverse_translated = completion.choices[0].message.content
        similarity = EmbeddingSimilarity()(output=reverse_translated, expected=input)
        return Score(
            name="TranslationScore",
            score=similarity.score,
            metadata={"original": input, "translated": output, "reverseTranslated": reverse_translated},
        )


    def task(input):
        completion = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that translates from English to French."},
                {"role": "user", "content": input},
            ],
        )
        return completion.choices[0].message.content


    Eval(
        "Translate",
        data=[
            {"input": "May I order a pizza?"},
            {"input": "Where is the nearest bank?"},
        ],
        task=task,
        scores=[translation_score],
    )
    ```
  </PYTab>
</CodeTabs>

## Additional metadata

### While executing the `task`

Although you can provide `metadata` about each test case in the `data` function, it can be helpful to add additional
metadata while your `task` is executing. The second argument to `task` is a `hooks` object, which allows you to read
and update metadata on the test case.

<CodeTabs>
  <TSTab>
    ```typescript
    import { Eval } from "braintrust";
    import { Factuality } from "autoevals";

    Eval(
      "Say Hi Bot", // Replace with your project name
      {
        data: () => [
          {
            input: "David",
            expected: "Hi David",
          },
        ],
        task: (input, hooks) => {
          hooks.metadata.flavor = "apple";
          return "Hi " + input; // Replace with your LLM call
        },
        scores: [Factuality],
      },
    );
    ```
  </TSTab>

  <PYTab>
    ```python
    from braintrust import Eval

    from autoevals import Factuality


    def task(input, hooks):
        hooks.metadata["flavor"] = "apple"
        return "Hi " + input


    Eval(
        "Say Hi Bot",  # Replace with your project name
        data=lambda: [
            {
                "input": "David",
                "expected": "Hi David",
            },
        ],
        task=task,
        scores=[Factuality],
    )
    ```
  </PYTab>
</CodeTabs>

### Adding metadata to a scoring function

To make it easier to debug logs that do not produce a good score, you may want to log additional values in addition to the output of a scoring function. To do this, you can add a `metadata` field to the return value of your function, for example:

<CodeTabs>
  <TSTab>
    ```typescript
    import { wrapOpenAI } from "braintrust";
    import OpenAI from "openai";

    const client = wrapOpenAI(new OpenAI({ apiKey: process.env.OPENAI_API_KEY }));

    async function precisionRecallScore({
      input,
      output,
      expected,
    }: {
      input: string;
      output: string[];
      expected: string[];
    }) {
      const truePositives = output.filter((item) => expected.includes(item));
      const falsePositives = output.filter((item) => !expected.includes(item));
      const falseNegatives = expected.filter((item) => !output.includes(item));

      const precision = truePositives.length / (output.length || 1);
      const recall = truePositives.length / (expected.length || 1);

      return {
        name: "PrecisionRecallScore",
        score: (precision + recall) / 2, // F1-style simple average
        metadata: {
          truePositives,
          falsePositives,
          falseNegatives,
          precision,
          recall,
        },
      };
    }
    ```
  </TSTab>

  <PYTab>
    ```python
    import os

    from braintrust import wrap_openai
    from openai import OpenAI

    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


    def precision_recall_score(input: str, output: list[str], expected: list[str]):
        true_positives = [item for item in output if item in expected]
        false_positives = [item for item in output if item not in expected]
        false_negatives = [item for item in expected if item not in output]

        precision = len(true_positives) / (len(output) or 1)
        recall = len(true_positives) / (len(expected) or 1)

        return {
            "name": "PrecisionRecallScore",
            "score": (precision + recall) / 2,  # F1-style simple average
            "metadata": {
                "truePositives": true_positives,
                "falsePositives": false_positives,
                "falseNegatives": false_negatives,
                "precision": precision,
                "recall": recall,
            },
        }
    ```
  </PYTab>
</CodeTabs>

### Experiment-level metadata

It can be useful to add custom metadata to your experiments, for example, to store information about the model or other
parameters that you use. To set custom metadata, pass a `metadata` field to your `Eval` block:

<CodeTabs>
  <TSTab>
    ```typescript title="metadata.eval.ts"
    import { Eval } from "braintrust";
    import { Factuality } from "autoevals";

    Eval(
      "Say Hi Bot", // Replace with your project name
      {
        data: () => [
          {
            input: "David",
            expected: "Hi David",
          },
        ],
        task: (input) => {
          return "Hi " + input; // Replace with your LLM call
        },
        scores: [Factuality],
        metadata: {
          model: "gpt-4o",
        },
      },
    );
    ```
  </TSTab>

  <PYTab>
    ```python title="eval_metadata.py"
    from braintrust import Eval

    from autoevals import Factuality

    Eval(
        "Say Hi Bot",  # Replace with your project name
        data=lambda: [
            {
                "input": "David",
                "expected": "Hi David",
            },
        ],  # Replace with your eval dataset
        task=lambda input: "Hi " + input,  # Replace with your LLM call
        scores=[Factuality],
        metadata={"model": "gpt-4o"},
    )
    ```
  </PYTab>
</CodeTabs>

Once you set metadata, you can view and filter by it on the Experiments page:

<video className="border rounded-md" src="/docs/guides/evals/metadata-filter.mp4" loop autoPlay muted poster="/docs/guides/evals/metadata-filter-poster.png" />

You can also construct complex analyses across experiments. See [Analyze across experiments](./interpret#analyze-across-experiments)
for more details.

## Using custom prompts/functions from Braintrust

In addition to writing code directly in your evals, you can also use custom prompts and functions
that you host in Braintrust in your code. Use cases include:

* Running a code-based eval on a prompt that lives in Braintrust.
* Using a hosted scorer in your evals.
* Using a scorer written in a different language than your eval code (e.g. calling a Python scorer from a TypeScript eval).

You can reference a hosted prompt or scorer by using the `initFunction`/`init_function` function.

<CodeTabs>
  <TSTab>
    ```typescript title="eval_custom_function.ts"
    import { Eval, initFunction } from "braintrust";
    import { Factuality } from "autoevals";

    Eval("custom-function", {
      data: [
        {
          input: "Joe",
          expected: "Hi Joe",
        },
        {
          input: "Jane",
          expected: "Hello Jane",
        },
      ],
      task: initFunction({
        projectName: "custom-function",
        slug: "hi-prompt",
      }),
      scores: [
        initFunction({
          projectName: "custom-function",
          slug: "exact-match-scorer",
        }),
      ],
    });
    ```
  </TSTab>

  <PYTab>
    ```python title="eval_custom_function.py"
    from braintrust import Eval, init_function

    Eval(
        "custom-function",
        data=[
            {
                "input": "Joe",
                "expected": "Hi Joe",
            },
            {
                "input": "Jane",
                "expected": "Hello Jane",
            },
        ],
        task=init_function(project_name="custom-function", slug="hi-prompt"),
        scores=[
            init_function(project_name="custom-function", slug="exact-match-scorer"),
        ],
    )
    ```
  </PYTab>
</CodeTabs>

## Trials

It is often useful to run each input in an evaluation multiple times, to get a sense of the variance in
responses and get a more robust overall score. Braintrust supports *trials* as a first-class concept, allowing
you to run each input multiple times. Behind the scenes, Braintrust will intelligently aggregate the results
by bucketing test cases with the same `input` value and computing summary statistics for each bucket.

To enable trials, add a `trialCount`/`trial_count` property to your evaluation:

<CodeTabs>
  <TSTab>
    ```typescript title="trials.eval.ts"
    import { Eval } from "braintrust";
    import { Factuality } from "autoevals";

    Eval(
      "Say Hi Bot", // Replace with your project name
      {
        data: () => {
          return [
            {
              input: "David",
              expected: "Hi David",
            },
          ]; // Replace with your eval dataset
        },
        task: (input) => {
          return "Hi " + input; // Replace with your LLM call
        },
        scores: [Factuality],
        trialCount: 10,
      },
    );
    ```
  </TSTab>

  <PYTab>
    ```python title="eval_trials.py"
    from braintrust import Eval

    from autoevals import Factuality

    Eval(
        "Say Hi Bot",  # Replace with your project name
        data=lambda: [
            {
                "input": "David",
                "expected": "Hi David",
            },
        ],  # Replace with your eval dataset
        task=lambda input: "Hi " + input,  # Replace with your LLM call
        scores=[Factuality],
        trial_count=10,
    )
    ```
  </PYTab>
</CodeTabs>

## Hill climbing

Sometimes you do not have expected outputs, and instead want to use a previous experiment as a baseline. Hill climbing
is inspired by, but not exactly the same as, the term used in [numerical optimization](https://en.wikipedia.org/wiki/Hill_climbing).
In the context of Braintrust, hill climbing is a way to iteratively improve a model's performance by comparing new
experiments to previous ones. This is especially useful when you don't have a pre-existing benchmark to evaluate against.

Braintrust supports hill climbing as a first-class concept, allowing you to use a previous experiment's `output`
field as the `expected` field for the current experiment. Autoevals also includes a number of scoreres, like
`Summary` and `Battle`, that are designed to work well with hill climbing.

To enable hill climbing, use `BaseExperiment()` in the `data` field of an eval:

<CodeTabs>
  <TSTab>
    ```typescript title="hill_climbing.eval.ts"
    import { Battle } from "autoevals";
    import { Eval, BaseExperiment } from "braintrust";

    Eval<string, string, string>(
      "Say Hi Bot", // Replace with your project name
      {
        data: BaseExperiment(),
        task: (input) => {
          return "Hi " + input; // Replace with your LLM call
        },
        scores: [Battle.partial({ instructions: "Which response said 'Hi'?" })],
      },
    );
    ```
  </TSTab>

  <PYTab>
    ```python title="eval_hill_climbing.py"
    from braintrust import BaseExperiment, Eval

    from autoevals import Battle

    Eval(
        "Say Hi Bot",  # Replace with your project name
        data=BaseExperiment(),
        task=lambda input: "Hi " + input,  # Replace with your LLM call
        scores=[Battle.partial(instructions="Which response said 'Hi'?")],
    )
    ```
  </PYTab>
</CodeTabs>

That's it! Braintrust will automatically pick the best base experiment, either using git metadata if available or
timestamps otherwise, and then populate the `expected` field by merging the `expected` and `output`
field of the base experiment. This means that if you set `expected`, e.g. through the UI while reviewing results,
it will be used as the `expected` field for the next experiment.

**Using a specific experiment**

If you want to use a specific experiment as the base experiment, you can pass the `name` field to `BaseExperiment()`:

<CodeTabs>
  <TSTab>
    ```typescript title="hill_climbing_specific.eval.ts"
    import { Battle } from "autoevals";
    import { Eval, BaseExperiment } from "braintrust";

    Eval<string, string, string>(
      "Say Hi Bot", // Replace with your project name
      {
        data: BaseExperiment({ name: "main-123" }),
        task: (input) => {
          return "Hi " + input; // Replace with your LLM call
        },
        scores: [Battle.partial({ instructions: "Which response said 'Hi'?" })],
      },
    );
    ```
  </TSTab>

  <PYTab>
    ```python
    from braintrust import BaseExperiment, Eval

    from autoevals import Battle

    Eval(
        "Say Hi Bot",  # Replace with your project name
        data=BaseExperiment(name="main-123"),
        task=lambda input: "Hi " + input,  # Replace with your LLM call
        scores=[Battle.partial(instructions="Which response said 'Hi'?")],
    )
    ```
  </PYTab>
</CodeTabs>

**Scoring considerations**

Often while hill climbing, you want to use two different types of scoring functions:

* Methods that do not require an expected output, e.g. `ClosedQA`, so that you can judge the quality of the output
  purely based on the input and output. This measure is useful to track across experiments, and it can be used to
  compare any two experiments, even if they are not sequentially related.
* Comparative methods, e.g. `Battle` or `Summary`, that accept an `expected` output but do not treat it as a ground
  truth. Generally speaking, if you score > 50% on a comparative method, it means you're doing better than the base
  on average. To learn more about how `Battle` and `Summary` work, check out [their prompts](https://github.com/braintrustdata/autoevals/tree/main/templates).

## Custom reporters

When you run an experiment, Braintrust logs the results to your terminal, and `braintrust eval` returns a non-zero exit code if any eval throws an exception. However, it's often useful to customize this behavior, e.g. in your CI/CD pipeline to precisely define what constitutes a failure, or to report results to a different system.

Braintrust allows you to define custom reporters that can be used to process and log results anywhere you'd like. You can define a reporter by adding a `Reporter(...)` block. A Reporter has two functions:

<CodeTabs>
  <TSTab>
    ```typescript title="reporter.eval.ts"
    import { Reporter } from "braintrust";

    Reporter(
      "My reporter", // Replace with your reporter name
      {
        reportEval(evaluator, result, opts) {
          // Summarizes the results of a single reporter, and return whatever you
          // want (the full results, a piece of text, or both!)
        },

        reportRun(results) {
          // Takes all the results and summarizes them. Return a true or false
          // which tells the process to exit.
          return true;
        },
      },
    );
    ```
  </TSTab>

  <PYTab>
    ```python title="eval_reporter.py"
    from braintrust import Reporter


    def report_eval(evaluator, result, opts):
        # Summarizes the results of a single reporter, and return whatever you
        # want (the full results, a piece of text, or both!)
        pass


    def report_run(results):
        # Takes all the results and summarizes them. Return a true or false
        # which tells the process to exit.
        return True


    Reporter(
        "My reporter",  # Replace with your reporter name
        report_eval=report_eval,
        report_run=report_run,
    )
    ```
  </PYTab>
</CodeTabs>

Any `Reporter` included among your evaluated files will be automatically picked up by the `braintrust eval` command.

* If no reporters are defined, the default reporter will be used which logs the results to the console.
* If you define one reporter, it'll be used for all `Eval` blocks.
* If you define multiple `Reporter`s, you have to specify the reporter name as an optional 3rd argument to `Eval()`.

**Example: the default reporter**

As an example, here's the default reporter that Braintrust uses:

<CodeTabs>
  <TSTab>
    ```typescript title="reporter_default.eval.ts"
    import { Reporter, reportFailures } from "braintrust";

    Reporter("Braintrust default reporter", {
      reportEval: async (evaluator, result, { verbose, jsonl }) => {
        const { results, summary } = result;
        const failingResults = results.filter(
          (r: { error: unknown }) => r.error !== undefined,
        );

        if (failingResults.length > 0) {
          reportFailures(evaluator, failingResults, { verbose, jsonl });
        }

        console.log(jsonl ? JSON.stringify(summary) : summary);
        return failingResults.length === 0;
      },
      reportRun: async (evalReports: boolean[]) => {
        return evalReports.every((r) => r);
      },
    });
    ```
  </TSTab>

  <PYTab>
    ```python title="eval_reporter_default.py"
    import json

    from braintrust import Reporter
    from braintrust.framework import report_failures


    def report_eval(evaluator, result, verbose, jsonl):
        results = result.results
        summary = result.summary

        failing_results = [x for x in results if x.error]
        if len(failing_results) > 0:
            report_failures(evaluator, failing_results, verbose=verbose, jsonl=jsonl)
        else:
            print(json.dumps(summary.as_dict()) if jsonl else f"{summary}")

        return len(failing_results) == 0


    def report_run(eval_reports, verbose, jsonl):
        return all(x for x in eval_reports)


    Reporter(
        "default",
        report_eval=report_eval,
        report_run=report_run,
    )
    ```
  </PYTab>
</CodeTabs>

## Attachments

Braintrust allows you to log arbitrary binary data, like images, audio, and
PDFs, as [attachments](/docs/guides/traces/customize#uploading-attachments). The easiest way
to use attachments in your evals is to initialize an `Attachment` object in your
data.

<CodeTabs>
  <TSTab>
    ```typescript title="attachment.eval.ts"
    import { Eval, Attachment } from "braintrust";
    import { NumericDiff } from "autoevals";
    import path from "path";

    function loadPdfs() {
      return ["example.pdf"].map((pdf) => ({
        input: {
          file: new Attachment({
            filename: pdf,
            contentType: "application/pdf",
            data: path.join("files", pdf),
          }),
        },
        // This is a toy example where we check that the file size is what we expect.
        expected: 469513,
      }));
    }

    async function getFileSize(input: { file: Attachment }) {
      return (await input.file.data()).size;
    }

    Eval("Project with PDFs", {
      data: loadPdfs,
      task: getFileSize,
      scores: [NumericDiff],
    });
    ```
  </TSTab>

  <PYTab>
    ```python title="attachment.py"
    import os
    from typing import Any, Dict, Iterable

    from braintrust import Attachment, Eval, EvalCase

    from autoevals import NumericDiff


    def load_pdfs() -> Iterable[EvalCase[Dict[str, Any], int]]:
        for filename in ["example.pdf"]:
            yield EvalCase(
                input={
                    "file": Attachment(
                        filename=filename,
                        content_type="application/pdf",
                        # The file on your filesystem or the file's bytes.
                        data=os.path.join("files", filename),
                    )
                },
                # This is a toy example where we check that the file size is what we expect.
                expected=469513,
            )


    def get_file_size(input: Dict[str, Any]) -> int:
        return len(input["file"].data)


    # Our evaluation uses a `NumericDiff` scorer to check the file size.
    Eval(
        "Project with PDFs",
        data=load_pdfs(),
        task=get_file_size,
        scores=[NumericDiff],
    )
    ```
  </PYTab>
</CodeTabs>

You can also [store attachments in a dataset](/docs/guides/datasets#multimodal-datasets) for reuse across multiple experiments. After creating the dataset, you can use it by name in an eval. Upon access, the attachment data will be automatically downloaded from Braintrust.

<CodeTabs>
  <TSTab>
    ```typescript
    import { NumericDiff } from "autoevals";
    import { initDataset, Eval, ReadonlyAttachment } from "braintrust";

    async function getFileSize(input: {
      file: ReadonlyAttachment;
    }): Promise<number> {
      return (await input.file.data()).size;
    }

    Eval("Project with PDFs", {
      data: initDataset({
        project: "Project with PDFs",
        dataset: "My PDF Dataset",
      }),
      task: getFileSize,
      scores: [NumericDiff],
    });
    ```
  </TSTab>

  <PYTab>
    ```python
    from braintrust import Eval, init_dataset

    from autoevals import NumericDiff


    def get_file_size(input: Dict[str, Any]) -> int:
        """Download the attachment and get its length."""
        return len(input["file"].data)


    Eval(
        "Project with PDFs",
        data=init_dataset("Project with PDFs", "My PDF Dataset"),
        task=get_file_size,
        scores=[NumericDiff],
    )
    ```
  </PYTab>
</CodeTabs>

You can also obtain a signed URL for the attachment for forwarding to other
services, such as OpenAI.

<CodeTabs>
  <TSTab>
    ```typescript
    import { initDataset, wrapOpenAI, ReadonlyAttachment } from "braintrust";
    import { OpenAI } from "openai";

    const client = wrapOpenAI(
      new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      }),
    );

    async function main() {
      const dataset = initDataset({
        project: "Project with images",
        dataset: "My Image Dataset",
      });
      for await (const row of dataset) {
        const attachment: ReadonlyAttachment = row.input.file;
        const attachmentUrl = (await attachment.metadata()).downloadUrl;
        const response = await client.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant",
            },
            {
              role: "user",
              content: [
                { type: "text", text: "Please summarize the attached image" },
                { type: "image_url", image_url: { url: attachmentUrl } },
              ],
            },
          ],
        });
        const summary = response.choices[0].message.content || "Unknown";
        console.log(
          `Summary for file ${attachment.reference.filename}: ${summary}`,
        );
      }
    }

    main();
    ```
  </TSTab>

  <PYTab>
    ```python
    from braintrust import init_dataset, wrap_openai
    from openai import OpenAI

    openai = wrap_openai(OpenAI(api_key=os.environ["OPENAI_API_KEY"]))


    def main():
        dataset = init_dataset("Project with images", "My Image Dataset")
        for row in dataset:
            attachment = row["input"]["file"]
            attachment_url = attachment.metadata()["downloadUrl"]
            response = openai.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant"},
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": "Please summarize the attached image"},
                            {"type": "image_url", "image_url": {"url": attachment_url}},
                        ],
                    },
                ],
            )
            summary = response.choices[0].message.content or "Unknown"
            print(f"Summary for file {attachment.reference['filename']}: {summary}")


    main()
    ```
  </PYTab>
</CodeTabs>

## Tracing

Braintrust allows you to trace detailed debug information and metrics about your
application that you can use to measure performance and debug issues. The trace
is a tree of spans, where each span represents an expensive task, e.g. an LLM
call, vector database lookup, or API request.

<Callout type="info">
  If you are using the OpenAI API, Braintrust includes a wrapper function that
  automatically logs your requests. To use it, simply call
  `wrapOpenAI/wrap_openai` on your OpenAI instance. See [Wrapping
  OpenAI](https://www.braintrustdata.com/docs/guides/tracing#wrapping-openai)
  for more info.
</Callout>

<Callout type="warn">
  Each call to `experiment.log()` creates its own trace, starting at the time of
  the previous log statement and ending at the completion of the current. Do not
  mix `experiment.log()` with tracing. It will result in extra traces that are
  not correctly parented.
</Callout>

For more detailed tracing, you can wrap existing code with the
`braintrust.traced` function. Inside the wrapped function, you can log
incrementally to `braintrust.currentSpan()`. For example, you can progressively
log the input, output, and expected output of a task, and then log a score at the
end:

<CodeTabs>
  <TSTab>
    ```typescript
    import { Eval, traced } from "braintrust";

    async function callModel(input: string) {
      return traced(
        async (span) => {
          const messages = { messages: [{ role: "system", text: input }] };
          span.log({ input: messages });

          // Replace this with a model call
          const result = {
            content: "China",
            latency: 1,
            prompt_tokens: 10,
            completion_tokens: 2,
          };

          span.log({
            output: result.content,
            metrics: {
              latency: result.latency,
              prompt_tokens: result.prompt_tokens,
              completion_tokens: result.completion_tokens,
            },
          });
          return result.content;
        },
        {
          name: "My AI model",
        },
      );
    }

    const exactMatch = (args: {
      input: string;
      output: string;
      expected?: string;
    }) => {
      return {
        name: "Exact match",
        score: args.output === args.expected ? 1 : 0,
      };
    };

    Eval("My Evaluation", {
      data: () => [
        { input: "Which country has the highest population?", expected: "China" },
      ],
      task: async (input, { span }) => {
        return await callModel(input);
      },
      scores: [exactMatch],
    });
    ```
  </TSTab>

  <PYTab>
    ```python
    from braintrust import Eval, current_span, traced


    @traced
    async def call_model(input):
        messages = dict(
            messages=[
                dict(role="system", text=input),
            ]
        )
        current_span().log(input=messages)

        # Replace this with a model call
        result = {
            "content": "China",
            "latency": 1,
            "prompt_tokens": 10,
            "completion_tokens": 2,
        }
        current_span().log(
            output=result["content"],
            metrics=dict(
                latency=result["latency"],
                prompt_tokens=result["prompt_tokens"],
                completion_tokens=result["completion_tokens"],
            ),
        )
        return result["content"]


    async def run_input(input):
        return await call_model(input)


    def exact_match(input, expected, output):
        return 1 if output == expected else 0


    Eval(
        "My Evaluation",
        data=[dict(input="Which country has the highest population?", expected="China")],
        task=run_input,
        scores=[exact_match],
    )
    ```
  </PYTab>
</CodeTabs>

This results in a span tree you can visualize in the UI by clicking on each test case
in the experiment:

![Root Span](/docs/root_span_trace.png)
![Subspan](/docs/subspan_trace.png)

## Logging SDK

The SDK allows you to report evaluation results directly from your code, without using the `Eval()` or `.traced()` functions.
This is useful if you want to structure your own complex evaluation logic, or integrate Braintrust with an
existing testing or evaluation framework.

<CodeTabs>
  <TSTab>
    ```typescript
    import * as braintrust from "braintrust";
    import { Factuality } from "autoevals";

    async function runEvaluation() {
      const experiment = braintrust.init("Say Hi Bot"); // Replace with your project name
      const dataset = [{ input: "David", expected: "Hi David" }]; // Replace with your eval dataset

      const promises = [];
      for (const { input, expected } of dataset) {
        // You can await here instead to run these sequentially
        promises.push(
          experiment.traced(async (span) => {
            const output = "Hi David"; // Replace with your LLM call

            const { name, score } = await Factuality({ input, output, expected });

            span.log({
              input,
              output,
              expected,
              scores: {
                [name]: score,
              },
              metadata: { type: "Test" },
            });
          }),
        );
      }
      await Promise.all(promises);

      const summary = await experiment.summarize();
      console.log(summary);
      return summary;
    }

    runEvaluation();
    ```
  </TSTab>

  <PYTab>
    ```python
    import braintrust

    from autoevals import Factuality


    def run_evaluation():
        experiment = braintrust.init(project="Say Hi Bot")  # Replace with your project name
        dataset = [
            {"input": "David", "expected": "Hi David"},
        ]  # Replace with your eval dataset

        for data in dataset:
            with experiment.start_span(name="task") as span:
                input = data["input"]
                expected = data["expected"]

                output = "Hi David"  # Replace with your LLM call

                factuality = Factuality()
                factualityScore = factuality(output, expected, input=input)

                span.log(
                    input=input,
                    output=output,
                    expected=expected,
                    scores={
                        factualityScore.name: factualityScore.score,
                    },  # The scores dictionary
                    metadata={"type": "Test"},  # The metadata dictionary
                )

        summary = experiment.summarize(summarize_scores=True)
        print(summary)
        return summary


    run_evaluation()
    ```
  </PYTab>
</CodeTabs>

Refer to the [tracing](/docs/guides/tracing) guide for examples of how to trace
evaluations using the low-level SDK. For more details on how to use the low
level SDK, see the [Python](/docs/libs/python) or [Node.js](/docs/libs/nodejs)
documentation.

## Troubleshooting

### Exception when mixing `log` with `traced`

There are two ways to log to Braintrust: `Experiment.log` and
`Experiment.traced`. `Experiment.log` is for non-traced logging, while
`Experiment.traced` is for tracing. This exception is thrown when you mix both
methods on the same object, for instance:

<CodeTabs>
  <TSTab>
    ```typescript
    import { init, traced } from "braintrust";

    function foo() {
      return traced((span) => {
        const output = 1;
        span.log({ output });
        return output;
      });
    }

    const experiment = init("my-project");
    for (let i = 0; i < 10; ++i) {
      const output = foo();
      // ❌ This will throw an exception, because we have created a trace for `foo`
      // with `traced` but here we are logging to the toplevel object, NOT the
      // trace.
      experiment.log({ input: "foo", output, scores: { rating: 1 } });
    }
    ```
  </TSTab>

  <PYTab>
    ```python
    from braintrust import init, traced


    @traced
    def foo():
        return 1


    experiment = init("my-project")
    for i in range(10):
        output = foo()
        # This will throw an exception, because we have created a trace for `foo`
        # with `@traced` but here we are logging to the toplevel object, NOT the
        # trace.
        experiment.log(input="foo", output=output, scores={"rating": 1})
    ```
  </PYTab>
</CodeTabs>

Most of the time, you should use either `Experiment.log` or `Experiment.traced`,
but not both, so the SDK throws an error to prevent accidentally mixing them
together. For the above example, you most likely want to write:

<CodeTabs>
  <TSTab>
    ```typescript
    import { init, traced } from "braintrust";

    function foo() {
      return traced((span) => {
        const output = 1;
        span.log({ output });
        return output;
      });
    }

    const experiment = init("my-project");
    for (let i = 0; i < 10; ++i) {
      // Create a toplevel trace with `traced`.
      experiment.traced((span) => {
        // The call to `foo` is nested as a subspan under our toplevel trace.
        const output = foo();
        // We log to the toplevel trace with `span.log`.
        span.log({ input: "foo", output: "bar" });
      });
    }
    ```
  </TSTab>

  <PYTab>
    ```python
    from braintrust import init, start_span, traced


    @traced
    def foo():
        return 1


    experiment = init("my-project")
    for i in range(10):
        # Create a toplevel trace with `start_span`.
        with experiment.start_span() as span:
            # The call to `foo` is nested as a subspan under our toplevel trace.
            output = foo()
            # We log to the toplevel trace with `span.log`.
            span.log(input="foo", output="bar")
    ```
  </PYTab>
</CodeTabs>

In rare cases, if you are certain you want to mix traced and
non-traced logging on the same object, you may pass the argument
`allowConcurrentWithSpans: true`/`allow_concurrent_with_spans=True` to
`Experiment.log`.

## Online evaluation

Although you can log scores from your application, it can be awkward and computationally intensive to run evals code in your
production environment. To solve this, Braintrust supports server-side online evaluations that are automatically run asynchronously as you
upload logs. You can pick from the pre-built [autoevals](/docs/reference/autoevals) functions or your custom scorers, and define
a sampling rate along with more granular filters to control which logs get evaluated.

### Configuring online evaluation

To create an online evaluation, navigate to the **Configuration** tab in a project and create an online scoring rule.

<video className="border rounded-md" src="/docs/guides/logging/Online-Scoring-Setup.mp4" loop autoPlay muted poster="/docs/guides/logging/Online-Scoring-Setup-Poster.png" />

The score will now automatically run at the specified sampling rate for all logs in the project.

<Callout type="warn">
  Note that online scoring will only be activated once a span has been fully
  logged. We detect this by checking for the existence of a `metrics.end`
  timestamp on the span, which is written automatically by the SDK when the span
  is finished.

  If you are logging through a different means, such as the REST API or any of our
  [API wrappers](/docs/reference/api#api-wrappers), you will have to explicitly
  include `metrics.end` as a Unix timestamp (we also suggest `metrics.start`) in
  order to activate online scoring.
</Callout>

### Defining custom scoring logic

In addition to the pre-built autoevals, you can define your own custom scoring logic by creating custom scorers. Currently, you can
do that by visiting the [Playground](/docs/guides/playground) and creating custom scorers.

# Run evals

Braintrust allows you to create evaluations directly in your code, and run them in your development workflow
or CI/CD pipeline. Once you have defined one or more evaluations, you can run them using the `braintrust eval` command. This command will run all evaluations in the specified files and directories. As they run, they will automatically
log results to Braintrust and display a summary in your terminal.

<CodeTabs>
  <TSTab>
    ```bash
    npx braintrust eval basic.eval.ts
    ```

    ```bash
    npx braintrust eval [file or directory] [file or directory] ...
    ```

    The `braintrust eval` command uses the Next.js convention to load environment variables from:

    * `env.development.local`
    * `.env.local`
    * `env.development`
    * `.env`
  </TSTab>

  <PYTab>
    ```bash
    braintrust eval eval_basic.py
    ```

    ```bash
    braintrust eval [file or directory] [file or directory] ...
    ```
  </PYTab>
</CodeTabs>

## Watch mode

You can run evaluations in watch-mode by passing the `--watch` flag. This will re-run evaluations whenever any of
the files they depend on change.

## Dev mode

You can expose an `Eval` running at a remote URL or your local machine by passing the `--dev` flag. For more information, check out the [remote evals guide](/docs/guides/remote-evals).

## Github action

Once you get the hang of running evaluations, you can integrate them into your CI/CD pipeline to automatically
run them on every pull request or commit. This workflow allows you to catch eval regressions early and often.

The [`braintrustdata/eval-action`](https://github.com/braintrustdata/eval-action) action allows you to run
evaluations directly in your Github workflow. Each time you run an evaluation, the action automatically posts
a comment:

![action comment](./github-actions-comment.png)

To use the action, simply include it in a workflow yaml file (`.github/workflows`):

<CodeTabs>
  <TSTab>
    ```yaml
    - name: Run Evals
      uses: braintrustdata/eval-action@v1
      with:
        api_key: ${{ secrets.BRAINTRUST_API_KEY }}
        runtime: node
    ```

    ### Full example

    ```yaml
    name: Run pnpm evals

    on:
      push:
        # Uncomment to run only when files in the 'evals' directory change
        # - paths:
        #     - "evals/**"

    permissions:
      pull-requests: write
      contents: read

    jobs:
      eval:
        name: Run evals
        runs-on: ubuntu-latest

        steps:
          - name: Checkout
            id: checkout
            uses: actions/checkout@v4
            with:
              fetch-depth: 0

          - name: Setup Node.js
            id: setup-node
            uses: actions/setup-node@v4
            with:
              node-version: 20

          - uses: pnpm/action-setup@v3
            with:
              version: 8

          - name: Install Dependencies
            id: install
            run: pnpm install

          - name: Run Evals
            uses: braintrustdata/eval-action@v1
            with:
              api_key: ${{ secrets.BRAINTRUST_API_KEY }}
              runtime: node
              root: my_eval_dir
    ```
  </TSTab>

  <PYTab>
    ```yaml
    - name: Run Evals
      uses: braintrustdata/eval-action@v1
      with:
        api_key: ${{ secrets.BRAINTRUST_API_KEY }}
        runtime: python
    ```

    ### Full example

    ```yaml
    name: Run Python evals

    on:
      push:
        # Uncomment to run only when files in the 'evals' directory change
        # - paths:
        #     - "evals/**"

    permissions:
      pull-requests: write
      contents: read

    jobs:
      eval:
        name: Run evals
        runs-on: ubuntu-latest

        steps:
          - name: Checkout
            id: checkout
            uses: actions/checkout@v4
            with:
              fetch-depth: 0

          - name: Set up Python
            uses: actions/setup-python@v4
            with:
              python-version: "3.12" # Replace with your Python version

          # Tweak this to a dependency manager of your choice
          - name: Install dependencies
            run: |
              python -m pip install --upgrade pip
              pip install -r test-eval-py/requirements.txt

          - name: Run Evals
            uses: braintrustdata/eval-action@v1
            with:
              api_key: ${{ secrets.BRAINTRUST_API_KEY }}
              runtime: python
              root: my_eval_dir
    ```
  </PYTab>
</CodeTabs>

<Callout type="warn">
  You must specify `permissions` for the action to leave comments on your PR.
  Without these permissions, you'll see Github API errors.
</Callout>

For more information, see the [`braintrustdata/eval-action` README](https://github.com/braintrustdata/eval-action), or check
out full workflow files in the [examples](https://github.com/braintrustdata/eval-action/tree/main/examples) directory.

<Callout type="warn">
  The `braintrustdata/eval-action` GitHub action does not currently support
  custom reporters. If you use custom reporters, you'll need to run the
  `braintrust eval` command directly in your CI/CD pipeline.
</Callout>

## Run code directly

Although you can invoke `Eval()` functions via the `braintrust eval` command, you can also call them directly in your code.

<CodeTabs>
  <TSTab>
    ```typescript
    import { Factuality } from "autoevals";
    import { Eval } from "braintrust";

    async function main() {
      const result = await Eval("Say Hi Bot", {
        data: () => [
          {
            input: "David",
            expected: "Hi David",
          },
        ],
        task: (input) => {
          return "Hi " + input;
        },
        scores: [Factuality],
      });
      console.log(result);
    }

    main();
    ```

    In TypeScript, `Eval()` is an async function that returns a `Promise`. You can run `Eval()`s concurrently
    and wait for all of them to finish using `Promise.all()`.
  </TSTab>

  <PYTab>
    ```python
    from braintrust import Eval

    from autoevals import Factuality


    def main():
        result = Eval(
            "Say Hi Bot",
            data=lambda: [
                {
                    "input": "David",
                    "expected": "Hi David",
                },
            ],
            task=lambda input: "Hi " + input,
            scores=[Factuality],
        )
        print(result)


    async def main():
        result = await Eval(
            "Say Hi Bot",
            data=lambda: [
                {
                    "input": "David",
                    "expected": "Hi David",
                },
            ],
            task=lambda input: "Hi " + input,
            scores=[Factuality],
        )
        print(result)
    ```

    In Python, `Eval()` returns a `Future` if it is called in an async context, and a `Result` if it is called in a
    synchronous context. It is safe to run `Eval()`s concurrently in both async and sync contexts.

    Generally speaking, Jupyter notebooks are async, so you should use `await Eval(...)`.
  </PYTab>
</CodeTabs>

## Limiting concurrency

Sometimes, due to rate limits or other constraints, you may want to limit the number of concurrent evaluations in an
`Eval()` call. Each `Eval()` lets you define `maxConcurrency`/`max_concurrency` to limit the number of concurrent
test cases that run.

<CodeTabs>
  <TSTab>
    ```typescript
    import { Factuality, Levenshtein } from "autoevals";
    import { Eval } from "braintrust";

    Eval("Say Hi Bot", {
      data: () =>
        Array.from({ length: 100 }, (_, i) => ({
          input: `${i}`,
          expected: `${i + 1}`,
        })),
      task: (input) => {
        return input + 1;
      },
      scores: [Factuality, Levenshtein],
      maxConcurrency: 5, // Run 5 tests concurrently
    });
    ```
  </TSTab>

  <PYTab>
    ```python
    from braintrust import Eval

    from autoevals import Factuality, Levenstein

    result = Eval(
        "Test",
        data=lambda: [{"input": f"{i}", "expected": f"{i + 1}"} for i in range(100)],
        task=lambda input: str(int(input) + 1),
        scores=[Factuality, Levenstein],
        max_concurrency=5,  # Run 5 tests concurrently
    )
    ```
  </PYTab>
</CodeTabs>

## Troubleshooting

### Stack traces

By default, the evaluation framework swallows errors in individual tasks, reports them to Braintrust,
and prints a single line per error to the console. If you want to see the full stack trace for each
error, you can pass the `--verbose` flag.

### Why are my scores getting averaged?

Braintrust organizes your data into traces, each of which is a row in the experiments table. Within a trace,
if you log the same score multiple times, it will be averaged in the table. This is a useful way to collect an overall
measurement, e.g. if you compute the relevance of each retrieved document in a RAG use case, and want to see the overall
relevance. However, if you want to see each score individually, you have a few options:

* Split the input into multiple independent traces, and log each score in a separate trace. The [trials](#trials) feature
  will naturally average the results at the top-level, but allow you to view each individual output as a separate test case.
* Compute a separate score for each instance. For example, if you have exactly 3 documents you retrieve every time, you may want
  to compute a separate score for the 1st, 2nd, and 3rd position.
* Create separate experiments for each thing you're trying to score. For example, you may want to try out two different models and
  compute a score for each. In this case, if you split into separate experiments, you'll be able to diff across experiments and compare
  outputs side-by-side.

### Node bundling errors (e.g. "cannot be marked as external")

The `.eval.ts` files are bundled in a somewhat limiting way, via `esbuild` and a special set of
build options that work in most cases, but not all. For example, if you have any `export` statements
in them, you may see errors like "cannot be marked as external".

You can usually fix this specific error by removing `export` statements. However, if that does not work,
or you want more control over how the files are bundled, you can also just run the files directly.
`Eval` is an async function, so you can just call it directly in a script:

```bash
npx tsx my-app.eval.ts
```

# Visualize and interpret eval results

## View results in the UI

Running an eval from the API or SDK will return a link to the corresponding results in Braintrust's UI. When you open the link, you'll land on a detailed view of the eval run that you selected. The detailed view includes:

* **Diff mode toggle** - Allows you to compare eval runs to each other. If you click the toggle, you will see the results of your current eval compared to the results of the baseline.
* **Filter bar** - Allows you to focus in on a subset of test cases. You can filter by typing natural language or [BTQL](/docs/reference/btql).
* **Column visibility** - Allows you to toggle column visibility. You can also order columns by regressions to hone in on problematic areas.
* **Table** - Shows the data for every test case in your eval run.

![One eval run](/docs/guides/evals/eval-run.png)

### Experiment summaries

When you select an experiment, you'll get a summary of the comparisons, scorers, datasets, and metadata.
![Experiment summary](./experiment-summary.png)

You can also view and copy the experiment ID from the bottom of the summary pane.
![Experiment ID](./experiment-id.png)

### Table header summaries

Summaries will appear for score and metric columns. To find test cases to focus on, use column header summaries to filter by improvements or regressions (test cases that decreased in score). This allows you to see the scorers with the biggest issues. You can also group the table to view summaries across metadata fields or inputs. For example, if you use separate datasets for distinct types of usecases, you can group by dataset to see which usecases are having the biggest issues.

<video className="border rounded-md" loop autoPlay muted poster="/docs/guides/evals/column-grouping-poster.png">
  <source src="/docs/guides/evals/column-grouping.mp4" type="video/mp4" />
</video>

## Group summaries

By default, group rows will show one experiment's summary data, and you can switch between them by selecting your desired aggregation.

![Summary experiment aggregations](/docs/guides/evals/summary-experiment-aggregations.png)

If you would like to view the summary data for all experiments, select **Include comparisons in group**.

<video className="border rounded-md" loop autoPlay muted poster="/docs/guides/evals/group-summaries-poster.png">
  <source src="/docs/guides/evals/group-summaries.mp4" type="video/mp4" />
</video>

Within a grouped table, you can also sort rows by regressions of a specific score relative to a comparison experiment.

<video className="border rounded-md" loop autoPlay muted poster="/docs/guides/evals/sort-by-regression-poster.png">
  <source src="/docs/guides/evals/sort-by-regression.mp4" type="video/mp4" />
</video>

Now that you've narrowed your test cases, you can view a test case in detail by selecting a row.

### Trace view

Selecting a row will open the trace view. Here you can see all of the data for the trace for this test case, including input, output, metadata, and metrics for each span inside the trace.

Look at the scores and the output and decide whether the scores seem "right". Do good scores correspond to a good output? If not, you'll want to improve your evals by updating [scorers](/docs/guides/evals/write#scorers) or [test cases](/blog/eval-feedback-loops).

![Trace view](/docs/guides/evals/trace.png)

### Create custom columns

You can create custom columns to extract specific values from `input`, `output`, `expected`, or `metadata` fields if they are objects.
To do this, use the **Add custom column** option at the bottom of the **Columns** dropdown or select the **+** icon at the end of the table headers.

![Create column action](/docs/guides/evals/create-column.png)

After naming your custom column, you can either choose from the inferred fields in the dropdown or enter a custom [BTQL](/docs/reference/btql) statement.

<video className="border rounded-md" loop autoPlay muted poster="/docs/guides/evals/create-column-dialog-poster.png">
  <source src="/docs/guides/evals/create-column-dialog.mp4" type="video/mp4" />
</video>

Once created, you can filter and sort the table using your custom columns.

## Interpreting results

### How metrics are calculated

Along with the scores you track, Braintrust tracks a number of metrics about your LLM calls that help you assess and understand performance. For example, if you're trying to figure out why the average duration increased substantially when you change a model,
it's useful to look at both duration and token metrics to diagnose the underlying issue.

Wherever possible, metrics are computed on the `task` subspan, so that LLM-as-a-judge calls are excluded. Specifically:

* `Duration` is the duration of the `"task"` span.
* `Offset` is the time elapsed since the trace start time.
* `Prompt tokens`, `Completion tokens`, `Total tokens`, `LLM duration`, and `Estimated LLM cost` are averaged over every span
  that is not marked with `span_attributes.purpose = "scorer"`, which is set automatically in autoevals.

If you are using the logging SDK, or API, you will need to follow these conventions to ensure that metrics are computed correctly.

<Callout type="info">
  To compute LLM metrics (like token counts), make sure you [wrap your LLM calls](/docs/guides/traces/customize#wrapping-llm-clients).
</Callout>

### Diff mode

When you run multiple experiments, Braintrust will automatically compare the results of experiments to each other. This allows you to
quickly see which test cases improved or regressed across experiments.

<video className="border rounded-md" loop autoPlay muted poster="/docs/guides/evals/sort-by-comparison-poster.png">
  <source src="/docs/guides/evals/sort-by-comparison.mp4" type="video/mp4" />
</video>

You can also select any individual row in an experiment to see diffs for each field in a span.

<video className="border rounded-md" loop autoPlay muted poster="/docs/guides/evals/diff-poster.png">
  <source src="/docs/guides/evals/diff.mp4" type="video/mp4" />
</video>

#### How rows are matched

By default, Braintrust considers two test cases to be the same if they have the same `input` field. This is used both to match test cases across experiments
and to bucket equivalent cases together in a [trial](./write#trials).

### Viewing data across trials

To group by [trials](./write#trials), or multiple rows with the same `input` value, select **Input** from the **Group** dropdown menu.
This will consolidate each trial for a given input and display aggregate data, showing comparisons for each unique input across all experiments.

If Braintrust detects that any rows have the same `input` value within the same experiment, diff mode will show a **Trials** column where you can select matching trials in your comparison experiments.
You can also step through the relevant trial rows in your comparison experiment by selecting a specific trace.

<video className="border rounded-md" loop autoPlay muted poster="/docs/guides/evals/trials-comparison-poster.png">
  <source src="/docs/guides/evals/trials-comparison.mp4" type="video/mp4" />
</video>

### Customizing the comparison key

However, sometimes your `input` may include additional data, and you need to use a different
expression to match test cases. You can configure the comparison key in your project's **Configuration** page.

<Image unoptimized className="box-content" src="/docs/guides/projects/comparison-key.png" alt="Create comparison key" width={1552 / 2} height={282 / 2} />

### Experiment view layouts

#### Grid layout

When you run multiple experiments, you can also compare experiment outputs side-by-side in the table by selecting the **Grid layout**. In the grid layout, select which fields to display in cells by selecting from the **Fields** dropdown menu.

#### Summary layout

The **Summary layout** summarizes scores and metrics across the base experiment and all comparison experiments, in a reporting-friendly format with large type. Both summary and grid layouts respect all view filters.

### Aggregate (weighted) scores

It's often useful to compute many, even hundreds, of scores in your experiments, but when reporting on an experiment, or comparing
experiments over time, it's often useful to have a single score that represents the experiment as a whole.

Braintrust allows you to do this with aggregate scores, which are formulas that combine multiple scores. To create an aggregate score, go to your project's **Configuration** page,
and select **Add aggregate score**.

<Image unoptimized className="box-content" src="/docs/guides/evals/add-aggregate-score.png" alt="Add aggregate score" width={1136 / 2} height={1012 / 2} />

Braintrust currently supports three types of aggregate scores:

* **Weighted average** - A weighted average of selected scores.
* **Minimum** - The minimum value among the selected scores.
* **Maximum** - The maximum value among the selected scores.

## Analyze across experiments

Braintrust allows you to analyze data across experiments to, for example, compare the performance of different models.

### Bar chart

On the Experiments page, you can view your scores as a bar chart by selecting **Score comparison** from the X axis selector:

<video className="border rounded-md" loop autoPlay muted poster="/docs/guides/evals/bar-score-comparison-poster.png">
  <source src="/docs/guides/evals/bar-score-comparison.mp4" type="video/mp4" />
</video>

You can also select the metadata fields you want to group by to create bar charts:

<video className="border rounded-md" loop autoPlay muted poster="/docs/guides/evals/group-by-dataset-poster.png">
  <source src="/docs/guides/evals/group-by-dataset.mp4" type="video/mp4" />
</video>

### Scatter plot

Select a metric on the x-axis to construct a scatter plot. Here's an example comparing the relationship between accuracy and duration.

<video className="border rounded-md" loop autoPlay muted poster="/docs/guides/evals/scatterplot-poster.png">
  <source src="/docs/guides/evals/scatterplot.mp4" type="video/mp4" />
</video>

## Export experiments

### UI

To export an experiment's results, click on the three vertical dots in the upper right-hand corner of the UI. You can export as `CSV` or `JSON`.

![Export experiments](/docs/guides/evals/exporting-experiments.png)

### API

To fetch the events in an experiment via the API, see [Fetch experiment (POST form)](/docs/api/spec#fetch-experiment-post-form) or [Fetch experiment (GET form)](/docs/api/spec#fetch-experiment-get-form).

### SDK

If you need to access the data from a previous experiment, you can pass the `open` flag into
`init()` and then just iterate through the experiment object:

<CodeTabs>
  <TSTab>
    ```typescript
    import { init } from "braintrust";

    async function openExperiment() {
      const experiment = init(
        "Say Hi Bot", // Replace with your project name
        {
          experiment: "my-experiment", // Replace with your experiment name
          open: true,
        },
      );
      for await (const testCase of experiment) {
        console.log(testCase);
      }
    }
    ```
  </TSTab>

  <PYTab>
    ```python
    import braintrust


    def open_experiment():
        experiment = braintrust.init(
            project="Say Hi Bot",  # Replace with your project name
            experiment="my-experiment",  # Replace with your experiment name
            open=True,
        )
        for test in experiment:
            print(test_case)
    ```
  </PYTab>
</CodeTabs>

You can use the the `asDataset()`/`as_dataset()` function to automatically convert the experiment into the same
fields you'd use in a dataset (`input`, `expected`, and `metadata`).

<CodeTabs>
  <TSTab>
    ```typescript
    import { init } from "braintrust";

    async function openExperiment() {
      const experiment = init(
        "Say Hi Bot", // Replace with your project name
        {
          experiment: "my-experiment", // Replace with your experiment name
          open: true,
        },
      );

      for await (const testCase of experiment.asDataset()) {
        console.log(testCase);
      }
    }
    ```
  </TSTab>

  <PYTab>
    ```python
    import braintrust


    def open_experiment():
        experiment = braintrust.init(
            project="Say Hi Bot",  # Replace with your project name
            experiment="my-experiment",  # Replace with your experiment name
            open=True,
        )
        for test in experiment.as_dataset():
            print(test_case)
    ```
  </PYTab>
</CodeTabs>

For a more advanced overview of how to reuse experiments as datasets, see [Hill climbing](/docs/guides/evals/write#hill-climbing).

# Logs

Logs are the recorded data and metadata from an AI routine. We record the inputs and outputs of your LLM calls to help you evaluate model performance on set of predefined tasks, identify patterns, and diagnose issues.

![Logging Screenshot](/docs/guides/logs/Logging-Basic.png)

In Braintrust, logs consist of traces, which roughly correspond to a single request or interaction in your application. Traces consist
of one or more spans, each of which corresponds to a unit of work in your application, like an LLM call, for example.
You typically collect logs while running your application, both in staging (internal) and production (external) environments, using them to debug issues, monitor user behavior, and gather data for building [datasets](/docs/guides/datasets).

## Why log in Braintrust?

By logging in Braintrust, you can create a feedback loop between real-world observations (logs) and offline evaluations (experiments). This feedback loop is crucial for refining your model's performance and building high-quality AI applications.

By design, logs are *exactly* the same data structure as [experiments](/docs/guides/evals). This leads to a number of useful properties:

* If you instrument your code to run evals, you can reuse this instrumentation to generate logs
* Your logged traces capture exactly the same data as your evals
* You can reuse automated and human review scores across both experiments and logs

## Where to go from here

Now that you know the basics of logging in Braintrust, dig into some more complex capabilities:

* [Logging user feedback](/docs/guides/logs/write#user-feedback)
* [Online evaluation](/docs/guides/evals/write#online-evaluation)
* [Logging multimodal content](/docs/guides/logs/advanced#multimodal-content)
* [Customizing your traces](/docs/guides/traces/customize)

# Write logs

Logs are more than a debugging tool— they are a key part of the feedback loop that drives continuous improvement in your AI application. There are several ways to log things in Braintrust, ranging from higher level for simple use cases, to more complex and customized [spans](/docs/guides/traces/customize) for more control.

The simplest way to log to Braintrust is to wrap the code you wish to log with `wrapTraced`for TypeScript, or `@traced` for Python. This works for any function input and output provided. To learn more about tracing, check out the [tracing guide](/docs/guides/traces).

## Logging LLM calls

Most commonly, logs are used for LLM calls. Braintrust includes a wrapper for the OpenAI API that automatically logs your requests. To use it, call `wrapOpenAI` for TypeScript, or `wrap_openai` for Python on your OpenAI instance. We intentionally *do not* [monkey patch](https://en.wikipedia.org/wiki/Monkey_patch) the libraries directly, so that you can use the wrapper in a granular way.

<CodeTabs>
  <TSTab>
    ```javascript
    import { initLogger, wrapOpenAI, wrapTraced } from "braintrust";
    import OpenAI from "openai";

    // Initialize the logger and OpenAI client
    const logger = initLogger({
      projectName: "My Project",
      apiKey: process.env.BRAINTRUST_API_KEY,
    });
    const client = wrapOpenAI(new OpenAI({ apiKey: process.env.OPENAI_API_KEY }));

    // Function to classify text as a question or statement
    const classifyText = wrapTraced(async (input: string) => {
      const response = await client.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "Classify the following text as a question or a statement.",
          },
          { role: "user", content: input },
        ],
        model: "gpt-4o",
      });

      // Extract the classification from the response
      const classification = response?.choices?.[0]?.message?.content?.trim();
      return classification || "Unable to classify the input.";
    }, logger);

    // Main function to call and log the result
    async function main() {
      const input = "Is this a question?";
      try {
        const result = await classifyText(input);
        console.log("Classification:", result);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    main().catch(console.error);
    ```
  </TSTab>

  <PYTab>
    ```python
    import os

    from braintrust import init_logger, traced, wrap_openai
    from openai import OpenAI

    # Initialize the logger
    logger = init_logger(project="My Project")

    # Wrap the OpenAI client
    client = wrap_openai(OpenAI(api_key=os.environ["OPENAI_API_KEY"]))


    @traced
    def classify_text(input_text):
        # Call the OpenAI API to classify the text
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": "Classify the following text as a question or a statement.",
                },
                {
                    "role": "user",
                    "content": input_text,
                },
            ],
        )
        # Extract the classification from the response
        try:
            classification = response.choices[0].message.content.strip()
            return classification
        except (KeyError, IndexError) as e:
            print(f"Error parsing response: {e}")
            return "Unable to classify the input."


    def main():
        input_text = "Is this a question?"
        try:
            # Call the classify_text function and print the result
            result = classify_text(input_text)
            print("Classification:", result)
        except Exception as error:
            print("Error:", error)


    if __name__ == "__main__":
        main()
    ```
  </PYTab>
</CodeTabs>

Braintrust will automatically capture and log information behind the scenes:

![Log code output](./simple-log.png)

You can use other AI model providers with the OpenAI client through the [AI proxy](/docs/guides/proxy). You can also pick from a number of [integrations](/docs/guides/traces/integrations) (OpenTelemetry, Vercel AI SDK, and others) or create a [custom LLM client wrapper](/docs/guides/traces/customize#wrapping-a-custom-llm-client) in less than 10 lines of code.

### Logging with `invoke`

For more information about logging when using `invoke` to execute a prompt directly, check out the [prompt guide](/docs/guides/functions/prompts#logging).

## User feedback

Braintrust supports logging user feedback, which can take multiple forms:

* A **score** for a specific span, e.g. the output of a request could be 👍 (corresponding to 1) or 👎 (corresponding to 0), or a document retrieved in a vector search might
  be marked as relevant or irrelevant on a scale of 0->1.
* An **expected** value, which gets saved in the `expected` field of a span, alongside `input` and `output`. This is a great place to store corrections.
* A **comment**, which is a free-form text field that can be used to provide additional context.
* Additional **metadata** fields, which allow you to track information about the feedback, like the `user_id` or `session_id`.

Each time you submit feedback, you can specify one or more of these fields using the `logFeedback()` / `log_feedback()` method, which
simply needs you to specify the `span_id` corresponding to the span you want to log feedback for, and the feedback fields you want to update. As you log user feedback, the fields will update in real time.

The following example shows how to log feedback within a simple API endpoint.

<CodeTabs>
  <TSTab>
    ```javascript
    import { initLogger, wrapOpenAI, wrapTraced } from "braintrust";
    import OpenAI from "openai";

    const logger = initLogger({
      projectName: "My Project",
      apiKey: process.env.BRAINTRUST_API_KEY,
    });

    const client = wrapOpenAI(
      new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      }),
    );

    const someLLMFunction = wrapTraced(async function someLLMFunction(
      input: string,
    ) {
      return client.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "Classify the following text as a question or a statement.",
          },
          {
            role: "user",
            content: input,
          },
        ],
        model: "gpt-4o",
      });
    });

    export async function POST(req: Request) {
      return logger.traced(async (span) => {
        const text = await req.text();
        const result = await someLLMFunction(text);
        span.log({ input: text, output: result });
        return {
          result,
          requestId: span.id,
        };
      });
    }

    // Assumes that the request is a JSON object with the requestId generated
    // by the previous POST request, along with additional parameters like
    // score (should be 1 for thumbs up and 0 for thumbs down), comment, and userId.
    export async function POSTFeedback(req: Request) {
      const body = await req.json();
      logger.logFeedback({
        id: body.requestId,
        scores: {
          correctness: body.score,
        },
        comment: body.comment,
        metadata: {
          user_id: body.userId,
        },
      });
    }
    ```
  </TSTab>

  <PYTab>
    ```python
    import os

    from braintrust import init_logger, traced, wrap_openai
    from openai import OpenAI

    logger = init_logger(project="My Project")

    client = wrap_openai(OpenAI(api_key=os.environ["OPENAI_API_KEY"]))


    @traced
    def some_llm_function(input):
        return client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "Classify the following text as a question or a statement.",
                },
                {
                    "role": "user",
                    "content": input,
                },
            ],
            model="gpt-4o",
        )


    def my_route_handler(req):
        with logger.start_span() as span:
            body = req.body
            result = some_llm_function(body)
            span.log(input=body, output=result)
            return {
                "result": result,
                "request_id": span.id,
            }


    # Assumes that the request is a JSON object with the requestId generated
    # by the previous POST request, along with additional parameters like
    # score (should be 1 for thumbs up and 0 for thumbs down), comment, and userId.
    def my_feedback_handler(req):
        logger.log_feedback(
            id=req.body.request_id,
            scores={
                "correctness": req.body.score,
            },
            comment=req.body.comment,
            metadata={
                "user_id": req.user.id,
            },
        )
    ```
  </PYTab>
</CodeTabs>

### Collecting multiple scores

Often, you want to collect multiple scores for a single span. For example, multiple users might provide independent feedback on
a single document. Although each score and expected value is logged separately, each update overwrites the previous value. Instead, to
capture multiple scores, you should create a new span for each submission, and log the score in the `scores` field. When you view
and use the trace, Braintrust will automatically average the scores for you in the parent span(s).

<CodeTabs>
  <TSTab>
    ```javascript
    import { initLogger, wrapOpenAI, wrapTraced } from "braintrust";
    import OpenAI from "openai";

    const logger = initLogger({
      projectName: "My Project",
      apiKey: process.env.BRAINTRUST_API_KEY,
    });

    const client = wrapOpenAI(
      new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      }),
    );

    const someLLMFunction = wrapTraced(async function someLLMFunction(
      input: string,
    ) {
      return client.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "Classify the following text as a question or a statement.",
          },
          {
            role: "user",
            content: input,
          },
        ],
        model: "gpt-4o",
      });
    });

    export async function POST(input: string) {
      return logger.traced(async (span) => {
        const result = await someLLMFunction(input);
        span.log({ input, output: result });
        return {
          result,
          requestId: await span.export(),
        };
      });
    }

    export async function POSTFeedback(body: {
      requestId: string;
      comment: string;
      score: number;
      userId: string;
    }) {
      logger.traced(
        async (span) => {
          logger.logFeedback({
            id: span.id, // Use the newly created span's id, instead of the original request's id
            comment: body.comment,
            scores: {
              correctness: body.score,
            },
            metadata: {
              user_id: body.userId,
            },
          });
        },
        {
          parent: body.requestId,
          name: "feedback",
        },
      );
    }
    ```
  </TSTab>

  <PYTab>
    ```python
    import os

    from braintrust import init_logger, traced, wrap_openai
    from openai import OpenAI

    logger = init_logger(project="My Project")

    client = wrap_openai(OpenAI(api_key=os.environ["OPENAI_API_KEY"]))


    @traced
    def some_llm_function(input):
        return client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "Classify the following text as a question or a statement.",
                },
                {
                    "role": "user",
                    "content": input,
                },
            ],
            model="gpt-4o",
        )


    def my_route_handler(req):
        with logger.start_span() as span:
            body = req.body
            result = some_llm_function(body)
            span.log(input=body, output=result)
            return {
                "result": result,
                "request_id": span.export(),
            }


    def my_feedback_handler(req):
        with logger.start_span("feedback", parent=req.body.request_id) as span:
            logger.log_feedback(
                id=span.id,  # Use the newly created span's id, instead of the original request's id
                scores={
                    "correctness": req.body.score,
                },
                comment=req.body.comment,
                metadata={
                    "user_id": req.user.id,
                },
            )
    ```
  </PYTab>
</CodeTabs>

## Implementation considerations

### Data model

* Each log entry is associated with an organization and a project. If you do not specify a project name or id in
  `initLogger()`/`init_logger()`, the SDK will create and use a project named "Global".
* Although logs are associated with a single project, you can still use them in evaluations or datasets that belong
  to any project.
* Like evaluation experiments, log entries contain optional `input`, `output`, `expected`, `scores`, `metadata`, and `metrics`
  fields. These fields are optional, but we encourage you to use them to provide context to your logs.
* Logs are indexed automatically to enable efficient search. When you load logs, Braintrust automatically returns the most recently
  updated log entries first. You can also search by arbitrary subfields, e.g. `metadata.user_id = '1234'`. Currently, inequality
  filters, e.g. `scores.accuracy > 0.5` do not use an index.

### Production vs. staging

There are a few ways to handle production vs. staging data. The most common pattern we see is to split them into different projects,
so that they are separated and code changes to staging cannot affect production. Separating projects also allows you to enforce [access
controls](/docs/guides/access-control) at the project level.

Alternatively, if it's easier to keep things in one project (e.g. to have a single spot to triage them), you can use tags to separate them.
If you need to physically isolate production and staging, you can create separate organizations, each mapping to a different deployment.

Experiments, prompts, and playgrounds can all use data across projects. For example, if you want to reference a prompt from your production
project in your staging logs, or evaluate using a dataset from staging in a different project, you can do so.

### Initializing

The `initLogger()`/`init_logger()` method initializes the logger. Unlike the experiment `init()` method, the logger lazily
initializes itself, so that you can call `initLogger()`/`init_logger()` at the top of your file (in module scope). The first
time you `log()` or start a span, the logger will log into Braintrust and retrieve/initialize project details.

### Flushing

The SDK can operate in two modes: either it sends log statements to the server after each request, or it buffers them in
memory and sends them over in batches. Batching reduces the number of network requests and makes the `log()` command as fast as possible.
Each SDK flushes logs to the server as fast as possible, and attempts to flush any outstanding logs when the program terminates.

Background batching is controlled by setting the `asyncFlush` / `async_flush` flag in `initLogger()`/`init_logger()`.
This flag is `true` by default in both the Python and TypeScript SDKs.
It is the safer default, since async flushes mean that clients will not be blocked if Braintrust is down.
When async flush mode is on, you can use the `.flush()` method to manually flush any outstanding logs to the server.

<CodeTabs>
  <TSTab>
    ```javascript
    import { initLogger } from "braintrust";

    const logger = initLogger({
      projectName: "My Project",
      apiKey: process.env.BRAINTRUST_API_KEY,
    });

    // ... Your application logic ...

    // Some function that is called while cleaning up resources
    async function cleanup() {
      await logger.flush();
    }
    ```
  </TSTab>

  <PYTab>
    ```python
    logger = init_logger()

    ...


    def cleanup():
        logger.flush()
    ```
  </PYTab>
</CodeTabs>

### Serverless environments

The `asyncFlush` / `async_flush` flag controls whether or not logs are flushed
when a trace completes.
This flag is set to `true` by default, but extra care should be taken in serverless environments
where the process may halt as soon as the request completes.

If the serverless environment does not have `waitUntil`, `asyncFlush: false` should be set.
Note that both Vercel and Cloudflare have `waitUntil`.

<CodeTabs>
  <TSTab>
    ```javascript
    import { initLogger } from "braintrust";

    const logger = initLogger({
      projectName: "My Project",
      apiKey: process.env.BRAINTRUST_API_KEY,
      asyncFlush: false,
    });
    ```
  </TSTab>

  <PYTab>
    ```python
    from braintrust import init_logger

    logger = init_logger(
        async_flush=False,
    )
    ```
  </PYTab>
</CodeTabs>

#### Vercel

Braintrust automatically utilizes Vercel's `waitUntil` functionality if it's available, so you can set `asyncFlush: true` in
Vercel and your requests will *not* need to block on logging.

## Advanced logging

For more advanced logging topics, see the [advanced logging guide](/docs/guides/logs/advanced).

# View logs

To view logs, navigate to the **Logs** tab in the appropriate project in the Braintrust UI. Logs are automatically updated
in real-time as new traces are logged.

![Logs](./logs.png)

## Filtering logs

You can filter logs by tags, time range, and other fields using the **Filter** menu.

<video className="border rounded-md" loop autoPlay muted poster="/docs/guides/logs/filter-logs-poster.png">
  <source src="/docs/guides/logs/filter-logs.mp4" type="video/mp4" />
</video>

### Create custom columns

Create [custom columns](/docs/guides/evals/interpret#create-custom-columns) to extract specific values from `input`, `output`, `expected`, or `metadata` fields.

### Braintrust Query Language (BTQL)

You can also filter by arbitrary subfields using [Braintrust Query Language syntax](/docs/reference/btql).

Here are a few examples of common filters:

| Description                                       | Syntax                                    |
| ------------------------------------------------- | ----------------------------------------- |
| Logs older than the past day                      | `created < CURRENT_DATE - INTERVAL 1 DAY` |
| Logs with a `user_id` field equal to `1234`       | `metadata.user_id = '1234'`               |
| Logs with a `Factuality` score greater than `0.5` | `scores.Factuality > 0.5`                 |

### Querying through the API

For basic filters and access to the logs, you can use the [project logs](/docs/reference/api/Projects#fetch-project-logs-post-form)
endpoint. This endpoint supports the same query syntax as the UI, and also allows you to specify additional fields to return.

For more advanced queries, you can use [BTQL](/docs/reference/btql#api-access) endpoint.

## Tags

Braintrust supports curating logs by adding tags, and then filtering on them in the UI. Tags naturally flow between logs, to datasets, and even
to experiments, so you can use them to track various kinds of data across your application, and track how they change over time.

<video className="border rounded-md" loop autoPlay muted poster="/docs/guides/logs/Add-Tag-Poster.png">
  <source src="/docs/guides/logs/Add-Tag.mp4" type="video/mp4" />
</video>

### Configuring tags

Tags are configured at the project level, and in addition to a name, you can also specify a color and description.
To configure tags, navigate to the **Configuration** tab in a project, where you can add, modify, and delete tags.

![Configure tags](/docs/guides/logs/Configure-Tags.png)

### Adding tags in the SDK

You can also add tags to logs using the SDK. To do so, simply specify the `tags` field when you log data.

<CodeTabs>
  <TSTab>
    ```javascript
    import { wrapOpenAI, initLogger } from "braintrust";
    import { OpenAI } from "openai";

    const logger = initLogger({
      projectName: "My Project",
      apiKey: process.env.BRAINTRUST_API_KEY,
    });
    const client = wrapOpenAI(new OpenAI({ apiKey: process.env.OPENAI_API_KEY }));

    export async function POST(req: Request) {
      return logger.traced(async (span) => {
        const input = await req.text();
        const result = await client.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: input }],
        });
        span.log({ input, output: result, tags: ["user-action"] });
        return {
          result,
          requestId: span.id,
        };
      });
    }
    ```
  </TSTab>

  <PYTab>
    ```python
    from braintrust import init_logger

    logger = init_logger(project="My Project")


    def my_route_handler(req):
        with logger.start_span() as span:
            body = req.body
            result = some_llm_function(body)
            span.log(input=body, output=result, tags=["user-action"])
            return {
                "result": result,
                "request_id": span.span_id,
            }
    ```
  </PYTab>
</CodeTabs>

<Callout type="warn">
  Tags can only be applied to top-level spans, e.g those created via `traced()`
  or `logger.startSpan()`/ `logger.start_span()`. You cannot apply tags to
  subspans (those created from another span), because they are properties of the
  whole trace, not individual spans.
</Callout>

You can also apply tags while capturing feedback via the `logFeedback()` / `log_feedback()` method.

<CodeTabs>
  <TSTab>
    ```javascript
    import { initLogger } from "braintrust";

    const logger = initLogger({
      projectName: "My project",
      apiKey: process.env.BRAINTRUST_API_KEY,
    });

    export async function POSTFeedback(req: Request) {
      const { spanId, comment, score, userId } = await req.json();
      logger.logFeedback({
        id: spanId, // Use the newly created span's id, instead of the original request's id
        comment,
        scores: {
          correctness: score,
        },
        metadata: {
          user_id: userId,
        },
        tags: ["user-feedback"],
      });
    }
    ```
  </TSTab>

  <PYTab>
    ```python
    from braintrust import init_logger

    logger = init_logger(project="My Project")


    def my_feedback_handler(req):
        logger.log_feedback(
            id=req.body.request_id,
            scores={
                "correctness": req.body.score,
            },
            comment=req.body.comment,
            metadata={
                "user_id": req.user.id,
            },
            tags=["user-feedback"],
        )
    ```
  </PYTab>
</CodeTabs>

### Filtering by tags

To filter by tags, simply select the tags you want to filter by in the UI.

<video className="border rounded-md" className="border rounded-md" src="/docs/guides/logs/Filter-Tag.mp4" loop autoPlay muted poster="/docs/guides/logs/Filter-Tag-Poster.png" />

# Advanced logging

## Logging multiple projects

The first logger you initialize in your program becomes the "current" (default) logger. Any subsequent traced function calls will use
the current logger. If you'd like to log to multiple projects, you will need to create multiple loggers, in which case setting
just one as the current leads to unexpected behavior.

When you initialize a logger, you can specify *not* to set it as the current logger:

<CodeTabs>
  <TSTab>
    ```javascript
    import { initLogger } from "braintrust";

    async function main() {
      const logger = initLogger({
        projectName: "My Project",
        apiKey: process.env.BRAINTRUST_API_KEY,
        setCurrent: false,
      });

      // NOTE: When you `setCurrent` to false, you need to call `traced` on the logger,
      // since the global `traced` function will not pick up this logger. Within this
      // callback, however, calling globally `traced` or `wrapTraced` functions will
      // work as usual.
      await logger.traced(async (span) => {
        // Do some work
        span.log({ output: "Hello, world!" });
      });
    }
    ```
  </TSTab>

  <PYTab>
    ```python
    from braintrust import init_logger

    logger = init_logger(
        project="My Project",
        api_key=os.environ["BRAINTRUST_API_KEY"],
        set_current=False,
    )

    # NOTE: When you `set_current` to False, you need to call `start_span` on the logger,
    # since the global `start_span` function will not pick up this logger. Within this context,
    # however, `@traced` decorated functions will work as usual.
    with logger.start_span("my_span") as span:
        # Do some work
        span.log(output="Hello, world!")
    ```
  </PYTab>
</CodeTabs>

### Caching loggers

When you initialize a logger, it performs some background work to (a) login to Braintrust if you haven't already, and (b)
fetch project metadata. This background work does not block your code; however, if you initialize a logger on each request,
it will slow down logging performance quite a bit. Instead, it's a best practice to cache these loggers and reuse them:

<CodeTabs>
  <TSTab>
    ```javascript
    import { initLogger, Logger } from "braintrust";

    // See docs below for more information on setting the async flush flag to true or false
    const loggers = new Map<string, Logger<true>>();

    function getLogger(projectName: string): Logger<true> {
      if (!loggers.has(projectName)) {
        loggers.set(
          projectName,
          initLogger({
            projectName,
            apiKey: process.env.BRAINTRUST_API_KEY,
            setCurrent: false,
            asyncFlush: true,
          }),
        );
      }
      return loggers.get(projectName)!;
    }
    ```
  </TSTab>

  <PYTab>
    ```python
    from braintrust import init_logger

    loggers = {}


    def get_logger(project_name: str) -> Logger:
        global loggers
        if project_name not in loggers:
            loggers[project_name] = init_logger(
                project=project_name,
                api_key=os.environ["BRAINTRUST_API_KEY"],
                set_current=False,
            )
        return loggers[project_name]
    ```
  </PYTab>
</CodeTabs>

### Initializing login

Last, but not least, the logger lazily authorizes against Braintrust when it is first used. This information is shared
across loggers, but you may want to explicitly call `login()` once to avoid having to pass in an API key to each logger (or
to use the `BRAINTRUST_API_KEY` environment variable).

<Callout type="warn">
  There is a lower-level mechanism which can even let you use different API keys for different loggers, but it's not documented
  or officially supported. [Get in touch](mailto:support@braintrust.dev) if you need this.
</Callout>

<CodeTabs>
  <TSTab>
    ```javascript
    import { login } from "braintrust";

    // Run this function once at the beginning of your application
    async function init() {
      await login({
        apiKey: process.env.BRAINTRUST_API_KEY,
      });
    }
    ```
  </TSTab>

  <PYTab>
    ```python
    from braintrust import login


    # Run this function once at the beginning of your application
    async def init():
        await login(api_key=os.environ["BRAINTRUST_API_KEY"])
    ```
  </PYTab>
</CodeTabs>

# Tracing

Tracing is an invaluable tool for exploring the sub-components of your program which produce
each top-level input and output. We currently support tracing in
[logging](/docs/guides/logging) and [evaluations](/docs/guides/evals).

![Trace Screenshot](./trace.png)

## Anatomy of a trace

A trace represents a single independent request, and is made up of several *spans*.

![Anatomy of a trace](./trace-anatomy.png)

A span represents a unit of work, with a start and end time, and optional fields like
input, output, metadata, scores, and metrics (the same fields you can log in an
[experiment](/docs/guides/evals)). Each span contains one or more children that are usually run within their parent span, like for example, a nested function call.
Common examples of spans include LLM calls, vector searches, the steps of an
agent chain, and model evaluations.

Each trace can be expanded to view all of the spans inside. Well-designed traces make it
easy to understand the flow of your application, and to debug issues when they
arise. The tracing API works the same way whether you are logging online (production
logging) or offline (evaluations).

## Where to go from here

Learn more about tracing in Braintrust:

* [Wrapping LLM clients (OpenAI and others)](/docs/guides/traces/customize#wrapping-openai)
* [OpenTelemetry and other popular library integrations](/docs/guides/traces/integrations)
* [Troubleshooting](/docs/guides/traces/customize#tuning-parameters)
* [Viewing traces](/docs/guides/traces/view)

# Customize traces

You can customize how you trace to better understand how your application runs and make it easier to find and fix problems. By adjusting how you collect and manage trace data, you can better track complex processes, monitor systems that work across multiple services, and debug issues more effectively.

## Annotating your code

You can add traces for multiple, specific functions in your code to your logs by annotating them with functional wrappers (TypeScript) or decorators and context managers (Python):

<CodeTabs>
  <TSTab>
    ```javascript
    import { initLogger, wrapOpenAI, wrapTraced } from "braintrust";
    import OpenAI from "openai";
    import { ChatCompletionMessageParam } from "openai/resources";

    const logger = initLogger({
      projectName: "My Project",
      apiKey: process.env.BRAINTRUST_API_KEY,
    });

    const client = wrapOpenAI(
      new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      }),
    );

    // wrapTraced() automatically logs the input (args) and output (return value)
    // of this function to a span. To ensure the span is named `answerQuestion`,
    // you should name the inline function definition (inside of wrapTraced).
    const answerQuestion = wrapTraced(async function answerQuestion(
      body: string,
    ): Promise<string> {
      const prompt: ChatCompletionMessageParam[] = [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: body },
      ];

      const result = await client.chat.completions.create({
        model: "gpt-4o",
        messages: prompt,
      });

      const content = result.choices[0].message.content;
      if (!content) {
        throw new Error("The LLM response content is empty or undefined.");
      }

      return content;
    });

    async function main() {
      const input = "How can I improve my productivity?";
      const result = await answerQuestion(input);
      console.log(result);
    }
    ```
  </TSTab>

  <PYTab>
    ```python
    import os

    from braintrust import init_logger, traced, wrap_openai
    from openai import OpenAI

    logger = init_logger(project="My Project")
    client = wrap_openai(OpenAI(api_key=os.environ["OPENAI_API_KEY"]))


    # @traced automatically logs the input (args) and output (return value)
    # of this function to a span. To ensure the span is named `answer_question`,
    # you should name the function `answer_question`.
    @traced
    def answer_question(body: str) -> str:
        prompt = [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": body},
        ]

        result = client.chat.completions.create(
            model="gpt-4o",
            messages=prompt,
        )
        return result.choices[0].message.content


    def main():
        input_text = "How can I improve my productivity?"
        result = answer_question(input_text)
        print(result)


    if __name__ == "__main__":
        main()
    ```
  </PYTab>
</CodeTabs>

## Wrapping LLM clients

### Wrapping OpenAI

When using `wrapOpenAI`/`wrap_openai`, you technically do not need to use `traced` or `start_span`. In fact, just
initializing a logger is enough to start logging LLM calls. If you use `traced` or `start_span`, you will create more
detailed traces that include the functions surrounding the LLM calls and can group multiple LLM calls together.

#### Streaming metrics

`wrap_openai`/`wrapOpenAI` will automatically log metrics like `prompt_tokens`, `completion_tokens`, and `tokens` for
streaming LLM calls if the LLM API returns them. OpenAI only returns these metrics if you set `include_usage` to `true` in
the `stream_options` parameter.

<CodeTabs>
  <TSTab>
    ```javascript
    import { OpenAI } from "openai";
    import { initLogger, traced, wrapOpenAI, wrapTraced } from "braintrust";

    const client = wrapOpenAI(new OpenAI());
    const logger = initLogger({
      projectName: "My Project",
      apiKey: process.env.BRAINTRUST_API_KEY,
    });

    async function main() {
      const result = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: "What is 1+1?" }],
        stream: true,
        stream_options: {
          include_usage: true,
        },
      });

      for await (const chunk of result) {
        console.log(chunk);
      }
    }

    main().catch(console.error);
    ```
  </TSTab>

  <PYTab>
    ```python
    import openai
    from braintrust import init_logger, start_span, traced, wrap_openai

    client = wrap_openai(openai.OpenAI())
    logger = init_logger(project="My Project")

    result = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": "What is 1+1?"}],
        stream=True,
        stream_options={"include_usage": True},
    )

    for chunk in result:
        print(chunk)
    ```
  </PYTab>
</CodeTabs>

### Wrapping a custom LLM client

If you're using your own client, you can wrap it yourself using the same conventions
as the OpenAI wrapper. Feel free to check out the [Python](https://github.com/braintrustdata/braintrust-sdk/blob/main/py/src/braintrust/oai.py)
and [TypeScript](https://github.com/braintrustdata/braintrust-sdk/blob/main/js/src/wrappers/oai.ts#L4) implementations for reference.

To track the span as an LLM, you must:

* Specify the `type` as `llm`. You can specify any `name` you'd like. This enables LLM duration metrics.
* Add `prompt_tokens`, `completion_tokens`, and `tokens` to the `metrics` field. This enables LLM token usage metrics.
* Format the `input` as a list of messages (using the OpenAI format), and put other parameters (like `model`) in `metadata`. This enables the "Try prompt" button in the UI.

<CodeTabs>
  <TSTab>
    ```javascript
    import { initLogger, traced, wrapTraced } from "braintrust";

    const logger = initLogger({
      projectName: "My Project",
      apiKey: process.env.BRAINTRUST_API_KEY,
    });

    interface LLMCompletion {
      completion: string;
      metrics: {
        prompt_tokens: number;
        completion_tokens: number;
      };
    }

    async function callMyLLM(
      input: string,
      params: { temperature: number },
    ): Promise<LLMCompletion> {
      // Replace with your custom LLM implementation
      return {
        completion: "Hello, world!",
        metrics: {
          prompt_tokens: input.length,
          completion_tokens: 10,
        },
      };
    }

    export const invokeCustomLLM = wrapTraced(
      async function invokeCustomLLM(
        llmInput: string,
        params: { temperature: number },
      ) {
        return traced(async (span) => {
          const result = await callMyLLM(llmInput, params);
          const content = result.completion;
          span.log({
            input: [{ role: "user", content: llmInput }],
            output: content,
            metrics: {
              prompt_tokens: result.metrics.prompt_tokens,
              completion_tokens: result.metrics.completion_tokens,
              tokens:
                result.metrics.prompt_tokens + result.metrics.completion_tokens,
            },
            metadata: params,
          });
          return content;
        });
      },
      {
        type: "llm",
        name: "Custom LLM",
      },
    );

    export async function POST(req: Request) {
      return traced(async (span) => {
        const result = await invokeCustomLLM(await req.text(), {
          temperature: 0.1,
        });
        span.log({ input: req.body, output: result });
        return result;
      });
    }
    ```
  </TSTab>

  <PYTab>
    ```python
    from braintrust import current_span, init_logger, start_span, traced

    logger = init_logger(project="My Project")


    def call_my_llm(input: str, params: dict) -> dict:
        # Replace with your custom LLM implementation
        return {
            "completion": "Hello, world!",
            "metrics": {
                "prompt_tokens": len(input),
                "completion_tokens": 10,
            },
        }


    # notrace_io=True prevents logging the function arguments as input, and lets us
    # log a more specific input format.
    @traced(type="llm", name="Custom LLM", notrace_io=True)
    def invoke_custom_llm(llm_input: str, params: dict):
        result = call_my_llm(llm_input, params)
        content = result["completion"]
        current_span().log(
            input=[{"role": "user", "content": llm_input}],
            output=content,
            metrics=dict(
                prompt_tokens=result["metrics"]["prompt_tokens"],
                completion_tokens=result["metrics"]["completion_tokens"],
                tokens=result["metrics"]["prompt_tokens"] + result["metrics"]["completion_tokens"],
            ),
            metadata=params,
        )
        return content


    def my_route_handler(req):
        with start_span() as span:
            result = invoke_custom_llm(
                dict(
                    body=req.body,
                    params=dict(temperature=0.1),
                )
            )
            span.log(input=req.body, output=result)
            return result
    ```
  </PYTab>
</CodeTabs>

## Multimodal content

### Uploading attachments

In addition to text and structured data, Braintrust also supports uploading file
attachments (blobs). This is especially useful when working with multimodal
models, which can require logging large image, audio, or video files. You can
also use attachments to log other unstructured data related to your LLM usage,
such as a user-provided PDF file that your application later transforms into an
LLM input.

To upload an attachment, create a new `Attachment` object to represent the file
on disk or binary data in memory to be uploaded. You can place `Attachment`
objects anywhere in the event to be logged, including in arrays/lists or deeply
nested in objects. See the [TypeScript][attach-ts] or [Python][attach-py] SDK
reference for usage details.

[attach-ts]: /docs/reference/libs/nodejs/classes/Attachment

[attach-py]: /docs/reference/libs/python#attachment-objects

<CodeTabs>
  <TSTab>
    ```typescript
    import { Attachment, initLogger } from "braintrust";

    const logger = initLogger({ projectName: "Attachment Example" });

    logger.log({
      input: {
        question: "What is this?",
        context: new Attachment({
          data: "path/to/input_image.jpg",
          filename: "user_input.jpg",
          contentType: "image/jpeg",
        }),
      },
      output: "Example response.",
    });
    ```
  </TSTab>

  <PYTab>
    ```python
    from braintrust import Attachment, init_logger

    logger = init_logger("Attachment Example")

    logger.log(
        input={
            "question": "What is this?",
            "context": Attachment(
                data="examples/attachment/chaos.jpg",
                filename="user_input.jpg",
                content_type="image/jpeg",
            ),
        },
        output="Example response.",
    )
    ```
  </PYTab>
</CodeTabs>

The SDK uploads the attachments separately from other parts of the log, so the
presence of attachments doesn't affect non-attachment logging latency.

<img src="/docs/guides/traces/attachment-list-one-image.png" className="box-content" alt="Screenshot of attachment list in Braintrust" width="625" height="313" />

Image, audio, video, and PDF attachments can be previewed in Braintrust. All
attachments can be downloaded for viewing locally.

### Using external files as attachments

Braintrust also supports references to files in external object stores with
the `ExternalAttachment` object. You can use this anywhere you would use an
`Attachment`. See the [Attachments](/docs/guides/attachments) guide for more
information.

### Linking to external images

To log an external image, provide an image URL, an external object store URL, or a base64 encoded image as a
string. The tree viewer will automatically render the image.

![Image logging](./multimodal.png)

The tree viewer will look at the URL or string to determine if it is an image. If you want to force the
viewer to treat it as an image, then nest it in an object like

```json
{
  "image_url": {
    "url": "https://example.com/image.jpg"
  }
}
```

and the viewer will render it as an image. Base64 images must be rendered in URL format, just like the [OpenAI API](https://platform.openai.com/docs/guides/vision?lang=curl).
For example:

```json
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=
```

If your image's URL does not have a recognized file extension, it may not get rendered as an image automatically. In this case,
you can use an [inline attachment](/docs/guides/attachments#inline-attachments) to force it to be rendered as an image.

<img src="/docs/guides/inline-attachment.png" alt="Screenshot of inline attachment" width="625" height="313" />

## Errors

When you run:

* Python code inside of the `@traced` decorator or within a `start_span()` context
* TypeScript code inside of `traced` (or a `wrappedTraced` function)

Braintrust will automatically log any exceptions that occur within the span.

![Error tracing](./error-tracing.png)

Under the hood, every span has an `error` field which you can also log to directly.

<CodeTabs>
  <TSTab>
    ```javascript
    import { wrapTraced, currentSpan } from "braintrust";

    async function processRequest(input: string) {
      return input.length > 10
        ? { error: "Input too long" }
        : { data: "Hello, world!" };
    }

    const requestHandler = wrapTraced(async function requestHandler(req: Request) {
      const body = await req.text();
      const result = await processRequest(body);
      if (result.error) {
        currentSpan().log({ error: result.error });
      } else {
        currentSpan().log({ input: req.body, output: result.data });
      }
      return result;
    });
    ```
  </TSTab>

  <PYTab>
    ```python
    from braintrust import current_span, traced


    def process_request(input):
        if len(input) > 10:
            return {"error": "Input too long"}
        else:
            return {"data": "Hello, world!"}


    @traced
    def request_handler(req):
        result = some_llm_function(req.body)
        if "error" in result:
            current_span().log(error=result["error"])
        else:
            current_span().log(input=req.body, output=result["data"])
        return result
    ```
  </PYTab>
</CodeTabs>

## Deeply nested code

Often, you want to trace functions that are deep in the call stack, without
having to propagate the `span` object throughout. Braintrust uses async-friendly
context variables to make this workflow easy:

* The `traced` function/decorator will create a span underneath the
  currently-active span.
* The `currentSpan()` / `current_span()` method returns the currently active
  span, in case you need to do additional logging.

<CodeTabs>
  <TSTab>
    ```javascript
    import {
      currentSpan,
      initLogger,
      traced,
      wrapOpenAI,
      wrapTraced,
    } from "braintrust";
    import OpenAI from "openai";

    const logger = initLogger();
    const client = wrapOpenAI(
      new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      }),
    );

    export const runLLM = wrapTraced(async function runLLM(input) {
      const model = Math.random() > 0.5 ? "gpt-4o" : "gpt-4o-mini";
      const result = await client.chat.completions.create({
        model,
        messages: [{ role: "user", content: input }],
      });
      const output = result.choices[0].message.content;
      currentSpan().log({
        metadata: {
          randomModel: model,
        },
      });
      return output;
    });

    export const someLogic = wrapTraced(async function someLogic(input: string) {
      return await runLLM(
        "You are a magical wizard. Answer the following question: " + input,
      );
    });

    export async function POST(req: Request) {
      return await traced(async () => {
        const body = await req.json();
        const result = await someLogic(body.text);
        currentSpan().log({
          input: body.text,
          output: result,
          metadata: { user_id: body.userId },
        });
        return result;
      });
    }
    ```
  </TSTab>

  <PYTab>
    ```python
    import os
    import random

    from braintrust import current_span, init_logger, start_span, traced, wrap_openai
    from openai import OpenAI

    logger = init_logger()
    client = wrap_openai(OpenAI(api_key=os.environ["OPENAI_API_KEY"]))


    @traced
    def run_llm(input):
        model = "gpt-4o" if random.random() > 0.5 else "gpt-4o-mini"
        result = client.chat.completions.create(model=model, messages=[{"role": "user", "content": input}])
        current_span().log(metadata={"randomModel": model})
        return result.content


    @traced
    def some_logic(input):
        return run_llm("You are a magical wizard. Answer the following question: " + input)


    def my_route_handler(req):
        with start_span() as span:
            output = some_logic(req.body)
            span.log(input=req.body, output=output, metadata=dict(user_id=req.user.id))
    ```
  </PYTab>
</CodeTabs>

## Distributed tracing

Sometimes it's useful to be able to start a trace in one process and continue it
in a different one. For this purpose, Braintrust provides an `export` function
which returns an opaque string identifier. This identifier can be passed to
`start_span` to resume the trace elsewhere. Consider the following example of
tracing across separate client and server processes.

### Client code

<CodeTabs>
  <TSTab>
    ```typescript
    import { currentSpan, initLogger, wrapTraced } from "braintrust";
    import { ChatCompletionMessageParam } from "openai/resources";

    const logger = initLogger({ projectName: "my-project" });

    async function remoteChatCompletion(args: {
      model: string;
      messages: ChatCompletionMessageParam[];
      extraHeaders?: Record<string, string>;
    }) {
      // This is a placeholder for code that would call a remote service
    }

    const bedTimeStory = wrapTraced(async function bedtimeStory(input: {
      summary: string;
      length: number;
    }) {
      return await remoteChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Come up with a bedtime story with the following summary and approximate length (in words)",
          },
          {
            role: "user",
            content: `summary: ${input.summary}\nlength: ${input.length}`,
          },
        ],
        extraHeaders: {
          request_id: await currentSpan().export(),
        },
      });
    });
    ```
  </TSTab>

  <PYTab>
    ```python
    from braintrust import current_span, init_logger, traced

    logger = init_logger(project="my-project")


    def remote_chat_completion(args):
        # This is a placeholder for code that would call a remote service
        pass


    @traced
    def bedtime_story(summary, length):
        return remote_chat_completion(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "Come up with a bedtime story with the following summary and approximate length (in words)",
                },
                {
                    "role": "user",
                    "content": f"summary: {summary}\nlength: {length}",
                },
            ],
            extra_headers={
                "request_id": current_span().export(),
            },
        )
    ```
  </PYTab>
</CodeTabs>

### Server code

<CodeTabs>
  <TSTab>
    ```javascript
    import { traced, wrapOpenAI } from "braintrust";
    import OpenAI from "openai";
    import { ChatCompletionMessageParam } from "openai/resources";

    const client = wrapOpenAI(
      new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      }),
    );

    async function serverSideChatCompletion(request: {
      model: string;
      messages: ChatCompletionMessageParam[];
      headers?: Record<string, string>;
    }) {
      return await traced(
        async (span) => {
          const output = await client.chat.completions.create({
            model: request.model,
            messages: request.messages,
          });
          return output.choices[0].message.content;
        },
        {
          name: "text_generator_server",
          type: "llm",
          // This will be a fresh, root-level trace if headers or request_id are undefined,
          // or will create sub-spans under the parent trace if they are defined.
          parent: request.headers?.request_id,
        },
      );
    }
    ```
  </TSTab>

  <PYTab>
    ```python
    from braintrust import SpanTypeAttribute, start_span


    @router.post("/chat/completion")
    def chat_completion(request):
        with start_span(
            name="text_generator_server", type=SpanTypeAttribute.LLM, parent=request.headers["request_id"]
        ) as span:
            output = invoke_llm(request.body)
            span.log(input=request.body, output=output["completion"], metrics={"tokens": output["tokens"]})
            return output["completion"]
    ```
  </PYTab>
</CodeTabs>

## Updating spans

Similar to distributed tracing, it can be useful to update spans after you initially log them.
For example, if you collect the output of a span asynchronously.

The `Experiment` and `Logger` classes each have an `updateSpan()` method, which you can call with
the span's id to perform an update:

<CodeTabs>
  <TSTab>
    ```typescript #skip-compile
    import { initLogger, wrapTraced, currentSpan } from "braintrust";

    const logger = initLogger({
      projectName: "my-project", // Replace with your project name
      apiKey: process.env.BRAINTRUST_API_KEY, // Replace with your API key
    });

    const startRequest = wrapTraced(async function startRequest(request) {
      const handle = startSomething(request.body);
      return {
        result: handle,
        spanId: currentSpan().id,
      };
    });

    const finishRequest = wrapTraced(async function finishRequest(handle, spanId) {
      const result = await finishSomething(handle);
      logger.updateSpan({
        id: spanId,
        output: result,
      });
      return result;
    });
    ```
  </TSTab>

  <PYTab>
    ```python
    from braintrust import current_span, init_logger, traced

    logger = init_logger(project="my-project")


    @traced
    def start_request(request):
        handle = start_something(request.body)
        return {
            "result": handle,
            "span_id": current_span().id,
        }


    def finish_request(handle, span_id):
        result = finish_something(handle)
        logger.update_span(
            id=span_id,
            output=result,
        )
        return result
    ```
  </PYTab>
</CodeTabs>

You can also use `span.export()` to export the span in a fully contained string, which is useful if you
have multiple loggers or perform the update from a different service.

<CodeTabs>
  <TSTab>
    ```typescript #skip-compile
    import { initLogger, wrapTraced, currentSpan, updateSpan } from "braintrust";

    const logger = initLogger({
      projectName: "my-project", // Replace with your project name
      apiKey: process.env.BRAINTRUST_API_KEY, // Replace with your API key
    });

    const startRequest = wrapTraced(async function startRequest(request) {
      const handle = startSomething(request.body);
      return {
        result: handle,
        exported: currentSpan().export(),
      };
    });

    const finishRequest = wrapTraced(
      async function finishRequest(handle, exported) {
        const result = await finishSomething(handle);
        updateSpan({
          exported,
          output: result,
        });
        return result;
      },
    );
    ```
  </TSTab>

  <PYTab>
    ```python
    from braintrust import current_span, init_logger, update_span

    logger = init_logger(project="my-project")


    def start_request(request):
        handle = start_something(request.body)
        return {
            "result": handle,
            "exported": current_span().export(),
        }


    def finish_request(handle, exported):
        result = await finish_something(handle)
        update_span(
            exported=exported,
            output=result,
        )
        return result
    ```
  </PYTab>
</CodeTabs>

<Callout type="warn">
  It's important to make sure the update happens *after* the original span has been logged, otherwise
  they can trample on each other.

  Distributed tracing is designed specifically to prevent this edge case, and instead works by logging
  a new (sub) span.
</Callout>

## Deep-linking to spans

The `Span.permalink` method formats a permalink to the Braintrust application
for viewing the span. The link will open the UI to the row represented by the
`Span` object.

If you do not have access to the original `Span` object, the slug produced by
`Span.export` contains enough information to produce the same permalink. The
`braintrust.permalink` function can be used to construct a deep link to the row
in the UI from a given span slug.

## Manually managing spans

In more complicated environments, it may not always be possible to wrap the
entire duration of a span within a single block of code. In such cases, you can
always pass spans around manually.

Consider this hypothetical server handler, which logs to a span incrementally
over several distinct callbacks:

<CodeTabs>
  <TSTab>
    ```javascript
    import {
      Span,
      initLogger,
      startSpan,
      wrapOpenAI,
      wrapTraced,
    } from "braintrust";
    import { OpenAI } from "openai";

    const client = wrapOpenAI(new OpenAI({ apiKey: process.env.OPENAI_API_KEY }));
    const logger = initLogger({ projectName: "My long-running project" });

    const computeOutput = wrapTraced(async function computeOutput(
      systemPrompt: string,
      userInput: string,
      parentSpan: Span,
    ) {
      return await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userInput },
        ],
      });
    });

    class MyHandler {
      private liveSpans: Record<string, { span: Span; input: string }>;

      constructor() {
        this.liveSpans = {};
      }

      async onRequestStart(requestId: string, input: string, expected: string) {
        const span = startSpan({ name: requestId, event: { input, expected } });
        this.liveSpans[requestId] = { span, input };
      }

      async onGetOutput(requestId: string, systemPrompt: string) {
        const { span, input } = this.liveSpans[requestId];
        const output = await computeOutput(systemPrompt, input, span);
        span.log({ output });
      }

      async onRequestEnd(requestId: string, metadata: Record<string, string>) {
        const { span } = this.liveSpans[requestId];
        delete this.liveSpans[requestId];
        span.log({ metadata });
        span.end();
      }
    }
    ```
  </TSTab>

  <PYTab>
    ```python
    from braintrust import init_logger, start_span, traced
    from openai import OpenAI

    client = OpenAI()
    logger = init_logger("My long-running project")


    @traced
    def compute_output(system_prompt, user_input, parent_span):
        return client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                dict(role="system", content=system_prompt),
                dict(role="user", content=user_input),
            ],
        )


    class MyHandler:
        def __init__(self):
            self._live_spans = dict()

        def on_request_start(self, request_id, input, expected):
            span = start_span(name=request_id, input=input, expected=expected)
            self._live_spans[request_id] = dict(span=span, input=input)

        def on_get_output(self, request_id, system_prompt):
            span_info = self._live_spans[request_id]
            span, input = span_info["span"], span_info["input"]
            output = compute_output(system_prompt, input, span)
            span.log(output=output)

        def on_request_end(self, request_id, metadata):
            span = self._live_spans.pop(request_id)["span"]
            span.log(metadata=metadata)
            span.end()
    ```
  </PYTab>
</CodeTabs>

## Importing and exporting spans

Spans are processed in Braintrust as a simple format, consisting of `input`, `output`, `expected`, `metadata`, `scores`,
and `metrics` fields (all optional), as well as a few system-defined fields which you usually do not need to mess with, but
are described below for completeness. This simple format makes
it easy to import spans captured in other systems (e.g. languages other than TypeScript/Python), or to export spans from
Braintrust to consume in other systems.

### Underlying format

The underlying span format contains a number of fields which are not exposed directly through the SDK, but are useful to
understand when importing/exporting spans.

* `id` is a unique identifier for the span, within the container (e.g. an experiment, or logs for a project). You can technically
  set this field yourself (to overwrite a span), but it is recommended to let Braintrust generate it automatically.
* `input`, `output`, `expected`, `scores`, `metadata`, and `metrics` are optional fields which describe the span and are exposed in the
  Braintrust UI. When you use the TypeScript or Python SDK, these fields are validated for you (e.g. scores must be a mapping from strings
  to numbers between 0 and 1).
* `span_attributes` contains attributes about the span. Currently the recognized attributes are `name`, which is
  used to display the span name in the UI, and `type`, which displays a helpful icon. `type` should be one of `"llm"`, `"score"`, `"function"`,
  `"eval"`, `"task"`, or `"tool"`.
* Depending on the container, e.g. an experiment, or project logs, or a dataset, fields like `project_id`, `experiment_id`, `dataset_id`, and
  `log_id` are set automatically, by the SDK, so the span can be later retrieved by the UI and API. You should not set these fields yourself.
* `span_id`, `root_span_id`, and `span_parents` are used to construct the span tree and are automatically set by Braintrust. You should not
  set these fields yourself, but rather let the SDK create and manage them (even if importing from another system).

When importing spans, the only fields you should need to think about are `input`, `output`, `expected`, `scores`, `metadata`, and `metrics`.
You can use the SDK to populate the remaining fields, which the next section covers with an example.

Here is an example of a span in the underlying format:

```json
{
  "id": "385052b6-50a2-43b4-b52d-9afaa34f0bff",
  "input": {
    "question": "What is the origin of the customer support issue??"
  },
  "output": {
    "answer": "The customer support issue originated from a bug in the code.",
    "sources": ["http://www.example.com/faq/1234"]
  },
  "expected": {
    "answer": "Bug in the code that involved dividing by zero.",
    "sources": ["http://www.example.com/faq/1234"]
  },
  "scores": {
    "Factuality": 0.6
  },
  "metadata": {
    "pos": 1
  },
  "metrics": {
    "end": 1704872988.726753,
    "start": 1704872988.725727
    // Can also include `tokens`, etc. here
  },
  "project_id": "d709efc0-ac9f-410d-8387-345e1e5074dc",
  "experiment_id": "51047341-2cea-4a8a-a0ad-3000f4a94a96",
  "created": "2024-01-10T07:49:48.725731+00:00",
  "span_id": "70b04fd2-0177-47a9-a70b-e32ca43db131",
  "root_span_id": "68b4ef73-f898-4756-b806-3bdd2d1cf3a1",
  "span_parents": ["68b4ef73-f898-4756-b806-3bdd2d1cf3a1"],
  "span_attributes": {
    "name": "doc_included"
  }
}
```

### Example import/export

The following example walks through how to generate spans in one program and then import them to Braintrust
in a script. You can use this pattern to support tracing or running experiments in environments that use programming
languages other than TypeScript/Python (e.g. Kotlin, Java, Go, Ruby, Rust, C++), or codebases that cannot integrate the
Braintrust SDK directly.

#### Generating spans

The following example runs a simple LLM app and collects logging information at each stage of the process, without using
the Braintrust SDK. This could be implemented in any programming language, and you certainly do not need to collect or process
information this way. All that matters is that your program generates a useful format that you can later parse and use to import
the spans using the SDK.

```python
import json
import time

import openai

client = openai.OpenAI()


def run_llm(input, **params):
    start = time.time()
    messages = [{"role": "user", "content": input}]
    result = client.chat.completions.create(
        model="gpt-3.5-turbo", messages=[{"role": "user", "content": input}], **params
    )
    end = time.time()
    return {
        "input": messages,
        "output": result.choices[0].message.dict(),
        "metadata": {"model": "gpt-3.5-turbo", "params": params},
        "metrics": {
            "start": start,
            "end": end,
            "tokens": result.usage.total_tokens,
            "prompt_tokens": result.usage.prompt_tokens,
            "completion_tokens": result.usage.completion_tokens,
        },
        "name": "OpenAI Chat Completion",
    }


PROMPT_TEMPLATE = "Answer the following question: %s"


def run_input(question, expected):
    result = run_llm(PROMPT_TEMPLATE % question, max_tokens=32)
    return {
        "input": question,
        "output": result["output"]["content"],
        # Expected is propagated here to make it easy to use it in the import
        # script, but it's not strictly needed to be here.
        "expected": expected,
        "metadata": {
            "template": PROMPT_TEMPLATE,
        },
        "children": [result],
        "name": "run_input",
    }


if __name__ == "__main__":
    for question, expected in [
        [
            "What is 1+1?",
            "2.",
        ],
        [
            "Which is larger, the sun or the moon?",
            "The sun.",
        ],
    ]:
        print(json.dumps(run_input(question, expected)))
```

Running this script produces output like:

```json
{"input": "What is 1+1?", "output": "The sum of 1+1 is 2.", "expected": "2.", "metadata": {"template": "Answer the following question: %s"}, "children": [{"input": [{"role": "user", "content": "Answer the following question: What is 1+1?"}], "output": {"content": "The sum of 1+1 is 2.", "role": "assistant", "function_call": null, "tool_calls": null}, "metadata": {"model": "gpt-3.5-turbo", "params": {"max_tokens": 32}}, "metrics": {"start": 1704916642.978631, "end": 1704916643.450115, "tokens": 30, "prompt_tokens": 19, "completion_tokens": 11}, "name": "OpenAI Chat Completion"}], "name": "run_input"}
{"input": "Which is larger, the sun or the moon?", "output": "The sun is larger than the moon.", "expected": "The sun.", "metadata": {"template": "Answer the following question: %s"}, "children": [{"input": [{"role": "user", "content": "Answer the following question: Which is larger, the sun or the moon?"}], "output": {"content": "The sun is larger than the moon.", "role": "assistant", "function_call": null, "tool_calls": null}, "metadata": {"model": "gpt-3.5-turbo", "params": {"max_tokens": 32}}, "metrics": {"start": 1704916643.450675, "end": 1704916643.839096, "tokens": 30, "prompt_tokens": 22, "completion_tokens": 8}, "name": "OpenAI Chat Completion"}], "name": "run_input"}
```

#### Importing spans

The following program uses the Braintrust SDK in Python to import the spans generated by the previous script. Again, you can
modify this program to fit the needs of your environment, e.g. to import spans from a different source or format.

```python
import json
import sys

import braintrust

from autoevals import Factuality


def upload_tree(span, node, **kwargs):
    span.log(
        input=node.get("input"),
        output=node.get("output"),
        expected=node.get("expected"),
        metadata=node.get("metadata"),
        metrics=node.get("metrics"),
        **kwargs,
    )
    for c in node.get("children", []):
        with span.start_span(name=c.get("name")) as span:
            upload_tree(span, c)


if __name__ == "__main__":
    # This could be another container, like a log stream initialized
    # via braintrust.init_logger()
    experiment = braintrust.init("My Support App")

    factuality = Factuality()
    for line in sys.stdin:
        tree = json.loads(line)
        with experiment.start_span(name="task") as span:
            upload_tree(span, tree)
            with span.start_span(name="Factuality"):
                score = factuality(input=tree["input"], output=tree["output"], expected=tree["expected"])
            span.log(
                scores={
                    "factuality": score.score,
                },
                # This will merge the metadata from the factuality score with the
                # metadata from the tree.
                metadata={"factuality": score.metadata},
            )

    print(experiment.summarize())
```

## Running traced functions in a ThreadPoolExecutor

The Python SDK uses context variables to hold the span state for traces.
This means that if you run a traced function inside of a `concurrent.futures.ThreadPoolExecutor`,
the span state will be lost.

Instead, you can use the `TracedThreadPoolExecutor` class provided by the Braintrust SDK.
This class is a thin extension of `concurrent.futures.ThreadPoolExecutor`
that captures and passes context variables to its workers.

```python
import sys

import braintrust
import openai

braintrust.init_logger("math")


@braintrust.traced
def addition(client: openai.OpenAI):
    return client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": "What is 1+1?"}],
    )


@braintrust.traced
def multiplication(client: openai.OpenAI):
    return client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": "What is 1*1?"}],
    )


@braintrust.traced
def main():
    client = braintrust.wrap_openai(openai.OpenAI())
    with braintrust.TracedThreadPoolExecutor(max_workers=2) as e:
        try:
            a = e.submit(addition, client=client)
            m = e.submit(multiplication, client=client)
            a.result()
            m.result()
        except Exception as e:
            print("Failed", e, file=sys.stderr)


if __name__ == "__main__":
    main()
```

## Tuning parameters

The SDK includes several tuning knobs that may prove useful for debugging.

* `BRAINTRUST_SYNC_FLUSH`: By default, the SDKs will log to the backend API in
  the background, asynchronously. Logging is automatically batched and retried
  upon encountering network errors. If you wish to have fine-grained control over
  when logs are flushed to the backend, you may set `BRAINTRUST_SYNC_FLUSH=1`.
  When true, flushing will only occur when you run `Experiment.flush` (or any of
  the other object flush methods). If the flush fails, the SDK will raise an
  exception which you can handle.
* `BRAINTRUST_MAX_REQUEST_SIZE`: The SDK logger batches requests to save on
  network roundtrips. The batch size is tuned for the AWS lambda gateway, but you
  may adjust this if your backend has a different max payload requirement.
* `BRAINTRUST_DEFAULT_BATCH_SIZE`: The maximum number of individual log messages
  that are sent to the network in one payload.
* `BRAINTRUST_NUM_RETRIES`: The number of times the logger will attempt to retry
  network requests before failing.
* `BRAINTRUST_QUEUE_SIZE` (Python only): The maximum number of elements in the
  logging queue. This value limits the memory usage of the logger. Logging
  additional elements beyond this size will block the calling thread. You may set
  the queue size to unlimited (and thus non-blocking) by passing
  `BRAINTRUST_QUEUE_SIZE=0`.
* `BRAINTRUST_QUEUE_DROP_WHEN_FULL` (Python only): Useful in conjunction with
  `BRAINTRUST_QUEUE_SIZE`. Change the behavior of the queue from blocking when it
  reaches its max size to dropping excess elements. This can be useful for
  guaranteeing non-blocking execution, at the cost of possibly dropping data.
* `BRAINTRUST_QUEUE_DROP_EXCEEDING_MAXSIZE` (Javascript only): Essentially a
  combination of `BRAINTRUST_QUEUE_SIZE` and `BRAINTRUST_QUEUE_DROP_WHEN_FULL`,
  which changes the behavior of the queue from storing an unlimited number of
  elements to capping out at the specified value. Additional elements are
  discarded.
* `BRAINTRUST_FAILED_PUBLISH_PAYLOADS_DIR`: Sometimes errors occur when writing
  records to the backend. To aid in debugging errors, you may set this
  environment variable to a directory of choice, and Braintrust will save any
  payloads it failed to publish to this directory.
* `BRAINTRUST_ALL_PUBLISH_PAYLOADS_DIR`: Analogous to
  `BRAINTRUST_FAILED_PUBLISH_PAYLOADS_DIR`, except that Braintrust will save all
  payloads to this directory.

## Disabling logging

If you are not running an eval or logging, then the tracing code will be a no-op with negligible performance overhead. In other words, if you do not call initLogger/init\_logger/init, in your code, then the tracing annotations are a no-op.

## Trace data structures

A trace is a directed acyclic graph (DAG) of spans. Each span can have multiple parents, but most
executions are a tree of spans. Currently, the UI only supports displaying a single root span, due to
the popularity of this pattern.

## Errors

If the Braintrust SDK cannot log for some reason (e.g. a network issue), then your application should
not be affected. All logging operations run in a background thread, including api key validation,
project/experiment registration, and flushing logs.

When errors occur, the SDK retries a few times before eventually giving up. You'll see loud warning messages
when this occurs. And you can tune this behavior via the environment variables defined in [Tuning parameters](#tuning-parameters).

# View traces

To view a trace, select a log from your project's **Logs** page, or from an experiment on the **Evaluations** page. The trace will open on the right-hand side of your screen.

![Log with trace](./log-with-trace.png)

To get a closer look, select **Toggle fullscreen trace**.

Inside of your trace, you'll see a tree view of all of the spans that make up the trace.

![Trace](./trace.png)

You can select an individual span to see the metrics, input, output, expected, metadata, and activity.

![Span](./span.png)

## Span search

Often, you'll have a large number of spans inside of a given trace. To make it easier to locate a specific span or set of spans, you can search through your trace by selecting the magnifying glass icon.

<video className="w-full rounded-md aspect-auto" controls autoPlay muted poster="/docs/guides/traces/find-in-trace-poster.png">
  <source src="/docs/guides/traces/find-in-trace.mp4" type="video/mp4" />

  <a href="/docs/guides/traces/find-in-trace.mp4">Video</a>
</video>

### Span filtering

Once you've entered a search query, you can also filter the results of your search by span type or span field.

<video className="w-full rounded-md aspect-auto" controls autoPlay muted poster="/docs/guides/traces/filter-span-poster.png">
  <source src="/docs/guides/traces/filter-span.mp4" type="video/mp4" />

  <a href="/docs/guides/traces/filter-span.mp4">Video</a>
</video>

### Bulk selection

When you're ready to add specific spans to a dataset, you can bulk select them to add them to a new or existing dataset in your project.

<video className="w-full rounded-md aspect-auto" controls autoPlay muted poster="/docs/guides/traces/multiselect-poster.png">
  <source src="/docs/guides/traces/multiselect.mp4" type="video/mp4" />

  <a href="/docs/guides/traces/multiselect.mp4">Video</a>
</video>

## Diffing traces

When you're digging into traces in an experiment, you can toggle **Diff** view to compare across experiments, as well as output vs expected values.

<video className="w-full rounded-md aspect-auto" controls autoPlay muted poster="/docs/guides/traces/diff-trace-poster.png">
  <source src="/docs/guides/traces/diff-trace.mp4" type="video/mp4" />

  <a href="/docs/guides/traces/diff-trace.mp4">Video</a>
</video>

## Arranging span fields

You can drag to reorder span fields using the drag handle on each field. When the span container is wide enough, span fields can also be arranged side-by-side. Span field arrangements are persisted for all users per object type, per project.

## Re-running a prompt

You can re-run any chat completion span inside of a trace by selecting **Try prompt**.

<video className="w-full rounded-md aspect-auto" controls autoPlay muted poster="/docs/guides/traces/try-prompt-poster.png">
  <source src="/docs/guides/traces/try-prompt.mp4" type="video/mp4" />

  <a href="/docs/guides/traces/try-prompt.mp4">Video</a>
</video>

This will open the prompt in a new window where you can edit and re-run your prompt. From here, you can also save any prompt to your project's prompt library.

# Extend traces

## Custom rendering for span fields

Although the built-in span viewers cover a variety of different span field display types— `YAML`, `JSON`, `Markdown`, LLM calls, and more—you may
want to further customize the display of your span data. For example, you could include the id of an internal database
and want to fetch and display its contents in the span viewer. Or, you may want to reformat the data in the span in a way
that's more useful for your use case than the built-in options.

Span iframes provide complete control over how you visualize span data, making them particularly valuable for when you have custom visualization needs or want to incorporate data from external sources. They also support interactive features - for example, you can implement custom human review feedback mechanisms like thumbs up/down buttons on image search results and write the scores directly to the `expected` or `metadata` fields.

To enable a span iframe, visit the **Configuration**
tab of a project, and create one. You can define the URL, and then customize its behavior:

* Provide a title, which is displayed at the top of the section.
* Provide, via [mustache](https://mustache.github.io/mustache.5.html), template parameters to the URL. These parameters are
  in terms of the top-level span fields, e.g. `{{input}}`, `{{output}}`, `{{expected}}`, etc. or their subfields, e.g.
  `{{input.question}}`.
* Allow Braintrust to send a message to the iframe with the span data, which is useful when the data may be very large and
  not fit in a URL.
* Send messages from the iframe back to Braintrust to update the span data.

### Quickstart

Since span iframes run your custom code, you need to host them somewhere. Tools like [val.town](https://www.val.town/) or [v0.dev](https://v0.dev/) make it easy to do this.

You can use [https://v0-render-iframe-data.vercel.app/](https://v0-render-iframe-data.vercel.app/) as a quick test ([code](https://github.com/ankrgyl/json-iframe-viewer)). It renders a JSON object which shows you all of
the fields that are available in the span.

![Span iframe](./span-iframe-config.gif)

### Iframe message format

In Zod format, the message schema looks like this:

```typescript
import { z } from "zod";

export const settingsMessageSchema = z.object({
  type: z.literal("settings"),
  settings: z.object({
    theme: z.enum(["light", "dark"]),
    // This is not currently used, but in the future, span iframes will support
    // editing and sending back data.
    readOnly: z.boolean(),
  }),
});

export const iframeUpdateMessageSchema = z.object({
  type: z.literal("update"),
  field: z.string(),
  data: z.any(),
});

export const dataMessageSchema = z.object({
  type: z.literal("data"),
  data: z.object({
    input: z.array(z.record(z.unknown())),
  }),
});

export const messageSchema = z.union([
  settingsMessageSchema,
  dataMessageSchema,
]);
```

### Sample workflow

Say you want to render the `input`, `output`, `expected`, and `id` fields for a given span in a table format for easier parsing.

<video className="border rounded-md" controls muted poster="/docs/span-iframe-poster.png">
  <source src="/docs/span-iframes.mp4" type="video/mp4" />
</video>

<Steps>
  <Step>
    The first thing you'll need to do is choose where to host your table. Span iframes are externally hosted, either in your own infrastructure or a cloud hosting service. In this example, we'll use Val Town. Navigate to [val.town](https://www.val.town/) and create an account if you don't already have one.
  </Step>

  <Step>
    Next, you'll need to write the code for the component you'd like to render inside of your span, making sure that it uses the correct message handling to allow communication with Braintrust. To speed things up, we can go to [Townie](https://www.val.town/townie), Val Town's AI assistant that helps you get pages up and running quickly. Prompt the AI to generate your table code for you, keeping these few things in mind:

    * You'll want to add the message handling that allows the iframe to send messages back to Braintrust

    <Callout type="info">
      To do this, we use the [window.postMessage()](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) method behind the scenes.
    </Callout>

    * You'll want to use some hardcoded span data to illustrate what it might look like in the preview before you ship

    For example, your prompt might look something like this:

    ```
    Create a table component in React that uses this type of message handling:

    "use client";

    import {
      Table,
      TableBody,
      TableCell,
      TableHead,
      TableHeader,
      TableRow,
    } from "@/components/ui/table";
    import { useEffect, useMemo, useState } from "react";
    import { z } from "zod";

    export const dataMessageSchema = z.object({
      type: z.literal("data"),
      data: z.object({
        input: z.array(z.record(z.string())),
      }),
    });

    export const settingsMessageSchema = z.object({
      type: z.literal("settings"),
      settings: z.object({
        theme: z.enum(["light", "dark"]),
        readOnly: z.boolean(),
      }),
    });

    export const messageSchema = z.union([
      dataMessageSchema,
      settingsMessageSchema,
    ]);

    export type Message = z.infer<typeof messageSchema>;

    export default function TablePage() {
      const [data, setData] = useState<Record<string, unknown>[]>([]);

      useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
          try {
            const message = messageSchema.parse(event.data);
            if (message.type === "data") {
              setData(message.data.input);
            }
          } catch (error) {
            console.error("Invalid message received:", error);
          }
        };

        window.addEventListener("message", handleMessage);

        return () => {
          window.removeEventListener("message", handleMessage);
        };
      }, []);

      const headers = useMemo(
        () => (data.length > 0 ? Object.keys(data[0]) : []),
        [data]
      );

      if (data.length === 0) {
        return <div>No data</div>;
      }

      return (
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={i}>
                {headers.map((header) => (
                  <TableCell key={header}>
                    {typeof row[header] === "string" ? row[header] : "N/A"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }

    Here's an example of how the data should look:
    {
      type: 'data',
      data: {
        span_id: 'd42cbeb6-aaff-43d6-8517-99bbbd82b941',
        input: "Some input text",
        output: "Some output text",
        expected: 1,
        metadata: { some: "additional info" }
      }
    }

    Use this sample span data to illustrate how the table will look:
    ID: initial-sample
    Input: An orphaned boy discovers he's a wizard on his 11th birthday when Hagrid escorts him to magic-teaching Hogwarts School.
    Output: Harry Potter and the Philosopher's Stone
    Expected: Harry Potter and the Sorcerer's Stone
    Metadata: null

    Make sure the Zod schema is flexible for different data types and make sure all the properties from the message are included. Also be sure to handle any undefined values.
    ```
  </Step>

  <Step>
    Townie will generate some code for you and automatically deploy it to a URL. Check it out and make sure the table looks how you'd like, then copy the URL.
  </Step>

  <Step>
    Lastly, go back to Braintrust and visit the **Configuration**
    tab of your project, then navigate down to the span iframe section. Paste in the URL of your hosted table.

    ![Configure span iframe](./configure-span-iframe.png)
  </Step>
</Steps>

Now, when you go to a span in your project, you should see the table you created, but populated with the corresponding data for each span.

![Rendered table iframe](./rendered-table-iframe.png)

### Example code

To help you get started, check out the [braintrustdata/braintrust-viewers](https://github.com/braintrustdata/braintrust-viewers)
repository on Github, which contains example code for rendering a table, X/Tweet, and more.

# Tracing integrations

## OpenTelemetry (OTel)

To set up Braintrust as an [OpenTelemetry](https://opentelemetry.io/docs/)
backend, you'll need to route the traces to Braintrust's OpenTelemetry endpoint,
set your API key, and specify a parent project or experiment.

Braintrust supports a combination of common patterns from [OpenLLMetry](https://github.com/traceloop/openllmetry) and popular libraries like the [Vercel AI SDK](https://sdk.vercel.ai/). Behind the scenes, clients can point to Braintrust's API as an exporter, which makes it easy to integrate without having to install additional libraries or code. OpenLLMetry supports a range of languages including Python, TypeScript, Java, and Go, so it's an easy way to start logging to Braintrust from many different environments.

Once you set up an [OpenTelemetry Protocol Exporter](https://opentelemetry.io/docs/languages/js/exporters/) (OTLP) to send traces to Braintrust, we automatically
convert LLM calls into Braintrust `LLM` spans, which
can be saved as [prompts](/docs/guides/functions/prompts)
and evaluated in the [playground](/docs/guides/playground).

For collectors that use the [OpenTelemetry SDK](https://opentelemetry.io/docs/languages/) to export traces, set the
following environment variables:

```
OTEL_EXPORTER_OTLP_ENDPOINT=https://api.braintrust.dev/otel
OTEL_EXPORTER_OTLP_HEADERS="Authorization=Bearer <Your API Key>, x-bt-parent=project_id:<Your Project ID>"
```

<Callout type="info">
  The trace endpoint URL is `https://api.braintrust.dev/otel/v1/traces`. If your exporter
  uses signal-specific environment variables, you'll need to set the full path:
  `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=https://api.braintrust.dev/otel/v1/traces`
</Callout>

<Callout type="info">
  If you're self-hosting Braintrust, substitute your stack's Universal API URL. For example:
  `OTEL_EXPORTER_OTLP_ENDPOINT=https://dfwhllz61x709.cloudfront.net/otel`
</Callout>

The `x-bt-parent` header sets the trace's parent project or experiment. You can use
a prefix like `project_id:`, `project_name:`, or `experiment_id:` here, or pass in
a [span slug](/docs/guides/tracing#distributed-tracing)
(`span.export()`) to nest the trace under a span within the parent object.

<Callout type="info">
  To find your project ID, navigate to your project's configuration page and find the **Copy Project ID** button at the bottom of the page.
</Callout>

### Vercel AI SDK

To use the [Vercel AI SDK](https://sdk.vercel.ai/docs/ai-sdk-core/telemetry) to send
telemetry data to Braintrust, set these environment variables in your Next.js
app's `.env` file:

```
OTEL_EXPORTER_OTLP_ENDPOINT=https://api.braintrust.dev/otel
OTEL_EXPORTER_OTLP_HEADERS="Authorization=Bearer <Your API Key>, x-bt-parent=project_id:<Your Project ID>"
```

You can then use the `experimental_telemetry` option to enable telemetry on
supported AI SDK function calls:

```typescript
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

const openai = createOpenAI();

async function main() {
  const result = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: "What is 2 + 2?",
    experimental_telemetry: {
      isEnabled: true,
      metadata: {
        query: "weather",
        location: "San Francisco",
      },
    },
  });
  console.log(result);
}

main();
```

<Callout type="info">
  You can also use `streamText` to stream model output while capturing telemetry. Each streamed call will produce `ai.streamText` spans in Braintrust.

  ```typescript
  import { openai } from "@ai-sdk/openai";
  import { streamText } from "ai";

  export async function POST(req: Request) {
    const { prompt } = await req.json();

    const result = await streamText({
      model: openai("gpt-4o-mini"),
      prompt,
      experimental_telemetry: { isEnabled: true },
    });

    return result.toAIStreamResponse();
  }
  ```
</Callout>

Traced LLM calls will appear under the Braintrust project or experiment
provided in the `x-bt-parent` header.

### Traceloop

To export OTel traces from Traceloop
[OpenLLMetry](https://www.traceloop.com/docs) to Braintrust, set the following
environment variables:

```
TRACELOOP_BASE_URL=https://api.braintrust.dev/otel
TRACELOOP_HEADERS="Authorization=Bearer%20<Your API Key>, x-bt-parent=project_id:<Your Project ID>"
```

<Callout type="warn">
  When setting the bearer token, be sure to encode the space between "Bearer" and your API key using `%20`.
</Callout>

Traces will then appear under the Braintrust project or experiment provided in
the `x-bt-parent` header.

```python
from openai import OpenAI
from traceloop.sdk import Traceloop
from traceloop.sdk.decorators import workflow

Traceloop.init(disable_batch=True)
client = OpenAI()


@workflow(name="story")
def run_story_stream(client):
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": "Tell me a short story about LLM evals."}],
    )
    return completion.choices[0].message.content


print(run_story_stream(client))
```

### LlamaIndex

To trace LLM calls with [LlamaIndex](https://docs.llamaindex.ai/en/stable/module_guides/observability/), you can use the OpenInference `LlamaIndexInstrumentor` to send OTel traces directly to Braintrust. Configure your environment and set the OTel endpoint:

```python
import os

import llama_index.core

BRAINTRUST_API_URL = os.environ.get("BRAINTRUST_API_URL", "https://api.braintrust.dev")
BRAINTRUST_API_KEY = os.environ.get("BRAINTRUST_API_KEY", "<Your API Key>")
PROJECT_ID = "<Your Project ID>"

os.environ["OTEL_EXPORTER_OTLP_HEADERS"] = (
    f"Authorization=Bearer {BRAINTRUST_API_KEY}" + f"x-bt-parent=project_id:{PROJECT_ID}"
)
llama_index.core.set_global_handler("arize_phoenix", endpoint=f"{BRAINTRUST_API_URL}/otel/v1/traces")
```

Now traced LLM calls will appear under the provided Braintrust project or experiment.

```python
from llama_index.core.llms import ChatMessage
from llama_index.llms.openai import OpenAI

messages = [
    ChatMessage(role="system", content="Speak like a pirate. ARRR!"),
    ChatMessage(role="user", content="What do llamas sound like?"),
]
result = OpenAI().chat(messages)
print(result)
```

### Manual Tracing

If you want to log LLM calls directly to the OTel endpoint, you can set up a custom OpenTelemetry tracer and add the appropriate attributes to your spans. This gives you fine-grained control over what data gets logged.

Braintrust implements the [OpenTelemetry GenAI semantic conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-spans/). When you send traces with these attributes, they are automatically mapped to Braintrust fields.

| Attribute                        | Braintrust Field            | Description                                                                                                                                                                                                                   |
| -------------------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `gen_ai.prompt`                  | `input`                     | User message (string). If you have an array of messages, you'll need to use `gen_ai.prompt_json` (see below) or set flattened attributes like `gen_ai.prompt.0.role` or `gen_ai.prompt.0.content`.                            |
| `gen_ai.prompt_json`             | `input`                     | A JSON-serialized string containing an array of [OpenAI messages](https://platform.openai.com/docs/api-reference/chat/create).                                                                                                |
| `gen_ai.completion`              | `output`                    | Assistant message (string). Note that if you have an array of messages, you'll need to use `gen_ai.completion_json` (see below) or set flattened attributes like `gen_ai.completion.0.role` or `gen_ai.completion.0.content`. |
| `gen_ai.completion_json`         | `output`                    | A JSON-serialized string containing an array of [OpenAI messages](https://platform.openai.com/docs/api-reference/chat/create).                                                                                                |
| `gen_ai.request.model`           | `metadata.model`            | The model name (e.g. "gpt-4o")                                                                                                                                                                                                |
| `gen_ai.request.max_tokens`      | `metadata.max_tokens`       | `max_tokens`                                                                                                                                                                                                                  |
| `gen_ai.request.temperature`     | `metadata.temperature`      | `temperature`                                                                                                                                                                                                                 |
| `gen_ai.request.top_p`           | `metadata.top_p`            | `top_p`                                                                                                                                                                                                                       |
| `gen_ai.usage.prompt_tokens`     | `metrics.prompt_tokens`     | Input tokens                                                                                                                                                                                                                  |
| `gen_ai.usage.completion_tokens` | `metrics.completion_tokens` | Output tokens                                                                                                                                                                                                                 |

You can also use the `braintrust` namespace to set fields in Braintrust directly:

| Attribute                | Braintrust Field | Notes                                                                                                                                                                                                                           |
| ------------------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `braintrust.input`       | `input`          | Typically a single user message (string). If you have an array of messages, use `braintrust.input_json` instead (see below) or set flattened attributes like `braintrust.input.0.role` or `braintrust.input.0.content`.         |
| `braintrust.input_json`  | `input`          | A JSON-serialized string containing an array of [OpenAI messages](https://platform.openai.com/docs/api-reference/chat/create).                                                                                                  |
| `braintrust.output`      | `output`         | Typically a single assistant message (string). If you have an array of messages, use `braintrust.output_json` instead (see below) or set flattened attributes like `braintrust.output.0.role` or `braintrust.output.0.content`. |
| `braintrust.output_json` | `output`         | A JSON-serialized string containing an array of [OpenAI messages](https://platform.openai.com/docs/api-reference/chat/create).                                                                                                  |
| `braintrust.metadata`    | `metadata`       | A JSON-serialized dictionary with string keys. Alternatively, you can use flattened attribute names, like `braintrust.metadata.model` or `braintrust.metadata.temperature`.                                                     |
| `braintrust.metrics`     | `metrics`        | A JSON-serialized dictionary with string keys. Alternatively, you can use flattened attribute names, like `braintrust.metrics.prompt_tokens` or `braintrust.metrics.completion_tokens`.                                         |

Here's an example of how to set up manual tracing:

```python
import json
import os

from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

BRAINTRUST_API_URL = os.environ.get("BRAINTRUST_API_URL", "https://api.braintrust.dev")
BRAINTRUST_API_KEY = os.environ.get("BRAINTRUST_API_KEY", "<Your API Key>")
PROJECT_ID = "<Your Project ID>"

provider = TracerProvider()
processor = BatchSpanProcessor(
    OTLPSpanExporter(
        endpoint=f"{BRAINTRUST_API_URL}/otel/v1/traces",
        headers={"Authorization": f"Bearer {BRAINTRUST_API_KEY}", "x-bt-parent": f"project_id:{PROJECT_ID}"},
    )
)
provider.add_span_processor(processor)
trace.set_tracer_provider(provider)
tracer = trace.get_tracer(__name__)

# Export a span with flattened attribute names.
with tracer.start_as_current_span("GenAI Attributes") as span:
    span.set_attribute("gen_ai.prompt.0.role", "system")
    span.set_attribute("gen_ai.prompt.0.content", "You are a helpful assistant.")
    span.set_attribute("gen_ai.prompt.1.role", "user")
    span.set_attribute("gen_ai.prompt.1.content", "What is the capital of France?")

    span.set_attribute("gen_ai.completion.0.role", "assistant")
    span.set_attribute("gen_ai.completion.0.content", "The capital of France is Paris.")

    span.set_attribute("gen_ai.request.model", "gpt-4o-mini")
    span.set_attribute("gen_ai.request.temperature", 0.5)
    span.set_attribute("gen_ai.usage.prompt_tokens", 10)
    span.set_attribute("gen_ai.usage.completion_tokens", 30)

# Export a span using JSON-serialized attributes.
with tracer.start_as_current_span("GenAI JSON-Serialized Attributes") as span:
    span.set_attribute(
        "gen_ai.prompt_json",
        json.dumps(
            [
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "What is the capital of Italy?"},
            ]
        ),
    )
    span.set_attribute(
        "gen_ai.completion_json",
        json.dumps(
            [
                {"role": "assistant", "content": "The capital of Italy is Rome."},
            ]
        ),
    )

# Export a span using the `braintrust` namespace.
with tracer.start_as_current_span("Braintrust Attributes") as span:
    span.set_attribute("braintrust.input.0.role", "system")
    span.set_attribute("braintrust.input.0.content", "You are a helpful assistant.")
    span.set_attribute("braintrust.input.1.role", "user")
    span.set_attribute("braintrust.input.1.content", "What is the capital of Libya?")

    span.set_attribute("braintrust.output.0.role", "assistant")
    span.set_attribute("braintrust.output.0.content", "The capital of Brazil is Brasilia.")

    span.set_attribute("braintrust.metadata.model", "gpt-4o-mini")
    span.set_attribute("braintrust.metadata.country", "Brazil")
    span.set_attribute("braintrust.metrics.prompt_tokens", 10)
    span.set_attribute("braintrust.metrics.completion_tokens", 20)

# Export a span using JSON-serialized `braintrust` attributes.
with tracer.start_as_current_span("Braintrust JSON-Serialized Attributes") as span:
    span.set_attribute(
        "braintrust.input_json",
        json.dumps(
            [
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "What is the capital of Argentina?"},
            ]
        ),
    )
    span.set_attribute(
        "braintrust.output_json",
        json.dumps(
            [
                {"role": "assistant", "content": "The capital of Argentina is Buenos Aires."},
            ]
        ),
    )
    span.set_attribute(
        "braintrust.metadata",
        json.dumps({"model": "gpt-4o-mini", "country": "Argentina"}),
    )
    span.set_attribute(
        "braintrust.metrics",
        json.dumps({"prompt_tokens": 15, "completion_tokens": 45}),
    )
```

### Troubleshooting

#### Why are my traces not showing up?

There are a few common reasons why your traces may not show up in Braintrust:

* Braintrust's logs table only shows traces that have a root span (i.e. `span_parents` is empty). If you only send children
  spans, they will not appear in the logs table. A common reason for this is only sending spans to Braintrust which have a
  `traceparent` header. To fix this, make sure to send a root span for every trace you want to appear in the UI.
* If you are self-hosting Braintrust, make sure you **do not** use `https://api.braintrust.dev` and instead use your custom
  API URL as the `OTLP_ENDPOINT`, for example `https://dfwhllz61x709.cloudfront.net/otel`.

## Vercel AI SDK

The [Vercel AI SDK](https://sdk.vercel.ai/docs/ai-sdk-core) is an elegant tool for building AI-powered applications.
You can wrap the SDK in Braintrust to automatically log your requests.

```typescript
import { initLogger, wrapAISDKModel } from "braintrust";
import { openai } from "@ai-sdk/openai";

// `initLogger` sets up your code to log to the specified Braintrust project using your API key.
// By default, all wrapped models will log to this project. If you don't call `initLogger`, then wrapping is a no-op, and you will not see spans in the UI.
initLogger({
  projectName: "My Project",
  apiKey: process.env.BRAINTRUST_API_KEY,
});

const model = wrapAISDKModel(openai.chat("gpt-3.5-turbo"));

async function main() {
  // This will automatically log the request, response, and metrics to Braintrust
  const response = await model.doGenerate({
    inputFormat: "messages",
    mode: {
      type: "regular",
    },
    prompt: [
      {
        role: "user",
        content: [{ type: "text", text: "What is the capital of France?" }],
      },
    ],
  });
  console.log(response);
}

main();
```

## OpenAI Agents SDK

When installed with the `openai-agents` extra,
the Braintrust SDK provides a `tracing.TracingProcessor` implementation
that sends the traces and spans from the OpenAI Agents SDK to Braintrust.

```bash
pip install braintrust[openai-agents]
```

```py
import asyncio

from agents import Agent, Runner, set_trace_processors
from braintrust import init_logger
from braintrust.wrappers.openai import BraintrustTracingProcessor


async def main():
    agent = Agent(
        name="Assistant",
        instructions="You only respond in haikus.",
    )

    result = await Runner.run(agent, "Tell me about recursion in programming.")
    print(result.final_output)


if __name__ == "__main__":
    set_trace_processors([BraintrustTracingProcessor(init_logger("openai-agent"))])
    asyncio.run(main())
```

The constructor of `BraintrustTracingProcessor` can take a `braintrust.Span`, `braintrust.Experiment`, or `braintrust.Logger`
that serves as the root under which all spans will be logged.
If `None` is passed, the current span, experiment, or logger
will be selected exactly as in `braintrust.start_span`.

![OpenAI Agents SDK Logs](./oai-agents-sdk-logs.png)

The Agents SDK can also be used to implement a `task` in an `Eval`,
making it straightforward to build and evaluate agentic workflows:

```py
from agents import Agent, Runner, set_trace_processors
from braintrust import Eval
from braintrust.wrappers.openai import BraintrustTracingProcessor

from autoevals import ClosedQA

set_trace_processors([BraintrustTracingProcessor()])


async def task(input: str):
    agent = Agent(
        name="Assistant",
        instructions="You only respond in haikus.",
    )

    result = await Runner.run(agent, input)
    return result.final_output


Eval(
    name="openai-agent",
    data=[
        {
            "input": "Tell me about recursion in programming.",
        }
    ],
    task=task,
    scores=[
        ClosedQA.partial(
            criteria="The response should respond to the prompt and be a haiku.",
        )
    ],
)
```

![OpenAI Agents SDK Eval](./oai-agents-sdk-eval.png)

## Instructor

To use [Instructor](https://github.com/jxnl/instructor) to generate structured outputs, you need to wrap the
OpenAI client with both Instructor and Braintrust. It's important that you call Braintrust's `wrap_openai` first,
because it uses low-level usage info and headers returned by the OpenAI call to log metrics to Braintrust.

```python
import instructor
from braintrust import init_logger, load_prompt, wrap_openai

logger = init_logger(project="Your project name")


def run_prompt(text: str):
    # Replace with your project name and slug
    prompt = load_prompt("Your project name", "Your prompt name")

    # wrap_openai will make sure the client tracks usage of the prompt.
    client = instructor.patch(wrap_openai(OpenAI()))

    # Render with parameters
    return client.chat.completions.create(**prompt.build(input=text), response_model=MyResponseModel)
```

## LangChain

Trace your LangChain applications by configuring a global LangChain callback handler.

<CodeTabs>
  <TSTab>
    ```typescript
    import {
      BraintrustCallbackHandler,
      setGlobalHandler,
    } from "@braintrust/langchain-js";
    import { ConsoleCallbackHandler } from "@langchain/core/tracers/console";
    import { ChatOpenAI } from "@langchain/openai";
    import { initLogger } from "braintrust";

    initLogger({
      projectName: "My Project",
      apiKey: process.env.BRAINTRUST_API_KEY,
    });

    const handler = new BraintrustCallbackHandler();
    setGlobalHandler(handler);

    async function main() {
      const model = new ChatOpenAI({ modelName: "gpt-4o-mini" });

      await model.invoke("What is the capital of France?", {
        callbacks: [new ConsoleCallbackHandler()], // alternatively, you can manually pass the handler here instead of setting the handler globally
      });
    }

    main();
    ```

    Learn more about [LangChain callbacks](https://js.langchain.com/docs/how_to/#callbacks) in their documentation.
  </TSTab>

  <PYTab>
    ```python
    import asyncio

    from braintrust import init_logger
    from braintrust_langchain import BraintrustCallbackHandler, set_global_handler
    from langchain_core.prompts import ChatPromptTemplate
    from langchain_openai import ChatOpenAI


    async def main():
        init_logger(project="My Project", api_key=os.environ.get("BRAINTRUST_API_KEY"))

        handler = BraintrustCallbackHandler()
        set_global_handler(handler)

        # Initialize your LangChain components
        prompt = ChatPromptTemplate.from_template("What is 1 + {number}?")
        model = ChatOpenAI()

        # Create a simple chain
        chain = prompt | model

        # Use LangChain as normal - all calls will be logged to Braintrust
        response = await chain.ainvoke({"number": "2"})


    if __name__ == "__main__":
        asyncio.run(main())
    ```

    Learn more about [LangChain callbacks](https://python.langchain.com/docs/how_to/#callbacks) in their documentation.
  </PYTab>
</CodeTabs>

# Eval playgrounds

Playgrounds are a powerful workspace for rapidly iterating on AI engineering primitives. Tune prompts, models, scorers and datasets in an editor-like interface, and run full evaluations in real-time, side by side.

Use playgrounds to build and test hypotheses and evaluation configurations in a flexible environment. Playgrounds leverage the same underlying `Eval` structure as experiments, with support for running thousands of dataset rows directly in the browser. Collaborating with teammates is also simple with a shared URL.

Playgrounds are designed for quick prototyping of ideas. When a playground is run, its previous generations are overwritten. You can create [experiments](/docs/evals) from playgrounds when you need to capture an immutable snapshot of your evaluations for long-term reference or point-in-time comparison.

## Creating a playground

A playground includes one or more evaluation tasks, one or more scorers, and optionally, a dataset.

You can create a playground by navigating to **Evaluations** > **Playgrounds**, or by selecting **Create playground with prompt** at the bottom of a prompt dialog.

![Empty Playground](/docs/guides/playground/simple-playground.png)

### Tasks

Tasks define LLM instructions. There are three types of tasks:

* [Prompts](/docs/guides/functions/prompts): AI model, prompt messages, parameters, and tools.

* [Agents](/docs/guides/functions/agents): A chain of prompts.

* [Remote evals](/docs/guides/remote-evals): Prompts and scorers from external sources.

<Callout type="info">
  [AI providers](/docs/reference/organizations#ai-providers) must be configured before playgrounds can be run.
</Callout>

An empty playground will prompt you to create a base task, and optional comparison tests. The base task is used as the source when diffing output traces.

![Base task empty playground](/docs/guides/playground/base-task.png)

When you select **Run** (or the keyboard shortcut Cmd/Ctrl+Enter), each task runs in parallel and the results stream into the grid below. You can also choose to view in list or summary layout.

For multimodal workflows, supported [attachments](/docs/guides/attachments#viewing-attachments) will have a preview shown in the inline embedded view.

### Scorers

Scorers quantify the quality of evaluation outputs using an LLM judge or code. You can use built-in [autoevals](/docs/reference/autoevals) for common evaluation scenarios to help you get started quickly, or write [custom scorers](/docs/guides/functions/scorers) tailored to your use case.

To add a scorer, select **+ Scorer** and choose from the list or create a custom scorer.

![Add scorer](/docs/guides/playground/add-scorer.png)

### Datasets

[Datasets](/docs/guides/datasets) provide structured inputs, expected values, and metadata for evaluations.

A playground can be run without a dataset to view a single set of task outputs, or with a dataset to view a matrix of outputs for many inputs.

Datasets can be linked to a playground by selecting existing library datasets, or creating/importing a new one.

Once you link a dataset, you will see a new row in the grid for each record in the dataset. You can reference the
data from each record in your prompt using the `input`, `expected`, and `metadata` variables. The playground uses
[mustache](https://mustache.github.io/) syntax for templating:

![Prompt with dataset](/docs/guides/playground/prompt-with-dataset.png)

Each value can be arbitrarily complex JSON, for example, `{{input.formula}}`. If you want to preserve double curly brackets `{{` and `}}` as plain text in your prompts, you can change the delimiter tags to any custom
string of your choosing. For example, if you want to change the tags to `<%` and `%>`, insert `{{=<% %>=}}` into the message,
and all strings below in the message block will respect these delimiters:

```
{{=<% %>=}}
Return the number in the following format: {{ number }}

<% input.formula %>
```

<Callout type="info">
  Dataset edits in playgrounds edit the original dataset.
</Callout>

## Running a playground

To run a playground, select the **Run** button at the top of the playground to run all tasks and all dataset rows. You can also run a single task individually, or run a single dataset row.

<video className="border rounded-md" loop autoPlay muted poster="/docs/guides/playground/running-playground-poster.png">
  <source src="/docs/guides/playground/running-playground.mp4" type="video/mp4" />
</video>

### Viewing traces

Select a row in the results table to compare evaluation traces side-by-side. This allows you to identify differences in outputs, scores, metrics, and input data.

![Trace viewer](/docs/guides/playground/trace-viewer.png)

From this view, you can also run a single row by selecting **Run row**.

### Diffing

Diffing allows you to visually compare variations across models, prompts, or agents to quickly understand differences in outputs.

To turn on diff mode, select the diff toggle.

<video className="border rounded-md" loop autoPlay muted poster="/docs/guides/playground/diffing-poster.png">
  <source src="/docs/guides/playground/diffing.mp4" type="video/mp4" />
</video>

## Creating experiment snapshots

Experiments formalize evaluation results for comparison and historical reference. While playgrounds are better for fast, iterative exploration, experiments are immutable, point-in-time evaluation snapshots ideal for detailed analysis and reporting.

To create an experiment from a playground, select **+ Experiment**. Each playground task will map to its own experiment.

<video className="border rounded-md" loop autoPlay muted poster="/docs/guides/playground/create-experiment-poster.png">
  <source src="/docs/guides/playground/create-experiment-from-playground.mp4" type="video/mp4" />
</video>

## Advanced options

### Appended dataset messages

You may sometimes have additional messages in a dataset that you want to append to a prompt. This option lets you specify a path to a messages array in the dataset. For example, if `input` is specified as the appended messages path and a dataset row has the following input, all prompts in the playground will run with additional messages.

```json
[
  {
    "role": "assistant",
    "content": "Is there anything else I can help you with?"
  },
  {
    "role": "user",
    "content": "Yes, I have another question."
  }
]
```

### Max concurrency

The maximum number of tasks/scorers that will be run concurrently in the playground. This is useful for avoiding rate limits (429 - Too many requests) from AI providers.

### Strict variables

When this option is enabled, evaluations will fail if the dataset row does not include all of the variables referenced in prompts.

## Sharing playgrounds

Playgrounds are designed for collaboration and automatically synchronize in real-time.

To share a playground, copy the URL and send it to your collaborators. Your collaborators
must be members of your organization to see the session. You can invite users from the <Link href="/app/settings?subroute=team" target="_blank">settings</Link> page.

# Datasets

Datasets allow you to collect data from production, staging, evaluations, and even manually, and then
use that data to run evaluations and track improvements over time.

For example, you can use Datasets to:

* Store evaluation test cases for your eval script instead of managing large JSONL or CSV files
* Log all production generations to assess quality manually or using model graded evals
* Store user reviewed (<ThumbsUp className="size-4 inline" />, <ThumbsDown className="size-4 inline" />) generations to find new test cases

In Braintrust, datasets have a few key properties:

* **Integrated**. Datasets are integrated with the rest of the Braintrust platform, so you can use them in
  evaluations, explore them in the playground, and log to them from your staging/production environments.
* **Versioned**. Every insert, update, and delete is versioned, so you can pin evaluations to a specific version
  of the dataset, rewind to a previous version, and track changes over time.
* **Scalable**. Datasets are stored in a modern cloud data warehouse, so you can collect as much data as you want without worrying about
  storage or performance limits.
* **Secure**. If you run Braintrust [in your cloud environment](/docs/guides/self-hosting), datasets are stored in your warehouse and
  never touch our infrastructure.

## Creating a dataset

Records in a dataset are stored as JSON objects, and each record has three top-level fields:

* `input` is a set of inputs that you could use to recreate the example in your application. For example, if you're logging
  examples from a question answering model, the input might be the question.
* `expected` (optional) is the output of your model. For example, if you're logging examples from a question answering model, this
  might be the answer. You can access `expected` when running evaluations as the `expected` field; however, `expected` does not need to be
  the ground truth.
* `metadata` (optional) is a set of key-value pairs that you can use to filter and group your data. For example, if you're logging
  examples from a question answering model, the metadata might include the knowledge source that the question came from.

Datasets are created automatically when you initialize them in the SDK.

### Inserting records

You can use the SDK to initialize and insert into a dataset:

<CodeTabs>
  <TSTab>
    ```javascript
    import { initDataset } from "braintrust";

    async function main() {
      const dataset = initDataset("My App", { dataset: "My Dataset" });
      for (let i = 0; i < 10; i++) {
        const id = dataset.insert({
          input: i,
          expected: { result: i + 1, error: null },
          metadata: { foo: i % 2 },
        });
        console.log("Inserted record with id", id);
      }

      console.log(await dataset.summarize());
    }

    main();
    ```
  </TSTab>

  <PYTab>
    ```python
    import braintrust

    dataset = braintrust.init_dataset(project="My App", name="My Dataset")
    for i in range(10):
        id = dataset.insert(input=i, expected={"result": i + 1, "error": None}, metadata={"foo": i % 2})
        print("Inserted record with id", id)

    print(dataset.summarize())
    ```
  </PYTab>
</CodeTabs>

### Updating records

In the above example, each `insert()` statement returns an `id`. You can use this `id` to update the record using `update()`:

<CodeTabs>
  <TSTab>
    ```javascript #skip-compile
    dataset.update({
      id,
      input: i,
      expected: { result: i + 1, error: "Timeout" },
    });
    ```
  </TSTab>

  <PYTab>
    ```python
    dataset.update(input=i, expected={"result": i + 1, "error": "Timeout"}, id=id)
    ```
  </PYTab>
</CodeTabs>

The `update()` method applies a merge strategy: only the fields you provide will be updated, and all other existing fields in the record will remain unchanged.

### Deleting records

You can delete records via code by `id`:

<CodeTabs>
  <TSTab>
    ```javascript #skip-compile
    await dataset.delete(id);
    ```
  </TSTab>

  <PYTab>
    ```python
    dataset.delete(id)
    ```
  </PYTab>
</CodeTabs>

To delete an entire dataset, use the [API command](/docs/reference/api/Datasets#delete-dataset).

### Flushing

In both TypeScript and Python, the Braintrust SDK flushes records as fast as possible and installs an exit handler that tries
to flush records, but these hooks are not always respected (e.g. by certain runtimes, or if you `exit` a process yourself). If
you need to ensure that records are flushed, you can call `flush()` on the dataset.

<CodeTabs>
  <TSTab>
    ```javascript #skip-compile
    await dataset.flush();
    ```
  </TSTab>

  <PYTab>
    ```python
    dataset.flush()
    ```
  </PYTab>
</CodeTabs>

### Multimodal datasets

You may want to store or process images in your datasets. There are currently three ways to use images in Braintrust:

* Image URLs (most performant)
* Base64 (least performant)
* Attachments (easiest to manage, stored in Braintrust)
* External attachments (access files in your own object stores)

If you're building a dataset of large images in Braintrust, we recommend using image URLs. This keeps your dataset lightweight and allows you to preview or process them without storing heavy binary data directly.

If you prefer to keep all data within Braintrust, create a dataset of attachments instead. In addition to images, you can create datasets of attachments that have any arbitrary data type, including audio and PDFs. You can then [use these datasets in evaluations](/docs/guides/evals/write#attachments).

<CodeTabs>
  <TSTab>
    ```typescript title="attachment_dataset.ts"
    import { Attachment, initDataset } from "braintrust";
    import path from "node:path";

    async function createPdfDataset(): Promise<void> {
      const dataset = initDataset({
        project: "Project with PDFs",
        dataset: "My PDF Dataset",
      });
      for (const filename of ["example.pdf"]) {
        dataset.insert({
          input: {
            file: new Attachment({
              filename,
              contentType: "application/pdf",
              data: path.join("files", filename),
            }),
          },
        });
      }
      await dataset.flush();
    }

    // Create a dataset with attachments.
    createPdfDataset();
    ```

    To invoke this script, run this in your terminal:

    ```bash
    npx tsx attachment_dataset.ts
    ```
  </TSTab>

  <PYTab>
    ```python title="attachment_dataset.py"
    import os
    from typing import Any, Dict

    from braintrust import Attachment, init_dataset


    def create_pdf_dataset() -> None:
        """Create a dataset with attachments."""
        dataset = init_dataset("Project with PDFs", "My PDF Dataset")
        for filename in ["example.pdf"]:
            dataset.insert(
                input={
                    "file": Attachment(
                        filename=filename,
                        content_type="application/pdf",
                        # The file on your filesystem or the file's bytes.
                        data=os.path.join("files", filename),
                    )
                },
                # This is a toy example where we check that the file size is what we expect.
                expected=469513,
            )
        dataset.flush()


    # Create a dataset with attachments.
    create_pdf_dataset()
    ```

    To invoke this script, run this in your terminal:

    ```bash
    python attachment_dataset.py
    ```
  </PYTab>
</CodeTabs>

<Callout type="info">
  Attachments are not yet supported in the playground. To explore images in the playground, we recommend using image URLs.
</Callout>

## Managing datasets in the UI

In addition to managing datasets through the API, you can also manage them in the Braintrust UI.

### Viewing a dataset

You can view a dataset in the Braintrust UI by navigating to the project and then clicking on the dataset.

![Dataset Viewer](/docs/guides/datasets/datasets.webp)

From the UI, you can filter records, create new ones, edit values, and delete records. You can also copy records
between datasets and from experiments into datasets. This feature is commonly used to collect interesting or
anomalous examples into a golden dataset.

#### Create custom columns

When viewing a dataset, create [custom columns](/docs/guides/evals/interpret#create-custom-columns) to extract specific values from `input`, `expected`, or `metadata` fields.

### Creating a dataset

The easiest way to create a dataset is to upload a CSV file.

![Upload CSV](./datasets/CSV-Upload.gif)

### Updating records

Once you've uploaded a dataset, you can update records or add new ones directly in the UI.

![Edit record](./datasets/Edit-record.gif)

### Labeling records

In addition to updating datasets through the API, you can edit and label them in the UI. Like experiments and logs, you can
configure [categorical fields](/docs/guides/human-review#writing-to-expected-fields) to allow human reviewers
to rapidly label records.

<Callout type="info">
  This requires you to first [configure human review](/docs/guides/human-review#configuring-human-review) in the **Configuration** tab of your project.
</Callout>

![Write to expected](./human-review/expected-fields.png)

### Deleting records

To delete a record, navigate to **Library → Datasets** and select the dataset. Select the check box next to the individual record you'd like to delete, and then select the **Trash** icon.

<video className="border rounded-md" loop autoPlay muted poster="/docs/guides/datasets/delete-dataset-poster.png">
  <source src="/docs/guides/datasets/delete-dataset-record.mp4" type="video/mp4" />

  <a href="/docs/guides/datasets/delete-dataset-record.mp4">Video</a>
</video>

You can follow the same steps to delete an entire dataset from the **Library > Datasets** page.

## Using a dataset in an evaluation

You can use a dataset in an evaluation by passing it directly to the `Eval()` function.

<CodeTabs>
  <TSTab>
    ```typescript
    import { initDataset, Eval } from "braintrust";
    import { Levenshtein } from "autoevals";

    Eval(
      "Say Hi Bot", // Replace with your project name
      {
        data: initDataset("My App", { dataset: "My Dataset" }),
        task: async (input) => {
          return "Hi " + input; // Replace with your LLM call
        },
        scores: [Levenshtein],
      },
    );
    ```
  </TSTab>

  <PYTab>
    ```python
    from braintrust import Eval, init_dataset

    from autoevals import Levenshtein

    Eval(
        "Say Hi Bot",  # Replace with your project name
        data=init_dataset(project="My App", name="My Dataset"),
        task=lambda input: "Hi " + input,  # Replace with your LLM call
        scores=[Levenshtein],
    )
    ```
  </PYTab>
</CodeTabs>

You can also manually iterate through a dataset's records and run your tasks,
then log the results to an experiment. Log the `id`s to link each dataset record
to the corresponding result.

<CodeTabs>
  <TSTab>
    ```typescript
    import { initDataset, init, Dataset, Experiment } from "braintrust";

    function myApp(input: any) {
      return `output of input ${input}`;
    }

    function myScore(output: any, rowExpected: any) {
      return Math.random();
    }

    async function main() {
      const dataset = initDataset("My App", { dataset: "My Dataset" });
      const experiment = init("My App", {
        experiment: "My Experiment",
        dataset: dataset,
      });
      for await (const row of dataset) {
        const output = myApp(row.input);
        const closeness = myScore(output, row.expected);
        experiment.log({
          input: row.input,
          output,
          expected: row.expected,
          scores: { closeness },
          datasetRecordId: row.id,
        });
      }

      console.log(await experiment.summarize());
    }

    main();
    ```
  </TSTab>

  <PYTab>
    ```python
    import random

    import braintrust


    def my_app(input):
        return f"output of input {input}"


    def my_score(output, row_expected):
        return random.random()


    dataset = braintrust.init_dataset(project="My App", name="My Dataset")
    experiment = braintrust.init(project="My App", experiment="My Experiment", dataset=dataset)
    for row in dataset:
        output = my_app(row["input"])
        closeness = my_score(output, row["expected"])
        experiment.log(
            input=row["input"],
            output=output,
            expected=row["expected"],
            scores=dict(closeness=closeness),
            dataset_record_id=row["id"],
        )

    print(experiment.summarize())
    ```
  </PYTab>
</CodeTabs>

You can also use the results of an experiment as baseline data for future experiments by calling the `asDataset()`/`as_dataset()` function, which converts the experiment into dataset format (`input`, `expected`, and `metadata`).

<CodeTabs>
  <TSTab>
    ```typescript
    import { init, Eval } from "braintrust";
    import { Levenshtein } from "autoevals";

    const experiment = init("My App", {
      experiment: "my-experiment",
      open: true,
    });

    Eval<string, string>("My App", {
      data: experiment.asDataset(),
      task: async (input) => {
        return `hello ${input}`;
      },
      scores: [Levenshtein],
    });
    ```
  </TSTab>

  <PYTab>
    ```python
    from braintrust import Eval, init

    from autoevals import Levenshtein

    experiment = braintrust.init(
        project="My App",
        experiment="my-experiment",
        open=True,
    )

    Eval(
        "My App",
        data=experiment.as_dataset(),
        task=lambda input: input + 1,  # Replace with your LLM call
        scores=[Levenshtein],
    )
    ```
  </PYTab>
</CodeTabs>

For a more advanced overview of how to use an experiment as a baseline for other experiments, see [hill climbing](/docs/guides/evals/write#hill-climbing).

## Logging from your application

To log to a dataset from your application, you can simply use the SDK and call `insert()`. Braintrust logs
are queued and sent asynchronously, so you don't need to worry about critical path performance.

Since the SDK uses API keys, it's recommended that you log from a privileged environment (e.g. backend server),
instead of client applications directly.

This example walks through how to track <ThumbsUp className="size-4 inline" /> / <ThumbsDown className="size-4 inline" /> from feedback:

<CodeTabs>
  <TSTab>
    ```javascript
    import { initDataset, Dataset } from "braintrust";

    class MyApplication {
      private dataset: Dataset | undefined = undefined;

      async initApp() {
        this.dataset = await initDataset("My App", { dataset: "logs" });
      }

      async logUserExample(
        input: any,
        expected: any,
        userId: string,
        orgId: string,
        thumbsUp: boolean,
      ) {
        if (this.dataset) {
          this.dataset.insert({
            input,
            expected,
            metadata: { userId, orgId, thumbsUp },
          });
        } else {
          console.warn("Must initialize application before logging");
        }
      }
    }
    ```
  </TSTab>

  <PYTab>
    ```python
    from typing import Any

    import braintrust


    class MyApplication:
        def init_app(self):
            self.dataset = braintrust.init_dataset(project="My App", name="logs")

        def log_user_example(self, input: Any, expected: Any, user_id: str, org_id: str, thumbs_up: bool):
            if self.dataset:
                self.dataset.insert(
                    input=input,
                    expected=expected,
                    metadata=dict(user_id=user_id, org_id=org_id, thumbs_up=thumbs_up),
                )
            else:
                print("Must initialize application before logging")
    ```
  </PYTab>
</CodeTabs>

## Troubleshooting

### Downloading large datasets

If you are trying to load a very large dataset, you may run into timeout errors while using the SDK. If so, you
can [paginate](/docs/guides/api#downloading-a-dataset-using-pagination) through the dataset to download it in smaller chunks.

# Views

You'll often want to create a view that shows data organized and visualized a certain way on the same underlying data. Views are saved table configurations that preserve filters, sorts, column order and column visibility. All table-based layouts, including logs, experiments, datasets and projects support configured views.

![Views](/docs/guides/views.png)

## Default locked views

Some table layouts include default views for convenience. These views are locked and cannot be modified or deleted.

* **All rows** corresponds to all of the records in a given table. This is the default, unfiltered view.

On experiment and logs pages:

* **Non-errors** corresponds to all of the records in a given table that do not contain errors.
* **Errors** corresponds to all of the records in a given table that contain errors.

On experiment pages:

* **Unreviewed** hides items that have already been human-reviewed.

## Creating and managing custom views

### In the UI

To create a custom view, start by applying the filters, sorts, and columns that you would like to have visible in your view. Then, navigate to the **Views** dropdown and select **Create view**.

<video className="border rounded-md" loop autoPlay muted poster="/docs/guides/views-poster.png">
  <source src="/docs/guides/views.mp4" type="video/mp4" />
</video>

After entering a view, any changes you make to the filters, sorts, and columns will be auto-saved.

To rename, duplicate, delete, or set as default, use the **...** menu next to the view name.

![Views menu](/docs/guides/views-menu.png)

### In code

Views can also be created and managed programmatically [via the API](/docs/reference/api/Views).

## Access

Views are accessible and configurable by any member of the organization.

## Best practices

Use views when:

* You frequently reapply the same filters.
* You want to standardize what your team sees.
* You want to review only a subset of records.

Make sure to use clear, descriptive names so your team can quickly understand the purpose of each view. Some example views might be:

* "Logs with Factuality \< 50%"
* "Unreviewed high-priority traces"
* "Failing test cases"
* "Tagged with 'Customer Support'"
* "Lisa's test cases"

### Using views with custom columns

If you regularly filter by complex or nested JSON queries or metadata, consider creating [custom columns](/docs/guides/evals/interpret#create-custom-columns). Custom columns let you surface frequently-used or computed values directly as columns, simplifying repetitive filtering tasks. Custom columns are also rendered in trace spans, with their own span field view type (for example, JSON, Markdown, or HTML).

For example, you can analyze data across multiple models within a single experiment view:

* First, define a custom column extracting the model name from your metadata.
* Then, apply the custom column, sort, and any additional standard filters, then save this configuration as a view.
* Lastly, use the filter dropdown to quickly toggle between models.

# Functions

Braintrust functions are atomic, reusable building blocks for executing AI-related logic. Functions are hosted and remotely executed in a performant serverless environment and are fully intended to be used in production. Functions can be invoked through the [API](/docs/reference/api/Functions), SDK, or the UI, and have built-in support for streaming and structured outputs.

There are currently three types of functions in Braintrust:

* <Bubble size={16} className="text-primary-900 dark:text-primary-900 inline-block mr-1" /> [Prompts](/docs/guides/functions/prompts)<br />Templated messages to send to an LLM.
* <Tool size={16} className="text-primary-900 dark:text-primary-900 inline-block mr-1" /> [Tools](/docs/guides/functions/tools)<br />General purpose code that can be invoked by LLMs.
* <Score size={16} className="text-primary-900 dark:text-primary-900 inline-block mr-1" /> [Scorers](/docs/guides/functions/scorers)<br />Functions for scoring the quality of LLM outputs (a number from 0 to 1).

## Composability

Functions can be composed together to produce sophisticated applications that would otherwise require brittle orchestration logic.

![Functions flow](/blog/meta/functions/functions-flow.png)

In this diagram, a prompt is being invoked with an input and is calling two different tools and scorers to ultimately produce a streaming output. Out of the box, you also get automatic tracing, including the tool calls and scores.

Any function can be used as a tool, which can be called, and its output added to the chat history. For example, a RAG agent can be defined as just two components:

* A vector search tool, `toolRAG`, implemented in TypeScript or Python, which embeds a query, searches for relevant documents, and returns them

<CodeTabs>
  <TSTab>
    ```typescript #skip-compile
    import { OpenAI } from "openai";

    async ({ query, top_k }) => {
      const embedding = await openai.embeddings
        .create({
          input: query,
          model: "text-embedding-3-small",
        })
        .then((res) => res.data[0].embedding);

      const queryResponse = await pc.query({
        vector: embedding,
        topK: top_k,
        includeMetadata: true,
      });

      return queryResponse.matches.map((match) => ({
        title: match.metadata?.title,
        content: match.metadata?.content,
      }));
    };
    ```
  </TSTab>

  <PYTab>
    ```python
    import openai


    def query_vector_db(query, top_k):
        embedding_response = await openai.Embedding.create(input=query, model="text-embedding-3-small")
        embedding = embedding_response["data"][0]["embedding"]

        query_response = pc.query(vector=embedding, top_k=top_k, include_metadata=True)

        results = [
            {"title": match.get("metadata", {}).get("title"), "content": match.get("metadata", {}).get("content")}
            for match in query_response["matches"]
        ]

        return results
    ```
  </PYTab>
</CodeTabs>

* A system prompt containing instructions for how to retrieve content and synthesize answers using the tool

<CodeTabs>
  <TSTab>
    ```typescript #skip-compile
    import * as braintrust from "braintrust";

    const project = braintrust.projects.create({ name: "Doc Search" });

    project.prompts.create({
      name: "Doc Search",
      slug: "document-search",
      description:
        "Search through the Braintrust documentation to answer the user's question",
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that can " +
            "answer questions about the Braintrust documentation.",
        },
        {
          role: "user",
          content: "{{{question}}}",
        },
      ],
      tools: [toolRAG],
    });
    ```
  </TSTab>

  <PYTab>
    ```python
    import braintrust

    project = braintrust.projects.create(name="Doc Search")

    project.prompts.create(
        name="Doc Search",
        slug="document-search",
        description="Search through the Braintrust documentation to answer the user's question",
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant that can answer questions about the Braintrust documentation.",
            },
            {"role": "user", "content": "{{{question}}}"},
        ],
        tools=[toolRAG],
    )
    ```
  </PYTab>
</CodeTabs>

<Callout type="info">
  To dig more into this example, check out the cookbook for [Using functions to build a RAG agent](/docs/cookbook/recipes/ToolRAG).
</Callout>

## Syncing functions via the SDK

You can sync functions between the Braintrust UI and your local codebase using the Braintrust SDK. Currently, this works for any prompts and tools written in TypeScript.

<Callout type="info">
  You can push tools and prompts written in Python to Braintrust using `braintrust push`, but pulling from Braintrust is not yet available.
</Callout>

To push a change from your codebase to the UI, run `npx braintrust push <filename>` from the command line. You can push one or more files or directories to Braintrust. If you specify a directory, all `.ts` files under that directory are pushed.

To pull a change from the UI to your codebase, run `npx braintrust pull`. For example, you can use the `pull` command to:

* Download functions to public projects so others can use them
* Pin your production environment to a specific prompt version without running them through Braintrust on the request path
* Review changes to functions in pull requests

## Code bundling

Braintrust bundles your code together with any libraries and dependencies for serverless execution.

<CodeTabs>
  <TSTab>
    Braintrust uses `esbuild` to bundle your code. Bundling works by creating a single JavaScript file that contains all the necessary code, reducing the risk of version mismatches and dependency errors when deploying functions.

    Since `esbuild` statically analyzes your code, it cannot handle dynamic imports or runtime code modifications.
  </TSTab>

  <PYTab>
    In Python, we use [uv](https://github.com/astral-sh/uv) to cross-bundle a specified list of dependencies to the target
    platform (Linux).

    This works for binary dependencies except for libraries that require on-demand compilation.
  </PYTab>
</CodeTabs>

Once code is bundled and uploaded to the Braintrust UI, you cannot edit it directly in the UI. Any changes must be made locally in your codebase and pushed via the SDK.

## Runtimes

There are three runtimes available for functions:

* TypeScript (Node.js v18, v20, v22)
* Python (Python 3.11, 3.12, 3.13)
* Calling model providers with a prompt via the [AI proxy](/docs/guides/proxy)

### Default Python packages

We include a set of Python packages available in the Braintrust code editor by default:

* `braintrust` (latest)
* `autoevals` (latest)
* `requests` 2.32.2
* `openai` 1.40.8

Uploading code to create a Python function will attempt to use the versions of the above packages (as well as `pydantic`) in your local environment.

# Prompts

Prompt engineering is a core activity in AI engineering. Braintrust allows you to create prompts, test them out in the playground,
use them in your code, update them, and track their performance over time. Our goal is to provide a world-class authoring experience
in Braintrust, seamlessly, securely, and reliably integrate them into your code, and debug issues as they arise.

## Creating a prompt

To create a prompt, navigate to your **Library** in the top menu bar and select **Prompts**, then **Create prompt**. Pick a name and unique slug for your prompt. The slug is an identifier that you can use to reference it in your code. As you change
the prompt's name, description, or contents, its slug stays constant.

![Create a prompt](./prompts/create.gif)

Prompts can use [mustache](https://mustache.github.io/mustache.5.html) templating syntax to refer to variables. These variables are substituted
automatically in the API, playground, and using the `.build()` function in your code. More on that below.

### In code

To create a prompt in code, you can write a script and `push` it to Braintrust:

<CodeTabs>
  <TSTab>
    ```typescript title="summarizer.ts"
    import * as braintrust from "braintrust";

    const project = braintrust.projects.create({
      name: "Summarizer",
    });

    export const summarizer = project.prompts.create({
      name: "Summarizer",
      slug: "summarizer",
      description: "Summarize text",
      model: "claude-3-5-sonnet-latest",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that can summarize text.",
        },
        {
          role: "user",
          content: "{{{text}}}",
        },
      ],
    });
    ```

    ```bash
    npx braintrust push summarizer.ts
    ```
  </TSTab>

  <PYTab>
    ```python title="summarizer.py"
    import braintrust

    project = braintrust.projects.create(name="Summarizer")

    summarizer = project.prompts.create(
        name="Summarizer",
        slug="summarizer",
        description="Summarize text",
        model="claude-3-5-sonnet-latest",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that can summarize text."},
            {"role": "user", "content": "{{{text}}}"},
        ],
    )
    ```

    ```bash
    braintrust push summarizer.py
    ```
  </PYTab>
</CodeTabs>

Each prompt change is versioned, e.g. `5878bd218351fb8e`. You can use this identifier to pin a specific
version of the prompt in your code.

![Update a prompt](./prompts/update.gif)

You can use this identifier to refer to a specific version of the prompt in your code.

### Adding few-shot examples to a prompt

You can also use mustache syntax to add few-shot examples to your prompt. For example:

```bash
Use the following few shots:

{{#input.few_shots}}
input: {{input}}
output: {{output}}
{{/input.few_shots}}
```

### Testing in the playground

While developing a prompt, it can be useful to test it out on real-world data in the [Playground](/docs/guides/playground).
You can open a prompt in the playground, tweak it, and save a new version once you're ready.

![Playground](./prompts/playground.gif)

#### Structured outputs

When using prompts in the playground, you can also define the JSON schema for the structured output of the prompt. Like tool calls, the returned value is parsed as a JSON object automatically.

![Structured outputs](../../reference/release-notes/structured-outputs.gif)

For example:

```yaml
type: object
properties:
  steps:
    type: array
    items:
      type: object
      properties:
        explanation:
          type: string
        output:
          type: string
      required:
        - explanation
        - output
      additionalProperties: false
  final_answer:
    type: string
required:
  - steps
  - final_answer
additionalProperties: false
```

<Callout type="note">
  This JSON object corresponds to the `response_format.json_schema` argument in the [OpenAI API](https://platform.openai.com/docs/api-reference/chat/create), so this feature currently only works for OpenAI models.
</Callout>

## Using tools

You can use any custom tools you've created during prompt execution. To reference a tool when creating a prompt via the SDK, add the names of the tools you want to use to the `tools` parameter:

<CodeTabs>
  <TSTab>
    ```typescript #skip-compile
    import * as braintrust from "braintrust";

    const project = braintrust.projects.create({
      name: "RAG app",
    });

    export const docSearch = project.prompts.create({
      name: "Doc Search",
      slug: "document-search",
      description:
        "Search through the Braintrust documentation to answer the user's question",
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that can " +
            "answer questions about the Braintrust documentation.",
        },
        {
          role: "user",
          content: "{{{question}}}",
        },
      ],
      tools: [toolRAG],
    });
    ```
  </TSTab>

  <PYTab>
    ```python
    import braintrust

    project = braintrust.projects.create(name="RAG app")

    doc_search = project.prompts.create(
        name="Doc Search",
        slug="document-search",
        description="Search through the Braintrust documentation to answer the user's question",
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a helpful assistant that can " + "answer questions about the Braintrust documentation."
                ),
            },
            {
                "role": "user",
                "content": "{{{question}}}",
            },
        ],
        tools=[tool_rag],
    )
    ```
  </PYTab>
</CodeTabs>

<Callout type="info">
  In Python, the prompt and the tool need to be defined in the same file and pushed to Braintrust together. In TypeScript, they can be defined and pushed separately.
</Callout>

To add a tool to a prompt via the UI, select the **Tools** dropdown in the prompt creation window and select a tool from your library, then save the prompt.

![Invoke github tool](./tools/invoke-github-tool.gif)

For more information about creating and using tools, check out the [Tools guide](/docs/guides/functions/tools).

## Using prompts in your code

### Executing directly

In Braintrust, a prompt is a simple function that can be invoked directly through the SDK and [REST API](/docs/reference/api/Functions#invoke-function). When invoked, prompt functions leverage the [proxy](/docs/guides/proxy) to access a wide range of providers and models with managed secrets, and are automatically traced and logged to your Braintrust project. All functions are fully managed and versioned via the UI and API.

<Callout type="info">
  Functions are a broad concept that encompass prompts, code snippets, HTTP endpoints, and more. When using the functions API, you can use a prompt's
  slug or ID as the function's slug or ID, respectively. To learn more about functions, see the [functions reference](/docs/reference/functions).
</Callout>

<CodeTabs>
  <TSTab>
    ```typescript
    import { invoke } from "braintrust";

    async function main() {
      const result = await invoke({
        projectName: "your project name",
        slug: "your prompt slug",
        input: {
          // These variables map to the template parameters in your prompt.
          question: "1+1",
        },
      });
      console.log(result);
    }

    main();
    ```
  </TSTab>

  <PYTab>
    ```python
    from braintrust import invoke

    result = invoke(project_name="your project name", slug="your prompt slug", input={"question": "1+1"})
    print(result)
    ```
  </PYTab>
</CodeTabs>

The return value, `result`, is a string unless you have tool calls, in which case it returns the arguments
of the first tool call. In TypeScript, you can assert this by using the [`schema`](/docs/reference/libs/nodejs/interfaces/InvokeFunctionArgs#schema) argument, which ensures your
code matches a particular zod schema:

<CodeTabs>
  <TSTab>
    ```typescript
    import { invoke } from "braintrust";
    import { z } from "zod";

    async function main() {
      const result = await invoke({
        projectName: "your project name",
        slug: "your prompt slug",
        input: {
          question: "1+1",
        },
        schema: z.string(),
      });
      console.log(result);
    }

    main();
    ```
  </TSTab>

  <PYTab>
    ```python
    from braintrust import invoke

    result = invoke(project_name="your project name", slug="your prompt slug", input={"question": "1+1"})

    print(result)
    ```
  </PYTab>
</CodeTabs>

#### Adding extra messages

If you're building a chat app, it's often useful to send back additional messages of context as you gather them. You can provide
OpenAI-style messages to the `invoke` function by adding `messages`, which are appended to the end of the built-in messages:

<CodeTabs>
  <TSTab>
    ```typescript
    import { invoke } from "braintrust";
    import { z } from "zod";

    async function reflection(question: string) {
      const result = await invoke({
        projectName: "your project name",
        slug: "your prompt slug",
        input: {
          question,
        },
        schema: z.string(),
      });
      console.log(result);

      const reflectionResult = await invoke({
        projectName: "your project name",
        slug: "your prompt slug",
        input: {
          question,
        },
        messages: [
          { role: "assistant", content: result },
          { role: "user", content: "Are you sure about that?" },
        ],
      });
      console.log(reflectionResult);
    }

    reflection("What is larger the Moon or the Earth?");
    ```
  </TSTab>

  <PYTab>
    ```python
    from braintrust import invoke


    def reflection(question: str):
        result = invoke(project_name="your project name", slug="your prompt slug", input={"question": question})
        print(result)

        reflection_result = invoke(
            project_name="your project name",
            slug="your prompt slug",
            input={"question": question},
            messages=[
                {"role": "assistant", "content": result},
                {"role": "user", "content": "Are you sure about that?"},
            ],
        )
        print(reflection_result)


    reflection("What is larger the Moon or the Earth?")
    ```
  </PYTab>
</CodeTabs>

#### Streaming

You can also stream results in an easy-to-parse format.

<CodeTabs>
  <TSTab>
    ```typescript
    import { invoke } from "braintrust";

    async function main() {
      const result = await invoke({
        projectName: "your project name",
        slug: "your prompt slug",
        input: {
          question: "1+1",
        },
        stream: true,
      });

      for await (const chunk of result) {
        console.log(chunk);
        // { type: "text_delta", data: "The answer "}
        // { type: "text_delta", data: "is 2"}
      }
    }

    main();
    ```
  </TSTab>

  <PYTab>
    ```python
    from braintrust import invoke

    result = invoke("your project name", "your prompt slug", input={"question": "1+1"}, stream=True)
    for chunk in result:
        print(chunk)
    ```
  </PYTab>
</CodeTabs>

#### Vercel AI SDK

If you're using Next.js and the [Vercel AI SDK](https://sdk.vercel.ai/docs), you can use the Braintrust
adapter by installing the `@braintrust/vercel-ai-sdk` package and converting the stream to Vercel's format:

```typescript
import { invoke } from "braintrust";
import { BraintrustAdapter } from "@braintrust/vercel-ai-sdk";

export async function POST(req: Request) {
  const stream = await invoke({
    projectName: "your project name",
    slug: "your prompt slug",
    input: await req.json(),
    stream: true,
  });

  return BraintrustAdapter.toAIStreamResponse(stream);
}
```

You can also use `streamText` to leverage the Vercel AI SDK directly. Be sure to have the [OpenTelemetry environment variables](/docs/guides/traces/integrations#vercel-ai-sdk) configured to log these requests to Braintrust.

```typescript
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    prompt,
    experimental_telemetry: { isEnabled: true },
  });

  return result.toAIStreamResponse();
}
```

#### Logging

`invoke` uses the active logging state of your application, just like any function decorated with `@traced` or `wrapTraced`.
This means that if you [initialize a logger](/docs/guides/functions/prompts#initializing) while calling `invoke`, it will automatically log spans to Braintrust. By default, `invoke` requests will log to a root span, but you can customize the name of a span using the `name` argument. For example:

<CodeTabs>
  <TSTab>
    ```typescript
    import { invoke, initLogger, traced } from "braintrust";

    initLogger({
      projectName: "My project",
    });

    async function main() {
      const result = await traced(
        async (span) => {
          span.log({
            tags: ["foo", "bar"],
          });
          const res = await invoke({
            projectName: "Joker",
            slug: "joker-3c10",
            input: {
              theme: "silicon valley",
            },
          });
          return res;
        },
        {
          name: "My name",
          type: "function",
        },
      );
      console.log(result);
    }

    main().catch(console.error);
    ```
  </TSTab>

  <PYTab>
    ```python
    import braintrust


    @braintrust.traced(name="My name", type="function")
    def run_joker():
        braintrust.current_span().log(tags=["foo", "bar"])
        braintrust.invoke(
            project_name="Joker",
            slug="joker-3c10",
            input={"theme": "silicon valley"},
        )


    def main():
        braintrust.init_logger(project="My project")
        run_joker()


    if __name__ == "__main__":
        main()
    ```
  </PYTab>
</CodeTabs>

will generate a log like this:

![Logs with invoke](./prompts/invoke-log.png)

You can also pass in the `parent` argument, which is a string that you can
derive from `span.export()` while doing [distributed tracing](/docs/guides/traces/customize#distributed-tracing).

### Fetching in code

If you'd like to run prompts directly, you can fetch them using the Braintrust SDK. The [`loadPrompt()`](/docs/reference/libs/nodejs#loadprompt)/[`load_prompt()`](/docs/reference/libs/python#load_prompt)
function loads a prompt into a simple format that you can pass along to the OpenAI client.
`loadPrompt` also caches prompts with a two-layered cache,
and attempts to use this cache if the prompt cannot be fetched from the Braintrust server:

1. A memory cache, which stores up to `BRAINTRUST_PROMPT_CACHE_MEMORY_MAX` prompts in memory.
   This defaults to 1024.
2. A disk cache, which stores up to `BRAINTRUST_PROMPT_CACHE_DISK_MAX` prompts on disk.
   This defaults to 1048576.

You can also configure the directory used by disk cache
by setting the `BRAINTRUST_PROMPT_CACHE_DIR` environment variable.

<CodeTabs>
  <TSTab>
    ```typescript
    import { OpenAI } from "openai";
    import { initLogger, loadPrompt, wrapOpenAI } from "braintrust";

    const logger = initLogger({ projectName: "your project name" });

    // wrapOpenAI will make sure the client tracks usage of the prompt.
    const client = wrapOpenAI(
      new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      }),
    );

    async function runPrompt() {
      // Replace with your project name and slug
      const prompt = await loadPrompt({
        projectName: "your project name",
        slug: "your prompt slug",
        defaults: {
          // Parameters to use if not specified
          model: "gpt-3.5-turbo",
          temperature: 0.5,
        },
      });

      // Render with parameters
      return client.chat.completions.create(
        prompt.build({
          question: "1+1",
        }),
      );
    }
    ```
  </TSTab>

  <PYTab>
    ```python
    import os

    from braintrust import init_logger, load_prompt, wrap_openai
    from openai import OpenAI

    logger = init_logger(project="your project name")


    def run_prompt():
        # Replace with your project name and slug
        prompt = load_prompt(
            "your project name", "your prompt slug", defaults=dict(model="gpt-3.5-turbo", temperature=0.5)
        )

        # wrap_openai will make sure the client tracks usage of the prompt.
        client = wrap_openai(OpenAI(api_key=os.environ["OPENAI_API_KEY"]))

        # Render with parameters
        return client.chat.completions.create(**prompt.build(question="1+1"))
    ```
  </PYTab>
</CodeTabs>

<Callout type="info">
  If you need to use another model provider, then you can use the [Braintrust
  proxy](/docs/guides/proxy) to access a wide range of models using the OpenAI
  format. You can also grab the `messages` and other parameters directly from
  the returned object to use a model library of your choice.
</Callout>

### Pinning a specific version

To pin a specific version of a prompt, use the `loadPrompt()`/`load_prompt()` function with the version identifier.

<CodeTabs>
  <TSTab>
    ```typescript #skip-compile
    const prompt = await loadPrompt({
      projectName: "your project name",
      slug: "your prompt slug",
      version: "5878bd218351fb8e",
    });
    ```
  </TSTab>

  <PYTab>
    ```python
    prompt = load_prompt("your project name", "your prompt slug", version="5878bd218351fb8e")
    ```
  </PYTab>
</CodeTabs>

### Pulling prompts locally

You can also download prompts to your local filesystem and ensure a specific version is used via version control. You should
use the `pull` command to:

* Download prompts to public projects so others can use them
* Pin your production environment to a specific version without running them through Braintrust on the request path
* Review changes to prompts in pull requests

```bash
$ npx braintrust pull --help
usage: cli.js pull [-h] [--output-dir OUTPUT_DIR] [--project-name PROJECT_NAME] [--project-id PROJECT_ID] [--id ID] [--slug SLUG] [--version VERSION] [--force]

optional arguments:
  -h, --help            show this help message and exit
  --output-dir OUTPUT_DIR
                        The directory to output the pulled resources to. If not specified, the current directory is used.
  --project-name PROJECT_NAME
                        The name of the project to pull from. If not specified, all projects are pulled.
  --project-id PROJECT_ID
                        The id of the project to pull from. If not specified, all projects are pulled.
  --id ID               The id of a specific function to pull.
  --slug SLUG           The slug of a specific function to pull.
  --version VERSION     The version to pull. Will pull the latest version of each prompt that is at or before this version.
  --force               Overwrite local files if they have uncommitted changes.
```

<Callout type="warn">
  Currently, `braintrust pull` only supports TypeScript.
</Callout>

When you run `braintrust pull`, you can specify a project name, prompt slug, or version to pull. If you don't specify
any of these, all prompts across projects will be pulled into a separate file per project. For example, if you have a
project named `Summary`

```bash
$ npx braintrust pull --project-name "Summary"
```

will generate the following file:

```typescript title="summary.ts"
// This file was automatically generated by braintrust pull. You can
// generate it again by running:
//  $ braintrust pull --project-name "Summary"
// Feel free to edit this file manually, but once you do, you should make sure to
// sync your changes with Braintrust by running:
//  $ braintrust push "braintrust/summary.ts"

import braintrust from "braintrust";

const project = braintrust.projects.create({
  name: "Summary",
});

export const summaryBot = project.prompts.create({
  name: "Summary bot",
  slug: "summary-bot",
  model: "gpt-4o",
  messages: [
    { content: "Summarize the following passage.", role: "system" },
    { content: "{{content}}", role: "user" },
  ],
});
```

<Callout type="info">
  To pin your production environment to a specific version, you can run `braintrust pull` with the `--version` flag.
</Callout>

#### Using a pulled prompt

The `prompts.create` function generates the same `Prompt` object as the `loadPrompt` function.
This means you can use a pulled prompt in the same way you would use a normal prompt, e.g. by
running `prompt.build()` and passing the result to `client.chat.completions.create()` call.

### Pushing prompts

Just like with tools, you can push prompts to Braintrust using the `push` command. Simply change
the prompt definition, and then run `braintrust push` from the command line. Braintrust automatically generates
a new version for each pushed prompt.

<CodeTabs>
  <TSTab>
    ```bash
    $ npx braintrust push --help
    usage: cli.js push [-h] [--api-key API_KEY] [--org-name ORG_NAME]
                       [--app-url APP_URL] [--env-file ENV_FILE]
                       [--terminate-on-failure] [--tsconfig TSCONFIG]
                       [--if-exists {error,replace,ignore}]
                       [files ...]

    positional arguments:
      files                 A list of files or directories containing functions to
                            bundle. If no files are specified, the current
                            directory is used.

    optional arguments:
      -h, --help            show this help message and exit
      --api-key API_KEY     Specify a braintrust api key. If the parameter is not
                            specified, the BRAINTRUST_API_KEY environment variable
                            will be used.
      --org-name ORG_NAME   The name of a specific organization to connect to.
                            This is useful if you belong to multiple.
      --app-url APP_URL     Specify a custom braintrust app url. Defaults to
                            https://www.braintrust.dev. This is only necessary if
                            you are using an experimental version of Braintrust
      --env-file ENV_FILE   A path to a .env file containing environment variables
                            to load (via dotenv).
      --terminate-on-failure
                            If provided, terminates on a failing eval, instead of
                            the default (moving onto the next one).
      --tsconfig TSCONFIG   Specify a custom tsconfig.json file to use.
      --if-exists {error,replace,ignore}
                            What to do if a function with the same slug already
                            exists. 'error' will cause an error and abort.
                            'replace' will overwrite the existing function.
                            'ignore' will ignore the push for this function and
                            continue.
    ```

    When you run `npx braintrust push`, you can specify one or more files or directories to push. If you specify a directory, all `.ts` files under that directory are pushed.
  </TSTab>

  <PYTab>
    ```bash
    $ braintrust push --help
    usage: braintrust push [-h] [--verbose] [--api-key API_KEY] [--org-name ORG_NAME] [--app-url APP_URL] [--if-exists IF_EXISTS] [--requirements REQUIREMENTS] file

    positional arguments:
      file                  File to push.

    options:
      -h, --help            show this help message and exit
      --verbose, -v         Include additional details, including full stack traces on errors. Pass twice (-vv) for debug logging.
      --api-key API_KEY     Specify a Braintrust api key. If the parameter is not specified, the BRAINTRUST_API_KEY environment variable will be used.
      --org-name ORG_NAME   The name of a specific organization to connect to. This is useful if you belong to multiple.
      --app-url APP_URL     Specify a custom Braintrust app url. Defaults to https://www.braintrust.dev. This is only necessary if you are using an experimental version of Braintrust.
      --if-exists IF_EXISTS
                            What to do if a function with the same slug already exists. 'error' will cause an error and abort. 'replace' will overwrite the existing function. 'ignore' will ignore the push for this function and continue.
      --requirements REQUIREMENTS
                            The requirements file to bundle dependencies from.
    ```

    When you run `braintrust push`, you must specify a `.py` file to push, similar to a `main` file.
    This file can import other `.py` files that contain function definitions;
    all of these functions will be pushed together to Braintrust.
  </PYTab>
</CodeTabs>

See the example in the [guide to tools](/docs/guides/functions/tools#using-tools-in-code)
for more details.

### Deployment strategies

It is often useful to use different versions of a prompt in different environments. For example, you might want to use the latest
version locally and in staging, but pin a specific version in production. This is simple to setup by conditionally passing a version
to `loadPrompt()`/`load_prompt()` based on the environment.

<CodeTabs>
  <TSTab>
    ```typescript #skip-compile
    const prompt = await loadPrompt({
      projectName: "your project name",
      slug: "your prompt slug",
      version:
        process.env.NODE_ENV === "production" ? "5878bd218351fb8e" : undefined,
    });
    ```
  </TSTab>

  <PYTab>
    ```python
    prompt = load_prompt(
        "your project name",
        "your prompt slug",
        version="5878bd218351fb8e" if os.environ["NODE_ENV"] == "production" else None,
    )
    ```
  </PYTab>
</CodeTabs>

### Chat vs. completion format

In Python, `prompt.build()` returns a dictionary with chat or completion parameters, depending on the prompt type. In TypeScript, however,
`prompt.build()` accepts an additional parameter (`flavor`) to specify the format. This allows `prompt.build` to be used in a more type-safe
manner. When you specify a flavor, the SDK also validates that the parameters are correct for that format.

```typescript #skip-compile
const chatParams = prompt.build(
  {
    question: "1+1",
  },
  {
    // This is the default
    flavor: "chat",
  },
);

const completionParams = prompt.build(
  {
    question: "1+1",
  },
  {
    // Pass "completion" to get completion-shaped parameters
    flavor: "completion",
  },
);
```

## Opening from traces

When you use a prompt in your code, Braintrust automatically links spans to the prompt used to generate them. This allows
you to click to open a span in the playground, and see the prompt that generated it alongside the input variables. You can
even test and save a new version of the prompt directly from the playground.

![Open from traces](./prompts/debug.gif)

This workflow is very powerful. It effectively allows you to debug, iterate, and publish changes to your prompts directly
within Braintrust. And because Braintrust flexibly allows you to load the latest prompt, a specific version, or even a version
controlled artifact, you have a lot of control over how these updates propagate into your production systems.

## Using the API

The full lifecycle of prompts - creating, retrieving, modifying, etc. - can be managed through the REST API. See the [API docs](/docs/api/spec#prompts) for
more details.

# Tools

Tool functions in Braintrust allow you to define general-purpose code that can be invoked by LLMs to add complex logic or external operations to your workflows.
Tools are reusable and composable, making it easy to iterate on assistant-style agents and more advanced applications. You can create tools in TypeScript or
Python and deploy them across the UI and API via prompts.

## Creating a tool

Currently, you must define tools via code and push them to Braintrust with `braintrust push`. To define a tool,
use [`project.tool.create`](/docs/reference/libs/nodejs/classes/ToolBuilder#create) and pick a name and
unique slug:

<CodeTabs>
  <TSTab>
    ```typescript title=calculator.ts
    import * as braintrust from "braintrust";
    import { z } from "zod";

    const project = braintrust.projects.create({ name: "calculator" });

    project.tools.create({
      handler: ({ op, a, b }) => {
        switch (op) {
          case "add":
            return a + b;
          case "subtract":
            return a - b;
          case "multiply":
            return a * b;
          case "divide":
            return a / b;
        }
      },
      name: "Calculator method",
      slug: "calculator",
      description:
        "A simple calculator that can add, subtract, multiply, and divide.",
      parameters: z.object({
        op: z.enum(["add", "subtract", "multiply", "divide"]),
        a: z.number(),
        b: z.number(),
      }),
      returns: z.number(),
      ifExists: "replace",
    });
    ```
  </TSTab>

  <PYTab>
    ```python title=calculator.py
    from typing import Literal

    import braintrust
    import requests
    from pydantic import BaseModel, RootModel

    project = braintrust.projects.create(name="calculator")


    class CalculatorInput(BaseModel):
        op: Literal["add", "subtract", "multiply", "divide"]
        a: float
        b: float


    class CalculatorOutput(RootModel[float]):
        pass


    def calculator(op, a, b):
        match op:
            case "add":
                return a + b
            case "subtract":
                return a - b
            case "multiply":
                return a * b
            case "divide":
                return a / b


    project.tools.create(
        handler=calculator,
        name="Calculator method",
        slug="calculator-2",
        description="A simple calculator that can add, subtract, multiply, and divide.",
        parameters=CalculatorInput,  # You can also provide raw JSON schema here if you prefer
        returns=CalculatorOutput,
    )
    ```
  </PYTab>
</CodeTabs>

### Pushing to Braintrust

Once you define a tool, you can push it to Braintrust with `braintrust push`:

<CodeTabs>
  <TSTab>
    ```bash
    npx braintrust push calculator.ts
    ```
  </TSTab>

  <PYTab>
    ```bash
    braintrust push calculator.py
    ```
  </PYTab>
</CodeTabs>

### Dependencies

Braintrust will take care of bundling the dependencies your tool needs.

<CodeTabs>
  <TSTab>
    In TypeScript, we use [esbuild](https://esbuild.github.io/) to bundle your code and its dependencies together.
    This works for most dependencies, but it does not support native (compiled) libraries like SQLite.
  </TSTab>

  <PYTab>
    In Python, we use [uv](https://github.com/astral-sh/uv) to cross-bundle a specified list of dependencies to the target
    platform (Linux). This works for binary dependencies except for libraries that require on-demand compilation.

    ```bash
    braintrust push my_tool.py --requirements requirements.txt
    ```
  </PYTab>
</CodeTabs>

If you have trouble bundling your dependencies, let us know by [filing an issue](https://github.com/braintrustdata/braintrust-sdk/issues).

## Using tools in the UI

Once you define a tool in Braintrust, you can access it through the UI and [API](/docs/reference/api/Functions#invoke-function). However,
the real advantage lies in calling a tool from an LLM. Most models support tool calling, which allows them to select a tool from a list of available
options. Normally, it's up to you to execute the tool, retrieve its results, and re-run the model with the updated context.

Braintrust simplifies this process dramatically by:

* Automatically passing the tool's definition to the model
* Running the tool securely in a sandbox environment when called
* Re-running the model with the tool's output
* Streaming the whole output along with intermediate progress to the client

### Viewing tools in the UI

If you visit a project in the UI, you'll see the available tools listed on the **Tools** page in the **Library**:

<video className="border rounded-md" loop autoPlay muted poster="/docs/guides/tool-ui.png">
  <source src="/docs/guides/tool-ui.mp4" type="video/mp4" />
</video>

You can run single datapoints right inside the tool to test its functionality.

### Adding tools to a prompt

To add a tool to a prompt, select it in the **Tools** dropdown in your Prompt window. Braintrust will automatically:

* Include it in the list of available tools to the model
* Invoke the tool if the model calls it, and append the result to the message history
* Call the model again with the tool's result as context
* Continue for up to (default) 5 iterations or until the model produces a non-tool result

As an example, let's define a tool that looks up information about the most recent commit in a GitHub repository:

<CodeTabs>
  <TSTab>
    ```typescript title=github.ts
    import * as braintrust from "braintrust";
    import { z } from "zod";

    const project = braintrust.projects.create({ name: "github" });

    project.tools.create({
      handler: async ({ org, repo }: { org: string; repo: string }) => {
        const url = `https://api.github.com/repos/${org}/${repo}/commits?per_page=1`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.length > 0) {
          return data[0];
        } else {
          return null;
        }
      },
      name: "Get latest commit",
      slug: "get-latest-commit",
      description: "Get the latest commit in a repository",
      parameters: z.object({
        org: z.string(),
        repo: z.string(),
      }),
      ifExists: "replace",
    });
    ```
  </TSTab>

  <PYTab>
    ```python title=github.py
    import braintrust
    import requests
    from pydantic import BaseModel

    project = braintrust.projects.create(name="github")


    class Args(BaseModel):
        org: str
        repo: str


    def handler(org, repo):
        url = f"https://api.github.com/repos/{org}/{repo}/commits?per_page=1"
        resp = requests.get(url)
        resp.raise_for_status()
        data = resp.json()
        if len(data) > 0:
            return data[0]
        return None


    project.tools.create(
        handler=handler,
        name="Get latest commit",
        slug="get-latest-commit",
        description="Get the latest commit in a repository",
        parameters=Args,
    )
    ```
  </PYTab>
</CodeTabs>

If you save this file locally to `github.ts` or `github.py`, you can run

<CodeTabs>
  <TSTab>
    ```bash
    npx braintrust push github.ts
    ```
  </TSTab>

  <PYTab>
    ```bash
    braintrust push github.py
    ```
  </PYTab>
</CodeTabs>

to push the function to Braintrust. Once the command completes, you should see the function listed in the Library's **Tools** tab.

![Tool code in library](./tools/github-tool.png)

Then, you can add the tool to your prompt and run it.

<video className="border rounded-md" loop autoPlay muted poster="/docs/guides/invoke-github-tool.png">
  <source src="/docs/guides/invoke-github-tool.mp4" type="video/mp4" />
</video>

### Embedding tool calls into a prompt

In addition to selecting from the tool menu to add a tool to a prompt, you can also add a tool call directly from the **Assistant** or **Tool** messages within a prompt.

<video className="border rounded-md" loop autoPlay muted poster="/docs/guides/tools-in-prompt.png">
  <source src="/docs/guides/tools-in-prompt.mp4" type="video/mp4" />
</video>

To add a tool call to an Assistant prompt, select **Assistant** from the dropdown menu. Then, select the Swiss army knife icon to **Toggle tool calls**. You'll be able to add the tool code directly into the prompt editor. For example:

```bash
- id: '{{input.2.function_call.0.id}}'
  function:
    arguments: '{{input.2.function_calls.0.function.arguments}}'
    name: '{{input.2.function_calls.0.function.name}}'
  type: function
```

In this example, `input.2.function_call.0.id` is pulled from the input data and refers to the third message's first tool call.

You can also select **Tool** from the dropdown menu to enter a tool call ID, such as `{{input.3.function_responses.0.id}}`.

### Structured outputs

Another use case for tool calling is to coerce a model into producing structured outputs that match a given JSON schema. You can do this
without creating a tool function, and instead use the **Raw** tab in the **Tools** dropdown.

Enter an array of tool definitions following the [OpenAI tool format](https://platform.openai.com/docs/guides/function-calling):

![Raw tools](./tools/raw-tools.gif)

Braintrust supports two different modes for executing raw tools:

* `auto` will return the arguments of the first tool call as a JSON object. This is the default mode.
* `parallel` will return an array of all tool calls including both function names and arguments.

![Invoke raw tool](./tools/invoke-raw-tools.gif)

<Callout type="info">
  `response_format: { type: "json_object" }` does not get parsed as a JSON object and will be returned as a string.
</Callout>

## Using tools in code

You can also attach a tool to a prompt defined in code. For example:

<CodeTabs>
  <TSTab>
    ```typescript title=github.ts
    import * as braintrust from "braintrust";
    import { z } from "zod";

    const project = braintrust.projects.create({ name: "github" });

    const latestCommit = project.tools.create({
      handler: async ({ org, repo }: { org: string; repo: string }) => {
        const url = `https://api.github.com/repos/${org}/${repo}/commits?per_page=1`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.length > 0) {
          return data[0];
        } else {
          return null;
        }
      },
      name: "Get latest commit",
      slug: "get-latest-commit",
      description: "Get the latest commit in a repository",
      parameters: z.object({
        org: z.string(),
        repo: z.string(),
      }),
    });

    project.prompts.create({
      model: "gpt-4o-mini",
      name: "Commit bot",
      slug: "commit-bot",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that can help with GitHub.",
        },
        {
          role: "user",
          content: "{{{question}}}",
        },
      ],
      tools: [latestCommit],
    });
    ```
  </TSTab>

  <PYTab>
    ```python title=github.py
    import braintrust
    import requests
    from pydantic import BaseModel

    project = braintrust.projects.create(name="github")


    class Args(BaseModel):
        org: str
        repo: str


    def handler(org, repo):
        url = f"https://api.github.com/repos/{org}/{repo}/commits?per_page=1"
        resp = requests.get(url)
        resp.raise_for_status()
        data = resp.json()
        if len(data) > 0:
            return data[0]
        return None


    latest_commit = project.tools.create(
        handler=handler,
        name="Get latest commit",
        slug="get-latest-commit",
        description="Get the latest commit in a repository",
        parameters=Args,
    )

    project.prompts.create(
        model="gpt-4o-mini",
        name="Commit bot",
        slug="commit-bot",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant that can help with GitHub.",
            },
            {
                "role": "user",
                "content": "{{{question}}}",
            },
        ],
        tools=[latest_commit],
    )
    ```
  </PYTab>
</CodeTabs>

If you run `braintrust push` on this file, Braintrust will push both the tool and the prompt.

You can also define the tool and prompt in separate files and push them together with `braintrust push`:

<CodeTabs>
  <TSTab>
    ```typescript title=latest-commit.ts
    import * as braintrust from "braintrust";
    import { z } from "zod";

    const project = braintrust.projects.create({ name: "github" });

    export const latestCommit = project.tools.create({
      handler: async ({ org, repo }: { org: string; repo: string }) => {
        const url = `https://api.github.com/repos/${org}/${repo}/commits?per_page=1`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.length > 0) {
          return data[0];
        } else {
          return null;
        }
      },
      name: "Get latest commit",
      slug: "get-latest-commit",
      description: "Get the latest commit in a repository",
      parameters: z.object({
        org: z.string(),
        repo: z.string(),
      }),
    });
    ```

    ```typescript #skip-compile title=commit-bot.ts
    import * as braintrust from "braintrust";
    import { latestCommit } from "./latest-commit";

    const project = braintrust.projects.create({ name: "github" });

    project.prompts.create({
      model: "gpt-4o-mini",
      name: "Commit bot",
      slug: "commit-bot",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that can help with GitHub.",
        },
        {
          role: "user",
          content: "{{{question}}}",
        },
      ],
      tools: [latestCommit],
    });
    ```
  </TSTab>

  <PYTab>
    ```python title=latest-commit.py
    import braintrust
    import requests
    from pydantic import BaseModel

    project = braintrust.projects.create(name="github")


    class Args(BaseModel):
        org: str
        repo: str


    def handler(org, repo):
        url = f"https://api.github.com/repos/{org}/{repo}/commits?per_page=1"
        resp = requests.get(url)
        resp.raise_for_status()
        data = resp.json()
        if len(data) > 0:
            return data[0]
        return None


    latest_commit = project.tools.create(
        handler=handler,
        name="Get latest commit",
        slug="get-latest-commit",
        description="Get the latest commit in a repository",
        parameters=Args,
    )
    ```

    ```python title=commit-bot.py
    import braintrust

    from .latest_commit import latest_commit

    project = braintrust.projects.create(name="github")

    project.prompts.create(
        model="gpt-4o-mini",
        name="Commit bot",
        slug="commit-bot",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant that can help with GitHub.",
            },
            {
                "role": "user",
                "content": "{{{question}}}",
            },
        ],
        tools=[latest_commit],
    )
    ```
  </PYTab>
</CodeTabs>

If you run `braintrust push` on the prompt file, Braintrust will push both the tool and the prompt.
Note that the Python interpreter only supports relative imports from within a package,
so you must either define the tool in the same file as the prompt, or use a package structure.

<CodeTabs>
  <TSTab>
    ```bash
    npx braintrust push commit-bot.ts
    ```
  </TSTab>

  <PYTab>
    ```bash
    braintrust push commit-bot.py
    ```
  </PYTab>
</CodeTabs>

# Scorers

Scorers in Braintrust allow you to evaluate the output of LLMs based on a set of criteria. These can include both heuristics (expressed as code) or prompts (expressed as LLM-as-a-judge). Scorers help you assign a performance score between 0 and 100% to assess how well the AI outputs match expected results. While many scorers are available out of the box in Braintrust, you can also create your own custom scorers directly in the UI or upload them via the command line. Scorers that you define in the UI can also be used as functions.

## Autoevals

There are several pre-built scorers available via the open-source [autoevals](https://github.com/braintrustdata/autoevals) library, which offers standard evaluation methods that you can start using immediately.

Autoeval scorers offer a strong starting point for a variety of evaluation tasks. Some autoeval scorers require configuration before they can be used effectively. For example, you might need to define expected outputs or certain parameters for specific tasks. To edit an autoeval scorer, you must copy it first.

While autoevals are a great way to get started, you may eventually need to create your own custom scorers for more advanced use cases.

## Custom scorers

You can create custom scorers in TypeScript, Python, or as an LLM-as-a-judge through the UI by navigating to **Library > Scorers** and selecting **Create scorer**. These scorers will be available to use as functions throughout your project. You can also upload custom scorers from the command line.

### TypeScript and Python scorers

For more specialized evals, you can create custom scorers in either TypeScript or Python. These code-based scorers are highly customizable and can return scores based on your exact requirements. Simply add your custom code to the `TypeScript` or `Python` tabs, and it will run in a sandboxed environment.

![Create TypeScript scorer](./scorers/code-scorer-ui.png)

This command will bundle and upload your custom scorer functions, making them accessible across your Braintrust projects.

### LLM-as-a-judge scorers

In addition to code-based scorers, you can also create LLM-as-a-judge scorers through the UI. For an LLM-as-a-judge scorer, you define a prompt that evaluates the AI's output and maps its choices to specific scores. You can also configure whether to use techniques like chain-of-thought (CoT) reasoning for more complex evaluations.

![Create LLM-as-a-judge scorer](./scorers/llm-as-a-judge-scorer-ui.png)

## Using a scorer in the UI

You can use both autoevals and custom scorers in the Braintrust Playground. In your playground, navigate to **Scorers** and select from the list of available scorers. You can also create a new custom scorer from this menu.

![Using scorer in playground](./scorers/using-scorers-in-playground.gif)

The Playground allows you to iterate quickly on prompts while running evaluations, making it the perfect tool for testing and refining your AI models and prompts.

## Pushing scorers via the CLI

As with tools, when writing custom scorers in the UI,
there may be restrictions on certain imports or functionality,
but you can always write your scorers in your own environment
and upload them for use in Braintrust.
This works for both code-based scorers and LLM-as-a-judge scorers.

<CodeTabs>
  <TSTab>
    ```typescript title=scorer.ts
    import braintrust from "braintrust";
    import { z } from "zod";

    const project = braintrust.projects.create({ name: "scorer" });

    project.scorers.create({
      name: "Equality scorer",
      slug: "equality-scorer",
      description: "An equality scorer",
      parameters: z.object({
        output: z.string(),
        expected: z.string(),
      }),
      handler: async ({ output, expected }) => {
        return output == expected ? 1 : 0;
      },
    });

    project.scorers.create({
      name: "Equality LLM scorer",
      slug: "equality-llm-scorer",
      description: "An equality LLM scorer",
      messages: [
        {
          role: "user",
          content:
            'Return "A" if {{output}} is equal to {{expected}}, and "B" otherwise.',
        },
      ],
      model: "gpt-4o",
      useCot: true,
      choiceScores: {
        A: 1,
        B: 0,
      },
    });
    ```
  </TSTab>

  <PYTab>
    ```python title=scorer.py
    import braintrust
    import pydantic

    project = braintrust.projects.create(name="scorer")


    class Input(pydantic.BaseModel):
        output: str
        expected: str


    def handler(output: str, expected: str) -> int:
        return 1 if output == expected else 0


    project.scorers.create(
        name="Equality scorer",
        slug="equality-scorer",
        description="An equality scorer",
        parameters=Input,
        handler=handler,
    )


    project.scorers.create(
        name="Equality LLM scorer",
        slug="equality-llm-scorer",
        description="An equality LLM scorer",
        messages=[
            {
                "role": "user",
                "content": 'Return "A" if {{output}} is equal to {{expected}}, and "B" otherwise.',
            },
        ],
        model="gpt-4o",
        use_cot=True,
        choice_scores={"A": 1, "B": 0},
    )
    ```
  </PYTab>
</CodeTabs>

### Pushing to Braintrust

Once you define a scorer, you can push it to Braintrust with `braintrust push`:

<CodeTabs>
  <TSTab>
    ```bash
    npx braintrust push scorer.ts
    ```
  </TSTab>

  <PYTab>
    ```bash
    braintrust push scorer.py
    ```
  </PYTab>
</CodeTabs>

### Dependencies

Braintrust will take care of bundling the dependencies your scorer needs.

<CodeTabs>
  <TSTab>
    In TypeScript, we use [esbuild](https://esbuild.github.io/)
    to bundle your code and its dependencies together.
    This works for most dependencies,
    but it does not support native (compiled) libraries like SQLite.
  </TSTab>

  <PYTab>
    In Python, we use [uv](https://github.com/astral-sh/uv) to cross-bundle
    a specified list of dependencies to the target platform (Linux).
    This works for binary dependencies
    except for libraries that require on-demand compilation.

    ```bash
    braintrust push scorer.py --requirements requirements.txt
    ```
  </PYTab>
</CodeTabs>

If you have trouble bundling your dependencies, let us know
by [filing an issue](https://github.com/braintrustdata/braintrust-sdk/issues).

## Using scorers in your evals

The scorers that you create in Braintrust are available throughout the UI, e.g. in the playground, but you can
also use them in your code-based evals. See [Using custom prompts/functions from Braintrust](/docs/guides/evals/write#using-custom-promptsfunctions-from-braintrust)
for more details.

# Agents

Agents in Braintrust allow you to chain together two or more prompts. You can create or edit agents in the playground, and view and execute them from the library.

<Callout type="warn">
  Agents are in beta. They currently only work in the playground UI, and are limited to prompt chaining functionality. If you are on a hybrid deployment, agents are available starting with `v0.0.66`.

  Control flow with loops is coming soon, along with full SDK support.
</Callout>

## Creating an agent in the playground

To create an agent, navigate to a playground and select **+Agent**.
Start by creating the base prompt or selecting one from your library.
Then, create or select another prompt by selecting the **+** icon in the comparison agent pane.

<video className="border rounded-md" loop autoPlay muted poster="/docs/guides/agents-poster.png">
  <source src="/docs/guides/agents.mp4" type="video/mp4" />
</video>

The prompts will chain together, and they will automatically run consecutively.

### Variables

When building agents, the first prompt node can access dataset variables. All subsequent prompts can only access the output of the immediate previous node.

* Use `{{input}}`, `{{output}}`, and `{{expected}}` to access dataset variables in the first prompt node.
* For subsequent prompts, use the output of the immediate previous node by including `{{input}}` in your prompt.
  * If the previous node outputs structured data, use dot notation—for example, `{{input.foo}}`.

## Viewing and executing agents

You can view and execute single runs of agents from your agent library, but you will not be able to edit them or see them run.

![Agent library](/docs/guides/agent-library.png)

# Attachments

You can log arbitrary binary data, like images, audio, video, and PDFs, as attachments.
Attachments are useful for building multimodal evaluations, and can enable advanced scenarios like summarizing visual content or analyzing document metadata.

## Uploading attachments

You can upload attachments from either your code or the UI. Your files are securely stored in an object store and associated with the uploading user’s organization. Only you can access your attachments.

### Via code

To [upload an attachment](/docs/guides/tracing#uploading-attachments), create a new `Attachment` object to represent the file path or in-memory buffer that you want to upload:

<CodeTabs>
  <TSTab>
    ```typescript
    import { Attachment, initLogger } from "braintrust";

    const logger = initLogger();

    logger.log({
      input: {
        question: "What is this?",
        context: new Attachment({
          data: "path/to/input_image.jpg",
          filename: "user_input.jpg",
          contentType: "image/jpeg",
        }),
      },
      output: "Example response.",
    });
    ```
  </TSTab>

  <PYTab>
    ```python
    from braintrust import Attachment, init_logger

    logger = init_logger()

    logger.log(
        {
            "input": {
                "question": "What is this?",
                "context": Attachment(
                    data="path/to/input_image.jpg",
                    filename="user_input.jpg",
                    content_type="image/jpeg",
                ),
            },
            "output": "Example response.",
        }
    )
    ```
  </PYTab>
</CodeTabs>

You can place the `Attachment` anywhere in a log, dataset, or feedback log.

Behind the scenes, the [Braintrust SDK](/docs/reference/libs/nodejs/classes/Attachment) automatically detects and uploads attachments in the background, in parallel to the original logs. This ensures that the latency of your logs isn’t affected by any additional processing.

### Using external files as attachments

Braintrust also supports references to files in external object stores with the `ExternalAttachment` object. You can use this anywhere you would use an `Attachment`. Currently S3 is the only supported option for external files.

[attach-ts]: /docs/reference/libs/nodejs/classes/ExternalAttachment

[attach-py]: /docs/reference/libs/python#externalattachment-objects

<CodeTabs>
  <TSTab>
    ```typescript
    import { ExternalAttachment, initLogger } from "braintrust";

    const logger = initLogger({ projectName: "ExternalAttachment Example" });

    logger.log({
      input: {
        question: "What is this?",
        additional_context: new ExternalAttachment({
          url: "s3://an_existing_bucket/path/to/file.pdf",
          filename: "file.pdf",
          contentType: "application/pdf",
        }),
      },
      output: "Example response.",
    });
    ```
  </TSTab>

  <PYTab>
    ```python
    from braintrust import ExternalAttachment, init_logger

    logger = init_logger("ExternalAttachment Example")

    logger.log(
        input={
            "question": "What is this?",
            "additional_context": ExternalAttachment(
                url="s3://an_existing_bucket/path/to/file.pdf",
                filename="file.pdf",
                content_type="application/pdf",
            ),
        },
        output="Example response.",
    )
    ```
  </PYTab>
</CodeTabs>

Just like attachments uploaded to Braintrust, external attachments can be previewed and downloaded for local viewing.

### In the UI

You can upload attachments directly through the UI for any editable span field. This includes:

* Any dataset fields, including datasets in playgrounds
* Log span fields
* Experiment span fields

You can also include attachments in prompt messages when using models that support multimodal inputs.

## Inline attachments

Sometimes your attachments are pre-hosted files which you do not want to upload explicitly, but would like
to display as if they were attachments. Inline attachments allow you to do this, by specifying the URL and content
type of the file. Create a JSON object anywhere in the log data with `type: "inline_attachment"` and `src` and
`content_type` fields. The `filename` field is optional.

```json
{
  "file": {
    "type": "inline_attachment",
    "src": "https://robohash.org/example",
    "content_type": "image/png",
    "filename": "A robot"
  }
}
```

<img src="/docs/guides/inline-attachment.png" alt="Screenshot of inline attachment" width="625" height="313" />

## Viewing attachments

You can preview most images, audio files, videos, or PDFs in the Braintrust UI. You can also download any file to view it locally.
We provide built-in support to preview attachments directly in playground input cells and traces.

In the playground, you can preview attachments in an inline embedded view for easy visual verification during experimentation:

<img src="/docs/guides/attachment-in-playground.png" alt="Screenshot of attachment inline in a playground" width="625" height="313" />

In the trace pane, attachments appear as an additional list under the data viewer:

<img src="/docs/guides/traces/attachment-list-one-image.png" alt="Screenshot of attachment list in Braintrust" width="625" height="313" />

# Projects

A project is analogous to an AI feature in your application. Some customers create separate projects for development and production to help track workflows. Projects contain all [experiments](/docs/guides/evals), [logs](/docs/guides/logging), [datasets](/docs/guides/datasets) and [playgrounds](/docs/guides/playground) for the feature.

For example, a project might contain:

* An experiment that tests the performance of a new version of a chatbot
* A dataset of customer support conversations
* A prompt that guides the chatbot's responses
* A tool that helps the chatbot answer customer questions
* A scorer that evaluates the chatbot's responses
* Logs that capture the chatbot's interactions with customers

## Project configuration

Projects can also house configuration settings that are shared across the project.

### Tags

Braintrust supports tags that you can use throughout your project to curate logs, datasets, and even experiments. You can filter based on tags in the UI to track various kinds of data across your application, and how they change over time. Tags can be created in the **Configuration** tab by selecting **Add tag** and entering a tag name, selecting a color, and adding an optional description.

<Image unoptimized className="box-content" src="/docs/guides/projects/tags.png" alt="Create tag" width="568" height="307" />

For more information about using tags to curate logs, see the [logging guide](/docs/guides/logging#tags-and-queues).

### Human review

You can define scores and labels for manual human review, either as feedback from your users (through the API) or directly through the UI. Scores you define on the **Configuration** page will be available in every experiment and log in your project.

To create a new score, select **Add human review score** and enter a name and score type. You can add multiple options and decide if you want to allow writing to the expected field instead of the score, or multiple choice.

<Image unoptimized className="box-content" src="/docs/guides/projects/human-review.png" alt="Create human review score" width={1124 / 2} height={976 / 2} />

To learn more about human review, check out the [full guide](/docs/guides/human-review).

### Aggregate scores

Aggregate scores are formulas that combine multiple scores into a single value. This can be useful for creating a single score that represents the overall experiment.

To create an aggregate score, select **Add aggregate score** and enter a name, formula, and description. Braintrust currently supports three types of aggregate scores:

<Image unoptimized className="box-content" src="/docs/guides/evals/add-aggregate-score.png" alt="Add aggregate score" width={1136 / 2} height={1012 / 2} />

Braintrust currently supports three types of aggregate scores:

* **Weighted average** - A weighted average of selected scores.
* **Minimum** - The minimum value among the selected scores.
* **Maximum** - The maximum value among the selected scores.

To learn more about aggregate scores, check out the [experiments guide](/docs/guides/evals/interpret#aggregate-weighted-scores).

### Online scoring

Braintrust supports server-side online evaluations that are automatically run asynchronously as you upload logs. To create an online evaluation, select **Add rule** and input the rule name, description, and which scorers and sampling rate you'd like to use. You can choose from custom scorers available in this project and others in your organization, or built-in scorers. Decide if you'd like to apply the rule to the root span or any other spans in your traces.

![Online scoring](/docs/guides/online-scoring.png)

For more information about online evaluations, check out the [logging guide](/docs/guides/logging#online-evaluation).

### Span iframes

You can configure span iframes from your project settings. For more information, check out the [extend traces](/docs/guides/traces/extend/#custom-rendering-for-span-fields) guide.

### Comparison key

When comparing multiple experiments, you can customize the expression you're using to evaluate test cases by changing the comparison key. It defaults to "input," but you can change it in your project's **Configuration** tab.

<Image unoptimized className="box-content" src="/docs/guides/projects/comparison-key.png" alt="Create comparison key" width={1552 / 2} height={282 / 2} />

For more information about the comparison key, check out the [evaluation guide](/docs/guides/evals/interpret#customizing-the-comparison-key).

### Rename project

You can rename your project at any time in the **Configuration** tab.

<Image unoptimized className="box-content" src="/docs/guides/projects/change-project-name.gif" alt="Rename project" width="800" height="117" />

# Monitor page

The **Monitor** page shows aggregate metrics data for both the logs and experiments in a given project. The included charts show values related to the selected time period for latency, token count, time to first token, cost, request count, and scores.

![Monitor page](/docs/guides/monitor/monitor-basic.png)

## Group by metadata

Select the **Group** dropdown menu to group the data by specific metadata fields, including custom fields.

![Monitor page with group by](/docs/guides/monitor/monitor-group-by.png)

## Filter series

Select the filter dropdown menu on any individual chart to apply filters.

<video className="border rounded-md" loop autoPlay muted poster="/docs/guides/monitor/filtersposter.png">
  <source src="/docs/guides/monitor/seriesfilter.mp4" type="video/mp4" />
</video>

## Select a timeframe

Select a timeframe from the given options to see the data associated with that time period.

<video className="border rounded-md" loop autoPlay muted poster="/docs/guides/monitor/timerangeposter.png">
  <source src="/docs/guides/monitor/timerange.mp4" type="video/mp4" />
</video>

## Select to view traces

Select a datapoint node in any of the charts to view the corresponding traces for that time period.

![Monitor page click to view traces](/docs/guides/monitor/monitor-click.png)

# Human review

Although Braintrust helps you automatically evaluate AI software, human
review is a critical part of the process. Braintrust seamlessly integrates human
feedback from end users, subject matter experts, and product teams in one place. You can
use human review to evaluate/compare experiments, assess the efficacy of your automated scoring
methods, and curate log events to use in your evals. As you add human review scores, your logs will update in real time.

![Human review label](./human-review/label.png)

## Configuring human review

To set up human review, define the scores you want to collect in your
project's **Configuration** tab.

![Human Review Configuration](./human-review/config-page.png)

Select **Add human review score** to configure a new score. A score can be one of

* Continuous number value between `0%` and `100%`, with a slider input control.
* Categorical value where you can define the possible options and their scores. Categorical value options
  are also assigned a unique percentage value between `0%` and `100%` (stored as 0 to 1).
* Free-form text where you can write a string value to the `metadata` field at a specified path.

![Create modal](./human-review/create-modal.png)

Created human review scores will appear in the **Human review** section in every experiment and log trace in the project. Categorical scores configured to "write to expected" and free-form scores will also appear on dataset rows.

### Writing to expected fields

You may choose to write categorical scores to the `expected` field of a span instead of a score.
To enable this, check the **Write to expected field instead of score** option. There is also
an option to **Allow multiple choice** when writing to the expected field.

<Callout type="info">
  A numeric score will not be assigned to the categorical options when writing to the expected
  field. If there is an existing object in the expected field, the categorical value will be
  appended to the object.
</Callout>

![Write to expected](./human-review/expected-fields.png)

In addition to categorical scores, you can always directly edit the structured output for the `expected` field of any span through the UI.

## Reviewing logs and experiments

To manually review results from your logs or experiment, select a row to open trace view. There, you can edit the human review scores you previously configured.

<video className="border rounded-md" loop autoPlay muted poster="/docs/in-experiment-poster.mp4">
  <source src="/docs/in-experiment.mp4" type="video/mp4" />
</video>

As you set scores, they will be automatically saved and reflected in the summary metrics. The process is the same whether you're reviewing logs or experiments.

### Leaving comments

In addition to setting scores, you can also add comments to spans and update their `expected` values. These updates
are tracked alongside score updates to form an audit trail of edits to a span.

If you leave a comment that you want to share with a teammate, you can copy a link that will deeplink to the comment.

<video className="border rounded-md" loop autoPlay muted poster="/docs/comment-poster.mp4">
  <source src="/docs/comment.mp4" type="video/mp4" />
</video>

## Focused review mode

If you or a subject matter expert is reviewing a large number of logs or experiments, you can use **Review** mode to enter
a UI that's optimized specifically for review. To enter review mode, hit the "r" key or the expand (<Maximize2 className="size-3 inline" />)
icon next to the **Human review** header in a span.

<video className="border rounded-md" loop autoPlay muted poster="/docs/review-mode-poster.mp4">
  <source src="/docs/review-mode.mp4" type="video/mp4" />
</video>

In review mode, you can set scores, leave comments, and edit expected values. Review mode is optimized for keyboard
navigation, so you can quickly move between scores and rows with keyboard shortcuts. You can also share a link to the
review mode view with other team members, and they'll drop directly into review mode.

### Reviewing data that matches a specific criteria

To easily review a subset of your logs or experiments that match a given criteria, you can filter using English or [BTQL](/docs/reference/btql#btql-query-syntax), then enter review mode.

In addition to filters, you can use [tags](/docs/guides/logging#tags-and-queues) to mark items for `Triage`, and then review them all at once.

You can also save any filters, sorts, or column configurations as views. Views give you a standardized place to see any current or future logs that match a given criteria, for example, logs with a Factuality score less than 50%. Once you create your view, you can enter review mode right from there.

<video className="border rounded-md" loop autoPlay muted poster="/docs/filter-view-review-poster.mp4">
  <source src="/docs/filter-view-review.mp4" type="video/mp4" />
</video>

Reviewing is a common task, and therefore you can enter review mode from any experiment or log view. You can also re-enter review mode from any view to audit
past reviews or update scores.

### Benefits over an annotation queue

* Designed for optimal productivity: The combination of views and human review mode simplifies the review process with intuitive filters, reusable configurations, and keyboard navigation, enabling faster, more efficient log evaluation and feedback.

* Dynamic and flexible views: Views dynamically update with new logs matching saved criteria, eliminating the need to set up and maintain complex automation rules.

* Easy collaboration: Sharing review mode links allows for team collaboration without requiring intricate permissions or setup overhead.

## Filtering using feedback

In the UI, you can filter on log events with specific scores by adding a filter using the filter button, like "Preference is greater than 75%",
and then add the matching rows to a dataset for further investigation.

You can also programmatically filter log events using the API using a query and the project ID:

<CodeTabs>
  <TSTab>
    ```typescript #skip-compile
    await braintrust.projects.logs.fetch(projectId, { query });
    ```
  </TSTab>

  <PYTab>
    ```python
    braintrust.projects.logs.fetch("<project_id>", "scores.Preference > 0.75")
    ```
  </PYTab>
</CodeTabs>

This is a powerful way to utilize human feedback
to improve your evals.

## Capturing end-user feedback

The same set of updates — scores, comments, and expected values — can be captured from end-users as well. See the
[Logging guide](/docs/guides/logs/write#user-feedback) for more details.

# Remote evals

If you have existing infrastructure for running evaluations that isn't easily adaptable to the Braintrust Playground, you can use remote evals to expose a remote endpoint. This lets you run evaluations directly in the playground, iterate quickly across datasets, run scorers, and compare results with other tasks. You can also run multiple instances of your remote eval side-by-side with different parameters and compare results. Parameters defined in the remote eval will be exposed in the playground UI.

<Callout type="warn">
  Remote evals are in beta. If you are on a hybrid deployment, remote evals are available starting with `v0.0.66`.
</Callout>

## Expose remote `Eval`

To expose an `Eval` running at a remote URL or your local machine, simply pass in the `--dev` flag. For example, given the following file, run `npx braintrust eval parameters.eval.ts --dev` to start the dev server and expose `http://localhost:8300`. The dev host and port can also be configured:

* `--dev-host DEV_HOST`: The host to bind the dev server to. Defaults to localhost. Set to 0.0.0.0 to bind to all interfaces.
* `--dev-port DEV_PORT`: The port to bind the dev server to. Defaults to 8300.

```ts parameters.eval.ts
import { Levenshtein } from "autoevals";
import { Eval, initDataset, wrapOpenAI } from "braintrust";
import OpenAI from "openai";
import { z } from "zod";

const client = wrapOpenAI(new OpenAI());

Eval("Simple eval", {
  data: initDataset("local dev", { dataset: "sanity" }), // Datasets are currently ignored
  task: async (input, { parameters }) => {
    const completion = await client.chat.completions.create(
      parameters.main.build({
        input: `${parameters.prefix}:${input}`,
      }),
    );
    return completion.choices[0].message.content ?? "";
  },
  // These scores will be used along with any that you configure in the UI
  scores: [Levenshtein],
  parameters: {
    main: {
      type: "prompt",
      name: "Main prompt",
      description: "This is the main prompt",
      default: {
        messages: [
          {
            role: "user",
            content: "{{input}}",
          },
        ],
        model: "gpt-4o",
      },
    },
    another: {
      type: "prompt",
      name: "Another prompt",
      description: "This is another prompt",
      default: {
        messages: [
          {
            role: "user",
            content: "{{input}}",
          },
        ],
        model: "gpt-4o",
      },
    },
    include_prefix: z
      .boolean()
      .default(false)
      .describe("Include a contextual prefix"),
    prefix: z
      .string()
      .describe("The prefix to include")
      .default("this is a math problem"),
    array_of_objects: z
      .array(
        z.object({
          name: z.string(),
          age: z.number(),
        }),
      )
      .default([
        { name: "John", age: 30 },
        { name: "Jane", age: 25 },
      ]),
  },
});
```

## Running a remote eval from a playground

To run a remote eval from a playground, select **+ Remote** from the Task pane and choose from the evals exposed in localhost or remote sources.

![Remote eval in playground](/docs/guides/remote-eval-in-playground.png)

## Configure remote eval sources

To configure remote eval source URLs for a project, navigate to **Configuration** > **Remote evals**. Then, select **+ Remote eval source** to configure a new remote eval source for your project.

![Configure remote eval](/docs/guides/configure-remote-eval.png)

## Limitations

* The dataset defined in your remote eval will be ignored. Scorers defined in remote evals will be concatenated with playground scorers.
* Remote evals are limited to TypeScript only. Python support is coming soon.

# Automations

Automations let you trigger actions based on specific events in Braintrust. This makes it easier for you to execute common actions and integrate Braintrust with your existing tools and workflows.

<Callout type="warn">
  Automations are in beta. If you are on a hybrid deployment, automations are available starting with `v0.0.72`.
</Callout>

## How automations work

Automations work by monitoring events in your project and executing actions when specified conditions are met. At a high level the automation runtime will:

<Steps>
  <Step>
    Monitor events in your project
  </Step>

  <Step>
    Filter events using [BTQL](/docs/reference/btql)
  </Step>

  <Step>
    Limit execution to once per time interval
  </Step>

  <Step>
    Execute actions on matching data
  </Step>
</Steps>

### Limitations

Currently, automations only support [log events](/docs/guides/logs) and webhook actions. More event types and actions coming soon.

## Creating automations

To create an automation, select **Add automation** from the automations tab in your project configuration and input the automation name, a BTQL filter, time interval, and webhook URL.

![Automations](./automations/create-automation.png)

## Automation settings

* **Name**: A descriptive name for your automation
* **Description** (optional): Additional context about the automation's purpose
* **Event type**: Currently supports "Log event"
* **BTQL filter**: Filter logs using BTQL syntax (if empty, matches all logs)
* **Interval**: How frequently the automation should check for matching events
* **Webhook URL**: The endpoint that will receive the automation data

## Testing automations

Before saving or updating an automation, you can test it to verify it works as expected. The test will trigger the automation as if the initiating event occurred and then run through the BTQL filter, interval, and execute the action on matching rows.
If no matching logs are found, you may need to adjust your BTQL filter or interval. Note that your project must have recent matching logs within the automation interval in order for the test call to succeed.

## Webhook payload

When an automation is triggered it sends a JSON payload to your webhook URL with the following structure:

```json
{
  "organization": {
    "id": "org_123",
    "name": "your-organization"
  },
  "project": {
    "id": "proj_456",
    "name": "your-project"
  },
  "automation": {
    "id": "c5b32408-8568-4bff-9299-8cdd56979b67",
    "name": "High-Priority Factuality",
    "description": "Alert on factuality scores for logs with priority 0 in metadata",
    "event_type": "logs",
    "btql_filter": "metadata.priority = 0 AND scores.Factuality < 0.9",
    "interval_seconds": 3600,
    "url": "https://braintrust.dev/app/your-organization/p/your-project/configuration/automations?aid=c5b32408-8568-4bff-9299-8cdd56979b67"
  },
  "details": {
    "is_test": false,
    "message": "High-Priority Factuality: 5 logs triggered automation in the last 1 hour",
    "time_start": "2025-05-12T10:00:00.000Z",
    "time_end": "2025-05-12T11:00:00.000Z",
    "count": 5,
    "related_logs_url": "https://braintrust.dev/app/your-organization/p/your-project/logs?search=..."
  }
}
```

# Access control

Braintrust has a robust and flexible access control system.
It's possible to grant user permissions at both the organization level as well
as scoped to individual objects within Braintrust (projects, experiments, logs, datasets, prompts, and playgrounds).

## Permission groups

The core concept of Braintrust's access control system is the permission group. Permission groups are collections of users that can be granted specific permissions.
Braintrust has three pre-configured Permission Groups that are scoped to the organization.

1. **Owners** - Unrestricted access to the organization, its data, and its settings. Can add, modify, and delete projects and all other resources. Can invite and remove members and can manage group membership.
2. **Engineers** - Can access, create, update, and delete projects and all resources within projects. Cannot invite or remove members or manage access to resources.
3. **Viewers** - Can access projects and all resources within projects. Cannot create, update, or delete any resources. Cannot invite or remove members or manage access to resources.

If your access control needs are simple and you do not need to restrict access to individual projects, these ready-made permission groups may be all that you need.

A new user can be added to one of these three groups when you invite them to your organization.

![Built-in Permission Groups](./access-control/built-in-permission-groups.png)

## Creating custom permission groups

In addition to the built-in permission groups, it's possible to create your own groups as well.
To do so, go to the 'Permission groups' page of Settings and click on the 'Create permission group' button.
Give your group a name and a description and then click 'Create'.

![Create group](./access-control/create-group.png)

To set organization-level permissions for your new group, find the group in the groups list and click on the Permissions button.

![Custom group permissions](./access-control/custom-group-permissions.png)

<Callout type="info">
  The 'Manage Access' permission should be granted judiciously as it is a super-user permission.
  It gives the user the ability to add and remove permissions, thus any user with 'Manage Access' gains the ability to grant all other permissions to themselves.
  \
  \
  The 'Manage Settings' permission grants users the ability to change organization-level settings like the API URL.
</Callout>

To set group-level permissions for your new group, i.e. who can read, delete, and add members to this group, find the group in the groups list and click on the Group access button.

## Project scoped permissions

To limit access to a specific project, create a new permission group from the Settings page.
![Project level permissions](./access-control/create-project-level.png)

Navigate to the Configuration page of that project, and click on the Permissions link in the context menu.

![Project level permissions](./access-control/project-level-permissions.png)

Search for your group by typing in the text input at the top of the page, and then click the pencil icon next to the group to set permissions.
![Search for group](./access-control/search-for-group.png)

Set the project-level permissions for your group and click Save.
![Set project level permissions](./access-control/set-project-level-permissions.png)

## Object scoped permissions

To limit access to a particular object (experiment, dataset, or playground) within a project, first create a permission group for those users on the 'Permission groups' section of Settings.
![Create experiment level group](./access-control/create-experiment-level-group.png)

Next, navigate to the Configuration page of the project that holds that object and grant the group 'Read' permission at the project level.
This will allow users in that group to navigate to the project in the Braintrust UI.
![Experiment level project permissions](./access-control/experiment-level-project-permissions.png)

![Setting project permissions for experiment](./access-control/read-on-project-for-your-experiment.png)

Finally, navigate to your object and select Permissions from the context menu in the top-right of that object's page.
![Experiment level project permissions](./access-control/experiment-level-permissions-link.png)

Find the permission group via the search input, and click the pencil icon to set permissions for the group.
![Experiment level find group](./access-control/experiment-level-find-group.png)

Set the desired permissions for the group scoped to this specific object.
![Experiment level find group](./access-control/experiment-level-set-permissions.png)

## API support

To automate the creation of permission groups and their access control rules, you can use the Braintrust API.
For more information on using the API to manage permission groups, check out the [API reference for groups](/docs/reference/api/Groups#list-groups) and for [permissions](/docs/reference/api#list-acls).

# AI proxy

The Braintrust AI Proxy is a powerful tool that enables you to access models from [OpenAI](https://platform.openai.com/docs/models),
[Anthropic](https://docs.anthropic.com/claude/reference/getting-started-with-the-api), [Google](https://ai.google.dev/gemini-api/docs),
[AWS](https://aws.amazon.com/bedrock), [Mistral](https://mistral.ai/), and third-party inference providers like [Together](https://www.together.ai/) which offer
open source models like [LLaMa 3](https://ai.meta.com/llama/) — all through a single, unified API.

With the AI proxy, you can:

* **Simplify your code** by accessing many AI providers through a single API.
* **Reduce your costs** by automatically caching results when possible.
* **Increase observability** by optionally logging your requests to Braintrust.

Best of all, the AI proxy is free to use, even if you don't have a Braintrust account.

To read more about why we launched the AI proxy, check out our [blog post](/blog/ai-proxy) announcing the feature.

<Callout type="info">
  The AI proxy is free for all users. You can access it without a Braintrust
  account by using your API key from any of the supported providers. With a
  Braintrust account, you can use a single Braintrust API key to access all AI
  providers.
</Callout>

## Quickstart

The Braintrust Proxy is fully compatible with applications written using the
[OpenAI SDK]. You can get started without making any code changes. Just set the
API URL to `https://api.braintrust.dev/v1/proxy`.

Try running the following script in your favorite language, twice:

<CodeTabs items={['TypeScript', 'Python', 'cURL']}>
  <TSTab>
    ```typescript
    import { OpenAI } from "openai";
    const client = new OpenAI({
      baseURL: "https://api.braintrust.dev/v1/proxy",
      apiKey: process.env.OPENAI_API_KEY, // Can use Braintrust, Anthropic, etc. API keys here
    });

    async function main() {
      const start = performance.now();
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini", // Can use claude-3-5-sonnet-latest, gemini-2.0-flash, etc. here
        messages: [{ role: "user", content: "What is a proxy?" }],
        seed: 1, // A seed activates the proxy's cache
      });
      console.log(response.choices[0].message.content);
      console.log(`Took ${(performance.now() - start) / 1000}s`);
    }

    main();
    ```
  </TSTab>

  <PYTab>
    ```python
    import os
    import time

    from openai import OpenAI

    client = OpenAI(
        base_url="https://api.braintrust.dev/v1/proxy",
        api_key=os.environ["OPENAI_API_KEY"],  # Can use Braintrust, Anthropic, etc. API keys here
    )

    start = time.time()
    response = client.chat.completions.create(
        model="gpt-4o-mini",  # Can use claude-3-5-sonnet-latest, gemini-2.0-flash, etc. here
        messages=[{"role": "user", "content": "What is a proxy?"}],
        seed=1,  # A seed activates the proxy's cache
    )
    print(response.choices[0].message.content)
    print(f"Took {time.time()-start}s")
    ```
  </PYTab>

  <CurlTab>
    ```bash
    time curl -i https://api.braintrust.dev/v1/proxy/chat/completions \
      -H "Content-Type: application/json" \
      -d '{
        "model": "gpt-4o-mini",
        "messages": [
          {
            "role": "user",
            "content": "What is a proxy?"
          }
        ],
        "seed": 1
      }' \
      -H "Authorization: Bearer $OPENAI_API_KEY" \
      --compress
    ```
  </CurlTab>
</CodeTabs>

<Callout type="info">
  Anthropic users can pass their Anthropic API key with a model such as
  `claude-3-5-sonnet-20240620`.
</Callout>

The second run will be significantly faster because the proxy served your
request from its cache, rather than rerunning the AI provider's model. Under the
hood, your request is served from a [Cloudflare Worker] that caches your request
with end-to-end encryption.

[OpenAI SDK]: https://platform.openai.com/docs/libraries

[Cloudflare Worker]: https://workers.cloudflare.com/

## Key features

The proxy is a drop-in replacement for the OpenAI API, with a few killer features:

* Automatic caching of results, with configurable semantics
* Interopability with other providers, including a wide range of open source models
* API key management

The proxy also supports the Anthropic and Gemini APIs
for making requests to Anthropic and Gemini models.

### Caching

The proxy automatically caches results, and reuses them when possible. Because the proxy runs on the edge,
you can expect cached requests to be returned in under 100ms. This is especially useful when you're developing
and frequently re-running or evaluating the same prompts many times.

#### Cache modes

There are three caching modes: `auto` (default), `always`, `never`:

* In `auto` mode, requests are cached if they have `temperature=0` or the
  [`seed` parameter](https://cookbook.openai.com/examples/reproducible_outputs_with_the_seed_parameter) set and they are one of the supported paths.
* In `always` mode, requests are cached as long as they are one of the supported paths.
* In `never` mode, the cache is never read or written to.

The supported paths are:

* `/auto`
* `/embeddings`
* `/chat/completions`
* `/completions`
* `/moderations`

You can set the cache mode by passing the `x-bt-use-cache` header to your request.

#### Cache TTL

By default, cached results expire after 1 week. The TTL for individual requests can be set by passing the `x-bt-cache-ttl` header to your request. The TTL is specified in seconds and must be between 1 and 604800 (7 days).

#### Cache control

The proxy supports a limited set of [Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) directives:

* To bypass the cache, set the `Cache-Control` header to `no-cache, no-store`. Note that this is semantically equivalent to setting the `x-bt-use-cache` header to `never`.
* To force a fresh request, set the `Cache-Control` header to `no-cache`. Note that without the `no-store` directive the response will be cached for subsequent requests.
* To request a cached response with a maximum age, set the `Cache-Control` header to `max-age=<seconds>`. If the cached data is older than the specified age that the cache will be bypassed and a new response will be generated. Combine this with `no-store` to bypass the cache for a request without overwriting the currently cached response.

When cache control directives conflict with the `x-bt-use-cache` header, the cache control directives take precedence.

The proxy will return the `x-bt-cached` header in the response with `HIT` or `MISS` to indicate whether the response was served from the cache, the `Age` header to indicate the age of the cached response, and the `Cache-Control` header with the `max-age` directive to return the TTL/max age of the cached response.

For example, to set the cache mode to `always` with a TTL of 2 days,

<CodeTabs items={['TypeScript', 'Python', 'cURL']}>
  <TSTab>
    ```javascript
    import { OpenAI } from "openai";

    const client = new OpenAI({
      baseURL: "https://api.braintrust.dev/v1/proxy",
      defaultHeaders: {
        "x-bt-use-cache": "always",
        "Cache-Control": "max-age=172800",
      },
      apiKey: process.env.OPENAI_API_KEY, // Can use Braintrust, Anthropic, etc. API keys here
    });

    async function main() {
      const response = await client.chat.completions.create({
        model: "gpt-4o", // Can use claude-3-5-sonnet-latest, gemini-2.0-flash, etc. here
        messages: [{ role: "user", content: "What is a proxy?" }],
      });
      console.log(response.choices[0].message.content);
    }

    main();
    ```
  </TSTab>

  <PYTab>
    ```python
    import os

    from openai import OpenAI

    client = OpenAI(
        base_url="https://api.braintrust.dev/v1/proxy",
        default_headers={"x-bt-use-cache": "always", "Cache-Control": "max-age=1209600"},
        api_key=os.environ["OPENAI_API_KEY"],  # Can use Braintrust, Anthropic, etc. API keys here
    )

    response = client.chat.completions.create(
        model="gpt-4o",  # Can use claude-3-5-sonnet-latest, gemini-2.0-flash, etc. here
        messages=[{"role": "user", "content": "What is a proxy?"}],
    )
    print(response.choices[0].message.content)
    ```
  </PYTab>

  <CurlTab>
    ```bash
    time curl -i https://api.braintrust.dev/v1/proxy/chat/completions \
      -H "Content-Type: application/json" \
      -H "x-bt-use-cache: always" \
      -H "Cache-Control: max-age=1209600" \
      -d '{
        "model": "gpt-4o",
        "messages": [
          {
            "role": "user",
            "content": "What is a proxy?"
          }
        ]
      }' \
      -H "Authorization: Bearer $OPENAI_API_KEY" \
      --compress
    ```
  </CurlTab>
</CodeTabs>

#### Encryption

We use [AES-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode) to encrypt the cache, using a key derived from your
API key. Results are cached for 1 week unless otherwise specified in request headers.

This design ensures that the cache is only accessible to you, and that we cannot see your data. We also do not store
or log API keys.

<Callout type="info">
  Because the cache's encryption key is your API key, cached results are scoped
  to an individual user. However, Braintrust customers can opt-into sharing
  cached results across users within their organization.
</Callout>

### Tracing

To log requests that you make through the proxy, you can specify an `x-bt-parent` header with the project or
experiment you'd like to log to. While tracing, you must also use a `BRAINTRUST_API_KEY` rather than a provider's
key. Behind the scenes, the proxy will derive your provider's key and facilitate tracing using the `BRAINTRUST_API_KEY`.

For example,

<CodeTabs items={['TypeScript', 'Python', 'cURL']}>
  <TSTab>
    ```javascript
    import { OpenAI } from "openai";

    const client = new OpenAI({
      baseURL: "https://api.braintrust.dev/v1/proxy",
      defaultHeaders: {
        "x-bt-parent": "project_id:<YOUR PROJECT ID>",
      },
      apiKey: process.env.BRAINTRUST_API_KEY, // Must use Braintrust API key
    });

    async function main() {
      const response = await client.chat.completions.create({
        model: "gpt-4o", // Can use claude-3-5-sonnet-latest, gemini-2.0-flash, etc. here
        messages: [{ role: "user", content: "What is a proxy?" }],
      });
      console.log(response.choices[0].message.content);
    }

    main();
    ```
  </TSTab>

  <PYTab>
    ```python
    import os

    from openai import OpenAI

    client = OpenAI(
        base_url="https://api.braintrust.dev/v1/proxy",
        default_headers={"x-bt-parent": "project_id:<YOUR PROJECT ID>"},
        api_key=os.environ["BRAINTRUST_API_KEY"],  # Must use Braintrust API key
    )

    response = client.chat.completions.create(
        model="gpt-4o",  # Can use claude-3-5-sonnet-latest, gemini-2.0-flash, etc. here
        messages=[{"role": "user", "content": "What is a proxy?"}],
    )
    print(response.choices[0].message.content)
    ```
  </PYTab>

  <CurlTab>
    ```bash
    time curl -i https://api.braintrust.dev/v1/proxy/chat/completions \
      -H "Content-Type: application/json" \
      -H "x-bt-parent: project_id:<YOUR PROJECT ID>" \
      -d '{
        "model": "gpt-4o",
        "messages": [
          {
            "role": "user",
            "content": "What is a proxy?"
          }
        ]
      }' \
      -H "Authorization: Bearer $BRAINTRUST_API_KEY" \
      --compress
    ```
  </CurlTab>
</CodeTabs>

The `x-bt-parent` header sets the trace's parent project or experiment. You can use
a prefix like `project_id:`, `project_name:`, or `experiment_id:` here, or pass in
a [span slug](/docs/guides/tracing#distributed-tracing)
(`span.export()`) to nest the trace under a span within the parent object.

<Callout type="info">
  To find your project ID, navigate to your project's configuration page and find the **Copy Project ID** button at the bottom of the page.
</Callout>

### Supported models

The proxy supports over 100 models, including popular models like GPT-4o, Claude
3.5 Sonnet, Llama 2, and Gemini Pro. It also supports third-party inference
providers, including the [Azure OpenAI Service], [Amazon Bedrock], and
[Together AI]. See the [full list of models and providers](#appendix) at the
bottom of this page.

We are constantly adding new models. If you have a model you'd like to see
supported, please [let us know](mailto:support@braintrust.dev)!

[Azure OpenAI Service]: https://azure.microsoft.com/en-us/products/ai-services/openai-service

[Amazon Bedrock]: https://aws.amazon.com/bedrock/

[Together AI]: https://www.together.ai/

### Supported protocols

#### HTTP-based models

On the `/auto`, and `/chat/completions` endpoints,
the proxy receives HTTP requests in the [OpenAI API schema] and automatically
translates OpenAI requests into various providers' APIs. That means you can
interact with other providers like Anthropic by using OpenAI client libraries
and API calls.

For example,

```bash
curl -X POST https://api.braintrust.dev/v1/proxy/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $BRAINTRUST_API_KEY" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "What is a proxy?"}]
  }'
```

The proxy can also receive requests in the Anthropic and Gemini API schemas
for making requests to those respective models.

For example, you can make an Anthropic request with the following curl command:

```bash
curl -X POST https://api.braintrust.dev/v1/proxy/anthropic/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $BRAINTRUST_API_KEY" \
  -d '{
    "model": "claude-3-5-sonnet-20240620",
    "messages": [{"role": "user", "content": "What is a proxy?"}]
  }'
```

Note that the `anthropic-version` and `x-api-key` headers do not need to be set.

Similarly, you can make a Gemini request with the following curl command:

```bash
curl -X POST https://api.braintrust.dev/v1/proxy/google/models/gemini-2.0-flash:generateContent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $BRAINTRUST_API_KEY" \
  -d '{
    "contents": [
      {
        "role": "user",
        "parts": [
          {
            "text": "What is a proxy?"
          }
        ]
      }
    ]
  }'
```

[OpenAI API schema]: https://platform.openai.com/docs/api-reference/introduction

#### WebSocket-based models

The proxy supports the [OpenAI Realtime API][realtime-api-beta] at the
`/realtime` endpoint. To use the proxy with the [OpenAI Reference
Client][realtime-api-beta], set the `url` to
`https://braintrustproxy.com/v1/realtime` when constructing the
[`RealtimeClient`][realtime-client-class] or [`RealtimeAPI`][realtime-api-class]
classes:

<CodeTabs items={["TypeScript"]}>
  <TSTab>
    ```typescript
    import { RealtimeClient } from "@openai/realtime-api-beta";

    const client = new RealtimeClient({
      url: "https://braintrustproxy.com/v1/realtime",
      apiKey: process.env.OPENAI_API_KEY,
    });
    ```
  </TSTab>
</CodeTabs>

For developers trying out the [OpenAI Realtime Console] sample app, we maintain
a [fork] that demonstrates how to modify the sample code to use the proxy.

You can continue to use your OpenAI API key as usual if you are creating the
`RealtimeClient` in your backend. If you would like to run the `RealtimeClient`
in your frontend or in a mobile app, we recommend passing [temporary
credentials](#temporary-credentials-for-end-user-access) to your frontend to
avoid exposing your API key.

[realtime-api-beta]: https://github.com/openai/openai-realtime-api-beta

[realtime-client-class]: https://github.com/openai/openai-realtime-api-beta/blob/de01e1083834c4c3bc495d190e2f6f5b5785e264/lib/client.js

[realtime-api-class]: https://github.com/openai/openai-realtime-api-beta/blob/main/lib/api.js

[OpenAI Realtime Console]: https://github.com/openai/openai-realtime-console

[fork]: https://github.com/braintrustdata/openai-realtime-console/pull/1/files#diff-e6b2fd9b81ea8124e30e74c39a86f3f177c342beb485d375dc759f7274c64b27

### Authorization

The proxy allows you to use either a provider's API key or your Braintrust
API key.

If you use a provider's API key, you can use the proxy without a
Braintrust account to take advantage of low-latency edge caching (scoped to your
API key).

#### Using Braintrust API keys

If you use a Braintrust API key, you can access multiple model providers through
the proxy and manage all your API keys in one place. To do so,
[sign up for an account](/signup) and add each provider's API key on the
[AI providers](/app/settings?subroute=secrets) page in your settings. Then create
an [API key](/app/settings?subroute=api-keys) to use in your requests.

The proxy response will return the `x-bt-used-endpoint` header, which specifies
which of your configured providers was used to complete the request.

![Secret configuration](/blog/img/secret-config.png)

#### Custom models

If you have custom models as part of your OpenAI or other accounts, you can use
them with the proxy by adding a custom provider. For example, if you have a
custom model called `gpt-3.5-acme`, you can add it to your
[organization settings](/docs/reference/organizations#custom-ai-providers) by navigating to
**Settings** > **Organization** > **AI providers**:

<img src="/docs/custom-model.png" className="box-content" alt="Add provider dialog in Braintrust" />

Any headers you add to the configuration will be passed through in the request to the custom endpoint.
The values of the headers can also be templated using Mustache syntax.
Currently, the supported template variables are `{{email}}` and `{{model}}`.
which will be replaced with the email of the user whom the Braintrust API key belongs to and the model name, respectively.

If the endpoint is non-streaming, set the `Endpoint supports streaming` flag to false. The proxy will
convert the response to streaming format, allowing the models to work in the playground.

Each custom model must have a flavor (`chat` or `completion`) and format (`openai`, `anthropic`, `google`, `window` or `js`). Additionally, they can
optionally have a boolean flag if the model is multimodal and an input cost and output cost, which will only be used to calculate and display estimated
prices for experiment runs.

#### Specifying an org

If you are part of multiple organizations, you can specify which organization to use by passing the `x-bt-org-name`
header in the SDK:

<CodeTabs items={['TypeScript', 'Python', 'cURL']}>
  <TSTab>
    ```javascript
    import { OpenAI } from "openai";

    const client = new OpenAI({
      baseURL: "https://api.braintrust.dev/v1/proxy",
      defaultHeaders: {
        "x-bt-org-name": "Acme Inc",
      },
      apiKey: process.env.OPENAI_API_KEY, // Can use Braintrust, Anthropic, etc. API keys here
    });

    async function main() {
      const response = await client.chat.completions.create({
        model: "gpt-4o", // Can use claude-3-5-sonnet-latest, gemini-2.0-flash, etc. here
        messages: [{ role: "user", content: "What is a proxy?" }],
      });
      console.log(response.choices[0].message.content);
    }

    main();
    ```
  </TSTab>

  <PYTab>
    ```python
    import os

    from openai import OpenAI

    client = OpenAI(
        base_url="https://api.braintrust.dev/v1/proxy",
        default_headers={"x-bt-org-name": "Acme Inc"},
        api_key=os.environ["OPENAI_API_KEY"],  # Can use Braintrust, Anthropic, etc. API keys here
    )

    response = client.chat.completions.create(
        model="gpt-4o",  # Can use claude-3-5-sonnet-latest, gemini-2.0-flash, etc. here
        messages=[{"role": "user", "content": "What is a proxy?"}],
    )
    print(response.choices[0].message.content)
    ```
  </PYTab>

  <CurlTab>
    ```bash
    time curl -i https://api.braintrust.dev/v1/proxy/chat/completions \
      -H "Content-Type: application/json" \
      -H "x-bt-org-name: Acme Inc" \
      -d '{
        "model": "gpt-4o",
        "messages": [
          {
            "role": "user",
            "content": "What is a proxy?"
          }
        ]
      }' \
      -H "Authorization: Bearer $OPENAI_API_KEY" \
      --compress
    ```
  </CurlTab>
</CodeTabs>

### Temporary credentials for end user access

A **temporary credential** converts your Braintrust API key (or model provider
API key) to a time-limited credential that can be safely shared with end users.

* Temporary credentials can also carry additional information to limit access to
  a particular model and/or enable logging to Braintrust.
* They can be used in the `Authorization` header anywhere you'd use a Braintrust
  API key or a model provider API key.

Use temporary credentials if you'd like your frontend or mobile app to send AI
requests to the proxy directly, minimizing latency without exposing your API
keys to end users.

#### Issue temporary credential in code

You can call the [`/credentials` endpoint][cred-api-doc] from a privileged
location, such as your app's backend, to issue temporary credentials. The
temporary credential will be allowed to make requests on behalf of the
Braintrust API key (or model provider API key) provided in the `Authorization`
header.

The body should specify the restrictions to be applied to the temporary
credentials as a JSON object. Additionally, if the `logging` key is present, the
proxy will log to Braintrust any requests made with this temporary credential.
See the [`/credentials` API spec][cred-api-doc] for details.

The following example grants access to `gpt-4o-realtime-preview-2024-10-01` on
behalf of the key stored in the `BRAINTRUST_API_KEY` environment variable for 10
minutes, logging the requests to the project named "My project."

[cred-api-doc]: /docs/reference/api/Proxy#create-temporary-credential

<CodeTabs items={["TypeScript", "Python", "cURL"]}>
  <TSTab>
    ```typescript
    const PROXY_URL =
      process.env.BRAINTRUST_PROXY_URL || "https://braintrustproxy.com/v1";
    // Braintrust API key starting with `sk-...`.
    const BRAINTRUST_API_KEY = process.env.BRAINTRUST_API_KEY;

    async function main() {
      const response = await fetch(`${PROXY_URL}/credentials`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BRAINTRUST_API_KEY}`,
        },
        body: JSON.stringify({
          // Leave undefined to allow all models.
          model: "gpt-4o-realtime-preview-2024-10-01",
          // TTL for starting the request. Once started, the request can stream
          // for as long as needed.
          ttl_seconds: 60 * 10, // 10 minutes.
          logging: {
            project_name: "My project",
          },
        }),
        cache: "no-store",
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to request temporary credentials: ${error}`);
      }

      const { key: tempCredential } = await response.json();
      console.log(`Authorization: Bearer ${tempCredential}`);
    }

    main();
    ```
  </TSTab>

  <PYTab>
    ```python
    import os

    import requests

    PROXY_URL = os.getenv("BRAINTRUST_PROXY_URL", "https://braintrustproxy.com/v1")
    # Braintrust API key starting with `sk-...`.
    BRAINTRUST_API_KEY = os.getenv("BRAINTRUST_API_KEY")


    def main():
        response = requests.post(
            f"{PROXY_URL}/credentials",
            headers={
                "Authorization": f"Bearer {BRAINTRUST_API_KEY}",
            },
            json={
                # Leave unset to allow all models.
                "model": "gpt-4o-realtime-preview-2024-10-01",
                # TTL for starting the request. Once started, the request can stream
                # for as long as needed.
                "ttl_seconds": 60 * 10,  # 10 minutes.
                "logging": {
                    "project_name": "My project",
                },
            },
        )

        if response.status_code != 200:
            raise Exception(f"Failed to request temporary credentials: {response.text}")

        temp_credential = response.json().get("key")
        print(f"Authorization: Bearer {temp_credential}")


    if __name__ == "__main__":
        main()
    ```
  </PYTab>

  <CurlTab>
    ```bash
    curl -X POST "${BRAINTRUST_PROXY_URL:-https://api.braintrust.dev/v1/proxy}/credentials" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer ${BRAINTRUST_API_KEY}" \
      --data '{
        "model": "gpt-4o-realtime-preview-2024-10-01",
        "ttl_seconds": 600,
        "logging": {
          "project_name": "My project"
        }
      }'
    ```
  </CurlTab>
</CodeTabs>

#### Issue temporary credential in browser

You can also generate a temporary credential using the form below:

<TemporaryCredentialForm id="temp-cred-form" codeSampleDisplayMode="always" />

#### Inspect temporary credential grants

The temporary credential is formatted as a [JSON Web Token (JWT)][jwt-intro].
You can inspect the JWT's payload using a library such as
[`jsonwebtoken`][jwt-lib] or a web-based tool like [JWT.io](https://jwt.io/) to
determine the expiration time and granted models.

<CodeTabs items={["TypeScript"]}>
  <TSTab>
    ```typescript
    import { decode as jwtDecode } from "jsonwebtoken";

    const tempCredential = "<your temporary credential>";
    const payload = jwtDecode(tempCredential, { complete: false, json: true });
    // Example output:
    // {
    //   "aud": "braintrust_proxy",
    //   "bt": {
    //     "model": "gpt-4o",
    //     "secret": "nCCxgkBoyy/zyOJlikuHILBMoK78bHFosEzy03SjJF0=",
    //     "logging": {
    //       "project_name": "My project"
    //     }
    //   },
    //   "exp": 1729928077,
    //   "iat": 1729927977,
    //   "iss": "braintrust_proxy",
    //   "jti": "bt_tmp:331278af-937c-4f97-9d42-42c83631001a"
    // }
    console.log(JSON.stringify(payload, null, 2));
    ```
  </TSTab>
</CodeTabs>

<Callout type="info">
  Do not modify the JWT payload. This will invalidate the signature. Instead,
  issue a new temporary credential using the `/credentials` endpoint.
</Callout>

[jwt-intro]: https://jwt.io/introduction

[jwt-lib]: https://www.npmjs.com/package/jsonwebtoken

### Load balancing

If you have multiple API keys for a given model type, e.g. OpenAI and Azure for `gpt-4o`, the proxy will
automatically load balance across them. This is a useful way to work around per-account rate limits and provide
resiliency in case one provider is down.

You can setup endpoints directly on the [secrets page](/app/settings?subroute=secrets) in your Braintrust account
by adding endpoints:

![Configure secrets](/blog/img/secrets-endpoint-config.gif)

### PDF input

The proxy extends the OpenAI API to support PDF input.
To use it, pass the PDF's URL or base64-encoded PDF data with MIME type `application/pdf` in the request body.
For example,

```bash
curl https://api.braintrust.dev/v1/proxy/auto \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $BRAINTRUST_API_KEY" \
  -d '{
    "model": "gpt-4o",
    "messages": [
      {"role": "user", "content": [
        {
          "type": "text",
          "text": "Extract the text from the PDF."
        },
        {
          "type": "image_url",
          "image_url": {
            "url": "https://example.com/my-pdf.pdf"
          }
        }
      ]},
    ]
  }'
```

or

```bash
curl https://api.braintrust.dev/v1/proxy/auto \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $BRAINTRUST_API_KEY" \
  -d '{
    "model": "gpt-4o",
    "messages": [
      {"role": "user", "content": [
        {
          "type": "text",
          "text": "Extract the text from the PDF."
        },
        {
          "type": "image_url",
          "image_url": {
            "url": "data:application/pdf;base64,$PDF_BASE64_DATA"
          }
        }
      ]},
    ]
  }'
```

## Advanced configuration

The following headers allow you to configure the proxy's behavior:

* `x-bt-use-cache`: `auto | always | never`. See [Caching](#caching)
* `x-bt-use-creds-cache`: `auto | always | never`. Similar to `x-bt-use-cache`, but controls whether to cache the
  credentials used to access the provider's API. This is useful if you are rapidly tweaking credentials and don't
  want to wait \~60 seconds for the credentials cache to expire.
* `x-bt-org-name`: Specify if you are part of multiple organizations and want to use API keys/log to a specific org.
* `x-bt-endpoint-name`: Specify to use a particular endpoint (by its name).

## Integration with Braintrust platform

Several features in Braintrust are powered by the proxy. For example, when you create a [playground](/docs/guides/playground),
the proxy handles running the LLM calls. Similarly, if you [create a prompt](/docs/guides/prompts), when you preview the
prompt's results, the proxy is used to run the LLM. However, the proxy is *not* required when you:

* Run evals in your code
* Load prompts to run in your code
* Log traces to Braintrust

If you'd like to use it in your code to help with caching, secrets management, and other features, follow the [instructions
above](#quickstart) to set it as the base URL in your OpenAI client.

### Self-hosting

If you're self-hosting Braintrust, your API service (serverless functions or containers) contain a built-in proxy that runs
within your own environment. See the [self-hosting](/docs/guides/self-hosting) docs for more information on how to set up
self-hosting.

## Open source

The AI proxy is open source. You can find the code on
[GitHub](https://github.com/braintrustdata/braintrust-proxy).

<div className="nx-mt-2">
  <a className="github-button" href="https://github.com/braintrustdata/braintrust-proxy" data-icon="octicon-star" data-size="large" aria-label="Star braintrustdata/braintrust-proxy on GitHub">
    Give us a star!
  </a>
</div>

<Script async defer src="https://buttons.github.io/buttons.js" />

## Appendix

### List of supported models and providers

<SupportedModels />

We are constantly adding new models. If you have a model you'd like to see
supported, please [let us know](/contact)!

# Advanced topics related to self-hosting

This guide covers advanced topics related to self-hosting.

## Data plane vs. control plane

Braintrust's architecture has two main components: the data plane and the control plane. The data plane
is the component that handles the actual data, while the control plane is the component that serves the UI
along with metadata.

## Data storage

Braintrust self-hosting splits data into a data plane and a control plane. We often refer to this as "hybrid"
self-hosting. When you deploy Braintrust in hybrid mode, you host the data plane (API) in your own environment,
while the control plane (web app and metadata database) is hosted by Braintrust.

To clarify which data is stored in which location, here is a breakdown of the data stored in each place:

| Data                                                                          | Location                    |
| ----------------------------------------------------------------------------- | --------------------------- |
| Experiment records (input, output, expected, scores, metadata, traces, spans) | Data plane                  |
| Log records (input, output, expected, scores, metadata, traces, spans)        | Data plane                  |
| Dataset records (input, output, metadata)                                     | Data plane                  |
| Prompt playground prompts                                                     | Data plane                  |
| Prompt playground completions                                                 | Data plane                  |
| Human review scores                                                           | Data plane                  |
| Experiment and dataset names                                                  | Control plane               |
| Project names                                                                 | Control plane               |
| Project settings                                                              | Control plane               |
| Git metadata about experiments                                                | Control plane               |
| Organization info (name, settings)                                            | Control plane               |
| Login info (name, email, avatar URL)                                          | Control plane               |
| Auth credentials                                                              | [Clerk](https://clerk.com/) |
| API keys (hashed)                                                             | Control plane               |
| LLM provider secrets (encrypted)                                              | Control plane               |

## Securing sensitive customer data

Braintrust's servers and employees *do not* require access to your data plane for it to operate successfully. That means that you can
protect it behind a firewall/VPN and physically isolate it from access. When you use the Braintrust web application, it communicates
directly with the data plane (via CORS), and the data does not flow through any intermediate systems (the control plane, or otherwise)
before reaching your browser. The data plane is also configured by default *not* to send any telemetry back to the control plane. Because of this
architecture, our self-hosted customers do not generally list us as a subprocessor.

Like any third-party software, it is important that you establish the appropriate controls to ensure that your deployment is secure, and we're
very happy to help you do so. Ultimately, the goal of the control plane and data plane split is to provide you with the highest levels of security
and compliance.

## Telemetry

By default, the Braintrust API server does not send any telemetry to the control plane; however, you should be aware of the following:

* There are a few endpoints that Braintrust's engineering team can access to debug issues and monitor system health. Specifically, the `/brainstore/backfill/*` endpoints
  which report system metrics about the backfill and compaction status of Brainstore segments. Note that these endpoints do not access or expose any data, just
  metadata from Brainstore. You can disable these endpoints by setting the `DISABLE_SYSADMIN_TELEMETRY` environment variable to `true`.
* There is an optional, `TELEMETRY_ENABLED` flag which sends billing and usage data to Braintrust. This is disabled by default, but it may be required
  depending on your contract with Braintrust. It may default to enabled in the future.

## Customizing the webapp URL

The SDKs guide users to `https://www.braintrust.dev` (or the `BRAINTRUST_APP_URL` variable) to view their experiments. However,
in certain advanced configurations, you may want to reverse proxy traffic to the `BRAINTRUST_APP_URL` from the SDKs while pointing users
to a different URL.

To do this, you can set the `BRAINTRUST_APP_PUBLIC_URL` environment variable to the URL of your webapp. By default, this variable is set to
the value of `BRAINTRUST_APP_URL`, but you can customize it as you wish. This variable is *only* used to display information, so even its destination
does not need to be accessible from the SDK.

## Constraining SDK to the data plane

If you're self-hosting the data plane, it may also be advantageous to constrain the SDKs to only communicate with your data plane. Normally, they
communicate with the control plane to:

* Get your data plane's URL
* Register and retrieve metadata (e.g. about experiments)
* Print URLs to the webapp

The data plane can proxy the endpoints that the SDKs use to communicate with the control plane, allowing your SDKs to only communicate with the data plane
directly. Simply set the `BRAINTRUST_APP_URL` environment variable to the URL of your data plane and `BRAINTRUST_APP_PUBLIC_URL` to "[https://www.braintrust.dev](https://www.braintrust.dev)"
(or the URL of your webapp).

## Allow-list URLs

In some cases, you may want to restrict the URLs that the SDKs or API server can communicate with. If so, you should
include the following URLs:

```
www.braintrust.dev
braintrust.dev
```

## Configuring rate limits

By default, the Braintrust API server imposes rate limits against any external
domains it reaches out to, such as the `BRAINTRUST_APP_URL`. The purpose of
rate-limiting is to prevent unintentionally overloading any external domains,
which may block the API server IP in response.

By default, the rate limit is 100 requests per minute per user auth token. The
API server exposes the following variables to configure the rate limits:

* `OUTBOUND_RATE_LIMIT_MAX_REQUESTS`: Configure the number of requests per time
  window. This can be set to 0 to disable rate limiting. In the [braintrust
  CLI](/docs/guides/self-hosting/aws#using-the-braintrust-cli), this variable can
  be set with the `--outbound-rate-limit-max-requests` flag, or the
  `OutboundRateLimitMaxRequests` CloudFormation template parameter.
* `OUTBOUND_RATE_LIMIT_WINDOW_MINUTES`: Configure the time window in minutes
  before the rate limit resets. In the [braintrust
  CLI](/docs/guides/self-hosting/aws#using-the-braintrust-cli), this variable can
  be set with the `--outbound-rate-limit-window-minutes` flag, or the
  `OutboundRateLimitWindowMinutes` CloudFormation template parameter.

## Data residency (EU and others)

In the Hybrid (API) deployment:

* All customer data lives wherever you choose to host the data plane.
* All prompts are run on the data plane and in your region of choice.
* If you log a customer's data to Braintrust, it will only touch the servers in your data plane.
* You have API-level and even database-level control to purge customer data to comply with regulations like GDPR.
* Braintrust user info (e.g. your employees who sign into the Braintrust web application) is hosted globally by us, in the US.
  However, if you need this data to be hosted in your region, reach out to us and we can figure something out.

## Audit headers

When integrating with Braintrust,
especially in environments where actions need to be attributed
to specific users or for compliance purposes,
you might want to enable audit headers.
These headers provide additional metadata about the request and the resources it touched.

To enable audit headers, include the `x-bt-enable-audit: true` header in your API request.
When this header is present, the API response will include the following additional headers:

* `x-bt-audit-user-id`: The ID of the user who made the request
  (based on the provided API key or impersonation).
* `x-bt-audit-user-email`: The email of the user who made the request.
* `x-bt-audit-normalized-url`: A normalized representation of the API endpoint path that was called.
  Path parameters like object IDs are replaced with placeholders (for example, `/v1/project/[id]`).
* `x-bt-audit-resources`: A JSON-encoded, gzipped, and base64-encoded string
  containing a list of Braintrust resources (like projects, experiments, datasets, etc.)
  that were accessed or modified by the request.
  Each resource object includes its `type`, `id`, and `name`.

The `x-bt-audit-resources` header requires specific parsing due to its encoding.
Here's an example of how to parse it using the Python SDK:

```py
import os

import braintrust
import requests

API_URL = "https://api.braintrust.dev/v1"
# Ensure BRAINTRUST_API_KEY is set in your environment.
headers = {
    "Authorization": "Bearer " + os.environ["BRAINTRUST_API_KEY"],
    "x-bt-enable-audit": "true",  # Enable audit headers
}

# Example: Create a project.
response = requests.post(f"{API_URL}/project", headers=headers, json={"name": "audit-test-project"})
response.raise_for_status()

project_data = response.json()
print(f"Project created: {project_data['name']} (ID: {project_data['id']})")

# Access and parse audit headers.
user_id = response.headers.get("x-bt-audit-user-id")
user_email = response.headers.get("x-bt-audit-user-email")
normalized_url = response.headers.get("x-bt-audit-normalized-url")
resources_header = response.headers.get("x-bt-audit-resources")

print(f"Audit User ID: {user_id}")
print(f"Audit User Email: {user_email}")
print(f"Normalized URL: {normalized_url}")

if resources_header:
    try:
        # Use the provided utility to parse the resources header.
        resources = braintrust.parse_audit_resources(resources_header)
        print("Accessed/Modified Resources:")
        for resource in resources:
            print(f"  - Type: {resource['type']}, ID: {resource['id']}, Name: {resource['name']}")
    except Exception as e:
        print(f"Error parsing resources header: {e}")
else:
    print("No resources header found.")
```

This feature is useful for building audit logs or understanding resource usage patterns within your applications that interact with the Braintrust API.

# API walkthrough

The Braintrust REST API is available via an OpenAPI spec published at
[https://github.com/braintrustdata/braintrust-openapi](https://github.com/braintrustdata/braintrust-openapi).
This guide walks through a few common use cases, and should help you get started
with using the API. Each example is implemented in a particular language, for
legibility, but the API itself is language-agnostic.

To learn more about the API, see the full [API spec](/docs/api/spec). If you are
looking for a language-specific wrapper over the bare REST API, we support
several different [languages](/docs/reference/api#api-wrappers).

## Running an experiment

```python #skip-test #foo
import os
from uuid import uuid4

import requests

API_URL = "https://api.braintrust.dev/v1"
headers = {"Authorization": "Bearer " + os.environ["BRAINTRUST_API_KEY"]}

if __name__ == "__main__":
    # Create a project, if it does not already exist
    project = requests.post(f"{API_URL}/project", headers=headers, json={"name": "rest_test"}).json()
    print(project)

    # Create an experiment. This should always be new
    experiment = requests.post(
        f"{API_URL}/experiment", headers=headers, json={"name": "rest_test", "project_id": project["id"]}
    ).json()
    print(experiment)

    # Log some stuff
    for i in range(10):
        resp = requests.post(
            f"{API_URL}/experiment/{experiment['id']}/insert",
            headers=headers,
            json={"events": [{"id": uuid4().hex, "input": 1, "output": 2, "scores": {"accuracy": 0.5}}]},
        )
        if not resp.ok:
            raise Exception(f"Error: {resp.status_code} {resp.text}: {resp.content}")
```

## Fetching experiment results

Let's say you have a [human review](/docs/guides/human-review) workflow and you want to determine if an experiment
has been fully reviewed. You can do this by running a [Braintrust query language (BTQL)](/docs/reference/btql) query:

```sql
from: experiment('<experiment_id>')
measures: sum("My review score" IS NOT NULL) AS reviewed, count(1) AS total
filter: is_root -- Only count traces, not spans
```

To do this in Python, you can use the `btql` endpoint:

```python
import os

import requests

API_URL = "https://api.braintrust.dev/"
headers = {"Authorization": "Bearer " + os.environ["BRAINTRUST_API_KEY"]}


def make_query(experiment_id: str) -> str:
    # Replace "response quality" with the name of your review score column
    return f"""
from: experiment('{experiment_id}')
measures: sum(scores."response quality" IS NOT NULL) AS reviewed, sum(is_root) AS total
"""


def fetch_experiment_review_status(experiment_id: str) -> dict:
    return requests.post(
        f"{API_URL}/btql",
        headers=headers,
        json={"query": make_query(experiment_id), "fmt": "json"},
    ).json()


EXPERIMENT_ID = "bdec1c5e-8c00-4033-84f0-4e3aa522ecaf"  # Replace with your experiment ID
print(fetch_experiment_review_status(EXPERIMENT_ID))
```

## Paginating a large dataset

```typescript
// If you're self-hosting Braintrust, then use your stack's Universal API URL, e.g.
//   https://dfwhllz61x709.cloudfront.net
export const BRAINTRUST_API_URL = "https://api.braintrust.dev";
export const API_KEY = process.env.BRAINTRUST_API_KEY;

export async function* paginateDataset(args: {
  project: string;
  dataset: string;
  version?: string;
  // Number of rows to fetch per request. You can adjust this to be a lower number
  // if your rows are very large (e.g. several MB each).
  perRequestLimit?: number;
}) {
  const { project, dataset, version, perRequestLimit } = args;
  const headers = {
    Accept: "application/json",
    "Accept-Encoding": "gzip",
    Authorization: `Bearer ${API_KEY}`,
  };
  const fullURL = `${BRAINTRUST_API_URL}/v1/dataset?project_name=${encodeURIComponent(
    project,
  )}&dataset_name=${encodeURIComponent(dataset)}`;
  const ds = await fetch(fullURL, {
    method: "GET",
    headers,
  });
  if (!ds.ok) {
    throw new Error(
      `Error fetching dataset metadata: ${ds.status}: ${await ds.text()}`,
    );
  }
  const dsJSON = await ds.json();
  const dsMetadata = dsJSON.objects[0];
  if (!dsMetadata?.id) {
    throw new Error(`Dataset not found: ${project}/${dataset}`);
  }

  let cursor: string | null = null;
  while (true) {
    const body: string = JSON.stringify({
      query: {
        from: {
          op: "function",
          name: { op: "ident", name: ["dataset"] },
          args: [{ op: "literal", value: dsMetadata.id }],
        },
        select: [{ op: "star" }],
        limit: perRequestLimit,
        cursor,
      },
      fmt: "jsonl",
      version,
    });
    const response = await fetch(`${BRAINTRUST_API_URL}/btql`, {
      method: "POST",
      headers,
      body,
    });
    if (!response.ok) {
      throw new Error(
        `Error fetching rows for ${dataset}: ${
          response.status
        }: ${await response.text()}`,
      );
    }

    cursor =
      response.headers.get("x-bt-cursor") ??
      response.headers.get("x-amz-meta-bt-cursor");

    // Parse jsonl line-by-line
    const allRows = await response.text();
    const rows = allRows.split("\n");
    let rowCount = 0;
    for (const row of rows) {
      if (!row.trim()) {
        continue;
      }
      yield JSON.parse(row);
      rowCount++;
    }

    if (rowCount === 0) {
      break;
    }
  }
}

async function main() {
  for await (const row of paginateDataset({
    project: "Your project name", // Replace with your project name
    dataset: "Your dataset name", // Replace with your dataset name
    perRequestLimit: 100,
  })) {
    console.log(row);
  }
}

main();
```

## Deleting logs

To delete logs, you have to issue log requests with the `_object_delete` flag set to `true`.
For example, to find all logs matching a specific criteria, and then delete them, you can
run a script like the following:

```python
import argparse
import os
from uuid import uuid4

import requests

# Make sure to replace this with your stack's Universal API URL if you are self-hosting
API_URL = "https://api.braintrust.dev/"
headers = {"Authorization": "Bearer " + os.environ["BRAINTRUST_API_KEY"]}


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--project-id", type=str, required=True)
    # Update this logic to match the rows you'd like to delete
    parser.add_argument("--user-id", type=str, required=True)
    args = parser.parse_args()

    # Find all rows matching a certain metadata value.
    query = f"""
    select: id
    from: project_logs('{args.project_id}') traces
    filter: metadata.user_id = '{args.user_id}'
    """

    response = requests.post(f"{API_URL}/btql", headers=headers, json={"query": query}).json()
    ids = [x["id"] for x in response["data"]]
    print("Deleting", len(ids), "rows")

    delete_requests = [{"id": id, "_object_delete": True} for id in ids]
    response = requests.post(
        f"{API_URL}/v1/project_logs/{args.project_id}/insert", headers=headers, json={"events": delete_requests}
    ).json()
    row_ids = response["row_ids"]
    print("Deleted", len(row_ids), "rows")
```

## Impersonating a user for a request

User impersonation allows a privileged user to perform an operation on behalf of
another user, using the impersonated user's identity and permissions. For
example, a proxy service may wish to forward requests coming in from individual
users to Braintrust without requiring each user to directly specify Braintrust
credentials. The privileged service can initiate the request with its own
credentials and impersonate the user so that Braintrust runs the operation with
the user's permissions.

To this end, all API requests accept a header `x-bt-impersonate-user`, which you
can set to the ID or email of the user to impersonate. Currently impersonating
another user requires that the requesting user has specifically been granted the
`owner` role over all organizations that the impersonated user belongs to. This
check guarantees the requesting user has at least the set of permissions that
the impersonated user has.

Consider the following code example for configuring ACLs and running a request
with user impersonation.

<CodeTabs>
  <TSTab>
    ```javascript
    // If you're self-hosting Braintrust, then use your stack's Universal API URL, e.g.
    //   https://dfwhllz61x709.cloudfront.net
    export const BRAINTRUST_API_URL = "https://api.braintrust.dev";
    export const API_KEY = process.env.BRAINTRUST_API_KEY;

    async function getOwnerRoleId() {
      const roleResp = await fetch(
        `${BRAINTRUST_API_URL}/v1/role?${new URLSearchParams({ role_name: "owner" })}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        },
      );
      if (!roleResp.ok) {
        throw new Error(await roleResp.text());
      }
      const roles = await roleResp.json();
      return roles.objects[0].id;
    }

    async function getUserOrgInfo(orgName: string): Promise<{
      user_id: string;
      org_id: string;
    }> {
      const meResp = await fetch(`${BRAINTRUST_API_URL}/api/self/me`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      });
      if (!meResp.ok) {
        throw new Error(await meResp.text());
      }
      const meInfo = await meResp.json();
      const orgInfo = meInfo.organizations.find(
        (x: { name: string }) => x.name === orgName,
      );
      if (!orgInfo) {
        throw new Error(`No organization found with name ${orgName}`);
      }
      return { user_id: meInfo.id, org_id: orgInfo.id };
    }

    async function grantOwnershipRole(orgName: string) {
      const ownerRoleId = await getOwnerRoleId();
      const { user_id, org_id } = await getUserOrgInfo(orgName);

      // Grant an 'owner' ACL to the requesting user on the organization. Granting
      // this ACL requires the user to have `create_acls` permission on the org, which
      // means they must already be an owner of the org indirectly.
      const aclResp = await fetch(`${BRAINTRUST_API_URL}/v1/acl`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          object_type: "organization",
          object_id: org_id,
          user_id,
          role_id: ownerRoleId,
        }),
      });
      if (!aclResp.ok) {
        throw new Error(await aclResp.text());
      }
    }

    async function main() {
      if (!process.env.ORG_NAME || !process.env.USER_EMAIL) {
        throw new Error("Must specify ORG_NAME and USER_EMAIL");
      }

      // This only needs to be done once.
      await grantOwnershipRole(process.env.ORG_NAME);

      // This will only succeed if the user being impersonated has permissions to
      // create a project within the org.
      const projectResp = await fetch(`${BRAINTRUST_API_URL}/v1/project`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "x-bt-impersonate-user": process.env.USER_EMAIL,
        },
        body: JSON.stringify({
          name: "my-project",
          org_name: process.env.ORG_NAME,
        }),
      });
      if (!projectResp.ok) {
        throw new Error(await projectResp.text());
      }
      console.log(await projectResp.json());
    }

    main();
    ```
  </TSTab>

  <PYTab>
    ```python
    import os

    import requests

    # If you're self-hosting Braintrust, then use your stack's Universal API URL, e.g.
    # https://dfwhllz61x709.cloudfront.net
    BRAINTRUST_API_URL = "https://api.braintrust.dev"
    API_KEY = os.environ["BRAINTRUST_API_KEY"]


    def get_owner_role_id():
        resp = requests.get(
            f"{BRAINTRUST_API_URL}/v1/role",
            headers={"Authorization": f"Bearer {API_KEY}"},
            params=dict(role_name="owner"),
        )
        resp.raise_for_status()
        return resp.json()["objects"][0]["id"]


    def get_user_org_info(org_name):
        resp = requests.post(
            f"{BRAINTRUST_API_URL}/self/me",
            headers={"Authorization": f"Bearer {API_KEY}"},
        )
        resp.raise_for_status()
        me_info = resp.json()
        org_info = [x for x in me_info["organizations"] if x["name"] == org_name]
        if not org_info:
            raise Exception(f"No organization found with name {org_name}")
        return dict(user_id=me_info["id"], org_id=org_info["id"])


    def grant_ownership_role(org_name):
        owner_role_id = get_owner_role_id()
        user_org_info = get_user_org_info(org_name)

        # Grant an 'owner' ACL to the requesting user on the organization. Granting
        # this ACL requires the user to have `create_acls` permission on the org,
        # which means they must already be an owner of the org indirectly.
        resp = requests.post(
            f"{BRAINTRUST_API_URL}/v1/acl",
            headers={"Authorization": f"Bearer {API_KEY}"},
            body=dict(
                object_type="organization",
                object_id=user_org_info["org_id"],
                user_id=user_org_info["user_id"],
                role_id=owner_role_id,
            ),
        )
        resp.raise_for_status()


    def main():
        # This only needs to be done once.
        grant_ownership_role(os.environ["ORG_NAME"])

        # This will only succeed if the user being impersonated has permissions to
        # create a project within the org.
        resp = requests.post(
            f"{BRAINTRUST_API_URL}/v1/project",
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "x-bt-impersonate-user": os.environ["USER_EMAIL"],
            },
            json=dict(
                name="my-project",
                org_name=os.environ["ORG_NAME"],
            ),
        )
        resp.raise_for_status()
        print(resp.json())
    ```
  </PYTab>
</CodeTabs>

## Postman

[Postman](https://www.postman.com/) is a popular tool for interacting with HTTP APIs. You can
load Braintrust's API spec into Postman by simply importing the OpenAPI spec's URL

```
https://raw.githubusercontent.com/braintrustdata/braintrust-openapi/main/openapi/spec.json
```

![Postman](./api/postman.gif)

## Tracing with the REST API SDKs

In this section, we demonstrate the basics of logging with tracing using the
language-specific REST API SDKs. The end result of running each example should
be a single log entry in a project called `tracing_test`, which looks like the
following:

![Tracing Test Screenshot](/docs/tracing-test-example.png)

<CodeTabs items={["Go"]}>
  <GoTab>
    ```go
    package main

    import (
    	"context"
    	"github.com/braintrustdata/braintrust-go"
    	"github.com/braintrustdata/braintrust-go/shared"
    	"github.com/google/uuid"
    	"time"
    )

    type LLMInteraction struct {
    	input  interface{}
    	output interface{}
    }

    func runInteraction0(input interface{}) LLMInteraction {
    	return LLMInteraction{
    		input:  input,
    		output: "output0",
    	}
    }

    func runInteraction1(input interface{}) LLMInteraction {
    	return LLMInteraction{
    		input:  input,
    		output: "output1",
    	}
    }

    func getCurrentTime() float64 {
    	return float64(time.Now().UnixMilli()) / 1000.
    }

    func main() {
    	client := braintrust.NewClient()

    	// Create a project, if it does not already exist
    	project, err := client.Projects.New(context.TODO(), braintrust.ProjectNewParams{
    		Name: braintrust.F("tracing_test"),
    	})
    	if err != nil {
    		panic(err)
    	}

    	rootSpanId := uuid.NewString()
    	client.Projects.Logs.Insert(
    		context.TODO(),
    		project.ID,
    		braintrust.ProjectLogInsertParams{
    			Events: braintrust.F([]braintrust.ProjectLogInsertParamsEventUnion{
    				shared.InsertProjectLogsEventReplaceParam{
    					ID: braintrust.F(rootSpanId),
    					Metadata: braintrust.F(map[string]interface{}{
    						"user_id": "user123",
    					}),
    					SpanAttributes: braintrust.F(braintrust.InsertProjectLogsEventReplaceSpanAttributesParam{
    						Name: braintrust.F("User Interaction"),
    					}),
    					Metrics: braintrust.F(braintrust.InsertProjectLogsEventReplaceMetricsParam{
    						Start: braintrust.F(getCurrentTime()),
    					}),
    				},
    			}),
    		},
    	)

    	interaction0Id := uuid.NewString()
    	client.Projects.Logs.Insert(
    		context.TODO(),
    		project.ID,
    		braintrust.ProjectLogInsertParams{
    			Events: braintrust.F([]braintrust.ProjectLogInsertParamsEventUnion{
    				shared.InsertProjectLogsEventReplaceParam{
    					ID:       braintrust.F(interaction0Id),
    					ParentID: braintrust.F(rootSpanId),
    					SpanAttributes: braintrust.F(braintrust.InsertProjectLogsEventReplaceSpanAttributesParam{
    						Name: braintrust.F("Interaction 0"),
    					}),
    					Metrics: braintrust.F(braintrust.InsertProjectLogsEventReplaceMetricsParam{
    						Start: braintrust.F(getCurrentTime()),
    					}),
    				},
    			}),
    		},
    	)
    	interaction0 := runInteraction0("hello world")
    	client.Projects.Logs.Insert(
    		context.TODO(),
    		project.ID,
    		braintrust.ProjectLogInsertParams{
    			Events: braintrust.F([]braintrust.ProjectLogInsertParamsEventUnion{
    				braintrust.InsertProjectLogsEventMergeParam{
    					ID:      braintrust.F(interaction0Id),
    					IsMerge: braintrust.F(true),
    					Input:   braintrust.F(interaction0.input),
    					Output:  braintrust.F(interaction0.output),
    					Metrics: braintrust.F(braintrust.InsertProjectLogsEventMergeMetricsParam{
    						End: braintrust.F(getCurrentTime()),
    					}),
    				},
    			}),
    		},
    	)

    	interaction1Id := uuid.NewString()
    	client.Projects.Logs.Insert(
    		context.TODO(),
    		project.ID,
    		braintrust.ProjectLogInsertParams{
    			Events: braintrust.F([]braintrust.ProjectLogInsertParamsEventUnion{
    				braintrust.InsertProjectLogsEventReplaceParam{
    					ID:       braintrust.F(interaction1Id),
    					ParentID: braintrust.F(rootSpanId),
    					SpanAttributes: braintrust.F(braintrust.InsertProjectLogsEventReplaceSpanAttributesParam{
    						Name: braintrust.F("Interaction 1"),
    					}),
    					Metrics: braintrust.F(braintrust.InsertProjectLogsEventReplaceMetricsParam{
    						Start: braintrust.F(getCurrentTime()),
    					}),
    				},
    			}),
    		},
    	)
    	interaction1 := runInteraction1(interaction0.output)
    	client.Projects.Logs.Insert(
    		context.TODO(),
    		project.ID,
    		braintrust.ProjectLogInsertParams{
    			Events: braintrust.F([]braintrust.ProjectLogInsertParamsEventUnion{
    				braintrust.InsertProjectLogsEventMergeParam{
    					ID:      braintrust.F(interaction1Id),
    					IsMerge: braintrust.F(true),
    					Input:   braintrust.F(interaction1.input),
    					Output:  braintrust.F(interaction1.output),
    					Metrics: braintrust.F(braintrust.InsertProjectLogsEventMergeMetricsParam{
    						End: braintrust.F(getCurrentTime()),
    					}),
    				},
    			}),
    		},
    	)

    	client.Projects.Logs.Insert(
    		context.TODO(),
    		project.ID,
    		braintrust.ProjectLogInsertParams{
    			Events: braintrust.F([]braintrust.ProjectLogInsertParamsEventUnion{
    				braintrust.InsertProjectLogsEventMergeParam{
    					ID:      braintrust.F(rootSpanId),
    					IsMerge: braintrust.F(true),
    					Input:   braintrust.F(interaction0.input),
    					Output:  braintrust.F(interaction1.output),
    					Metrics: braintrust.F(braintrust.InsertProjectLogsEventMergeMetricsParam{
    						End: braintrust.F(getCurrentTime()),
    					}),
    				},
    			}),
    		},
    	)
    }
    ```
  </GoTab>
</CodeTabs>

