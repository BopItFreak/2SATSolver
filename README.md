1	Team Name: aberchel
2	Team members names and netids: August Berchelmann, netid: aberchel
3	Overall project attempted, with sub-projects: 2SAT Solver
4	Overall success of the project: Very Successful
5	Approximately total time (in hours) to complete: 5
6	Link to github repository: https://github.com/BopItFreak/2SATSolver
7	List of included files (if you have many files of a certain type, such as test files of different sizes, list just the folder): (Add more rows as necessary). Add more rows as necessary.

File/folder Name	File Contents and Use

Code Files
2SATSolver_aberchel.js                      2SAT Solver containing the DPLL algorithm
	
Test Files
check_aberchel.csv                             Contains verified test cases
	
Output Files
output_aberchel.json                  Contains the output of data_aberchel.csv                    processed through 2SATSolver_aberchel.js
	
Plots (as needed)
plot_aberchel.png                                 plot of the points with the x as number of variables and y as execution time
	

8	Programming languages used, and associated libraries: JavaScript (using fast-csv library), python (using matplotlib library)
9	Key data structures (for each sub-project): the sats array contains all the sats imported from the data_aberchel.csv data file.
10	General operation of code (for each subproject)
The code contains many different functions which the main DPLLExec function uses.

11	What test cases you used/added, why you used them, what did they tell you about the correctness of your code.
I used check_aberchel.csv to check my code. It’s the first 10 cases of the data_aberchel.csv file, but verified manually by me using an online SAT solver.

12	How you managed the code development
I put different tasks in different functions to efficiently organize my code. I developed this code over two days.

13	Detailed discussion of results: The output_aberchel.csv contains my results. It includes an JSON object containing the Satisfiability/Unsatisfiability, the number of variables, the execution time, and the number of clauses for each SAT in the data_aberchel.csv file.
The plot clearly shows the exponential relation between adding more variables and execution time.

14	How team was organized 
I did the entire project

15	What you might do differently if you did the project again
I would probably try to research the algorithm a little better before starting to write code, as I kind of figured it out as I went which was inefficient. 

16	Any additional material:
