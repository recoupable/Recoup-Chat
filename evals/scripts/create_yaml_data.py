import os

CURRENT_DIR = os.path.dirname(__file__)
REGISTRY_PATH = os.path.join(CURRENT_DIR, "../registry")

def create_yaml(yaml_name, criteria):
    yaml_file_path = os.path.join(REGISTRY_PATH, f"evals/{yaml_name}.yaml")  # Use yaml_name here
    data_dir = os.path.join(REGISTRY_PATH, f"data/{yaml_name}")  # Use yaml_name here

    os.makedirs(os.path.dirname(yaml_file_path), exist_ok=True)
    os.makedirs(data_dir, exist_ok=True)

    with open(yaml_file_path, "w") as yf:
        yf.write(f"""
{yaml_name}:
  id: {yaml_name}.dev.v0
  description: Evaluates the model's ability to analyze music streaming and fan engagement data, including metrics like premium vs free subscribers, playlist engagement, artist performance, and listener behavior across different streaming platforms.
  metrics: [accuracy]
{yaml_name}.dev.v0:
  class: evals.elsuite.modelgraded.classify:ModelBasedClassify
  args:
    samples_jsonl: {yaml_name}/samples.jsonl
    eval_type: cot_classify
    modelgraded_spec: closedqa
    modelgraded_spec_args:
      criteria: "correctness: {criteria}"
        """.strip())

def create_data(data_name, data_content):
  data_dir = os.path.join(REGISTRY_PATH, f"data/{data_name}")
  file_name = os.path.join(data_dir, f"samples.jsonl")

  with open(file_name, "w") as f:
    f.write(data_content)