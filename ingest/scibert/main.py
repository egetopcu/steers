from transformers import *

tokenizer = AutoTokenizer.from_pretrained('allenai/scibert_scivocab_uncased')
model = AutoModel.from_pretrained('allenai/scibert_scivocab_uncased')

input = tokenizer("Automated feedback on hypotheses")
output = model(**input)

print(output)