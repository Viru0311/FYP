# How to run:
# pass 13 arguments:
# i.e. python3 run.py 51 1 2 110 175 0 1 123 0 0.6 2 0 2

import pickle
from joblib import load
import sys

agrs = sys.argv
agrs.pop(0)
agrs=[float(str) for str in agrs]

# load the standard scaler params from disk
sc = load('./ml_model/std_scaler.bin')

# load the model from disk
loaded_model = pickle.load(open('./ml_model/ensemble_model.pkl', 'rb'))

a = [agrs]
x_train = sc.transform(a)

print(loaded_model.predict(x_train)[0])