import json
import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import curve_fit  # Make sure to import curve_fit

# Open and read the JSON file
with open('output_aberchel.json', 'r') as file:
    data = json.load(file)

# xArr = []
# yArr = []

# for entry in data:
#   xArr.append(entry['varNum'])
#   yArr.append(entry['time'])

for entry in data:
  X = np.array([entry['varNum']])
  Y = np.array([entry['time']])
  if entry['R'] == False:
    color = "#ff0000"
  else:
    color = "#008000"
  plt.scatter(X,Y, color=color)


plt.xlabel("Number of Variables")
plt.ylabel("Evaluation Time")

# Show legend with correct labels
plt.legend(['Satisfiable CNF', 'Unsatisfiable CNF'])
plt.show()