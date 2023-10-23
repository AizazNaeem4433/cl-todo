#!/usr/bin/env node

import inquirer from "inquirer";
import fs from "fs";

const todoFileName = "todos.json";

let todo: string[] = [];
let loop = true;
let clearRecent = false;

async function main() {
  // Check for command-line arguments
  const args = process.argv.slice(2);

  if (args.includes("--clear")) {
    clearRecent = true;
  } else {
    todo = loadSavedTasks();
  }

  while (loop) {
    const questions = [
        {
            type: "confirm",
            name: "Clearcommand",
            message: ("If you want to clear the recent todos, type 'y'."+ todo),
            default: false,
          },
    
        {
        type: "input",
        name: "TODO",
        message: "What do you want to add in your todo? ",
      },
      {
        type: "confirm",
        name: "Clearcommand",
        message: ("If you want to clear the recent todos, type 'y'."+ todo),
        default: false,
      },

      {
        type: "confirm",
        name: "addmore",
        message: "Do you want to add more todo?",
        default: false,
      },
    ];

    const answers = await inquirer.prompt(questions);

    const { TODO, addmore, Clearcommand } = answers;
    //console.log(answers);

    if (Clearcommand) {
      console.log("Clearing recent todos...");
      todo = [];
      saveTodoList(todo);
      process.exit(0);
    }

    loop = addmore;
    if (TODO) {
      todo.push(TODO);
    } else {
      console.log("Kindly add valid input.");
    }
  }

  if (todo.length > 0) {
    console.log("Your todo list: \n");
    todo.forEach((task) => {
      console.log(task);
    });

    // Save the updated todo list to the file
    saveTodoList(todo);
  } else {
    console.log("No todo found");
  }
}

main();

function saveTodoList(tasks: string[]) {
  fs.writeFileSync(todoFileName, JSON.stringify(tasks, null, 2));
}

function loadSavedTasks() {
  try {
    const data = fs.readFileSync(todoFileName, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}
