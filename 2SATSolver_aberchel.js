const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
let SATCSV = [];
let sats = [];
let index = -1;

function unitPropagate(clause, expression) {
  let varToRemove = clause[0];
  //remove clauses with variable
  expression = expression.filter(i => !i.includes(varToRemove));
  //put opposite of that variable in all clauses
  expression = expression.map(i => i.map(c => c == -varToRemove ? false : c));
  // remove true empty clauses
  expression = expression.filter(i => i.length != 0);
  return expression;
}

// checks if the clause is a unit clause
function isUnitClause(clause) {
  if (clause[0] === clause[1]) {
    return true;
  } else {
    return false;
  }
}

// checks if there is a unit clause in the expression
function unitClauseInExpression(expression) {
  for (clause of expression) {
    if ((clause[0] === clause[1]) && ((typeof(clause[0]) != 'boolean') && (typeof(clause[1] != 'boolean')))) {
      return true;
    }
  }
  return false;
}

// checks if there is a pure literal in the expression
function pureLiteralInExpression(expression) {
  let allLiterals = [];
  for (clause of expression) {
    for (literal of clause) {
      allLiterals.push(literal);
    }
  }
  allLiterals = new Set(allLiterals);
  pureLiterals = [...allLiterals].filter(i => [...allLiterals].includes(-(i)));
  return pureLiterals;
}

// gets a pure literal from an expression
function getPureLiteral(expression) {
  return pureLiteralInExpression(expression)[0];
}

// handles the assignment of pure literals
function pureLiteralAssign(literal, expression) {
  expression = expression.map(i => i.filter(j => j != literal));
  return expression;
}

// checks if the expression contains an empty clause
function expressionContainsEmptyClause(expression) {
  for (clause of expression) {
    if (clause.length == 0 || (clause.length == 1 && clause[0] === false) || (clause.length == 2 && (clause[0] === false && clause[1] === false)))
      return true;
    else continue;
  }
  return false;
}

// subs a literal and its complement with either true or false
function subLiteral(expression, literal, polarity) {
  if (!polarity) { //replace with false
    expression = expression.map(i => i.map(j => j == literal ? false : j))
    expression = expression.map(i => i.map(j => j == `-${literal}` ? true : j))
  } else { //remove true clauses
    expression = expression.filter(i => !i.includes(literal));
    expression = expression.map(i => i.map(j => j == `-${literal}` ? false : j))
  }
  //remove expressions that have true
  expression = expression.filter(i => !i.includes(true));
  return expression;
}

// chooses a literal from an expression
function chooseLiteral(expression) {
  let allLiterals = [];
  for (clause of expression) {
    for (literal of clause) {
      allLiterals.push(literal);
    }
  }
  allLiterals = allLiterals.map(i => typeof(i) != 'boolean' ? Math.abs(parseInt(i)).toString() : i);
  allLiterals = new Set(allLiterals);
  allLiterals = [...allLiterals].filter(i => typeof(i) == 'string');
  return allLiterals[0];
}

// gets the metadata in an expression
function getMetadata(expression) {
  return {
    clauseNum: expression[1][3],
    varNum: expression[1][2],
    literalNum: expression[0][2]
  }
}

// DPLL algorithm
function DPLL(expression) {
  //remove metadata
  expression[0] = []; expression[1] = [];
  expression = expression.filter(i => i.length != 0);
  expression = expression.map(i => i.filter(j => j != '0')); //remove 0's
  return DPLLExec(expression);
}

// DPLL algorithm
function DPLLExec(expression) {
  // handle unit clauses
  while (unitClauseInExpression(expression)) { 
    for (clause of expression) {
      if (isUnitClause(clause)) {
        expression = unitPropagate(clause, expression);
      } 
    }
  }

  //handle pure literal elimination
  while (pureLiteralInExpression(expression).length > 0) {
    console.log('pure')
    expression = pureLiteralAssign(getPureLiteral(expression), expression);
  }

  // base cases
  if (expression.length == 0) {
    return true;
  }
  
  if (expressionContainsEmptyClause(expression)) {
    return false;
  }

  let literal = chooseLiteral(expression);
  let expressionSubstitutedTrue = subLiteral(expression, literal, true);
  let expressionSubstitutedFalse = subLiteral(expression, literal, false);

  //recursive
  return DPLLExec(expressionSubstitutedTrue) || DPLLExec(expressionSubstitutedFalse);

}

///./2SAT.cnf.csv

fs.readFile("./2SAT.cnf.csv", 'utf8', (err, data) => {
  let plotData = [];
  SATCSV = data.split("\n");
  SATCSV = SATCSV.map((row) => row.split(","));
  parseCSVArr();
  let trues = 0; let falses = 0;
  for (let i = 0; i < 200; i++) { //run the DPLL algorithm on the test cases multiple times to get an average time
    let index = 0;
    trues = 0; falses = 0;
    for (sat of sats) {
      let metadata = getMetadata(sat);
      let t = Date.now();
      let result = DPLL(sat);
      t = Date.now() - t;
      if (plotData[index]) {
        plotData[index].time = (plotData[index].time + t) / 2
      } else {
        plotData[index] = {
          R: result,
          time: t,
          varNum: metadata.varNum,
          clauseNum: metadata.clauseNum
        } 
      }
      index++
      if (result) {
        trues++; 
      } else {
        falses++;
      }
    }
  }

  // round times to 1 decimal place
  for (d of plotData) {
    d.time = Math.round(d.time * 10) / 10;
  }
  
  // write to file
  fs.writeFileSync("output_aberchel.json", JSON.stringify(plotData));
})

// parse CSV to array
function parseCSVArr() {
  for (row of SATCSV) {
    if (row[0] == 'c' || row[1] == 1000) { //weird quirk where it doesn't detect c on the first expression
      ++index;
      sats[index] = [];
    }
    sats[index].push(row.filter(a => a != ''));
  }
}