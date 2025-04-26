const FILE_PATH = "./src/db/db.json";

import dbJson from "./db.json" with { type: "json" };

import fs from "fs";

const users = dbJson.users;

/**
 * CRUD operations for user
 * - with id auto increment
 */
function createUser(user) {
  const newUser = {
    id: users.length + 1,
    ...user,
  };
  users.push(newUser);
  updateDb();
  return newUser;
}

function getUsers() {
  return users;
}

function getUserById(id) {
  return users.find((user) => user.id === id);
}

function getUserByEmail(email) {
  return users.find(user => user.email === email);
}

function getUserByNameAndEmail(name, email) {
  return users.find((user) => {
    user.name === name && user.email == email
  })
}

function updateUser(id, user) {
  const index = users.findIndex((user) => user.id === id);
  users[index] = { ...users[index], ...user };
  
  updateDb();
  return users[index];
}

function deleteUser(id) {
  const index = users.findIndex((user) => user.id === id);
  users.splice(index, 1);
  
  updateDb();
  return true;
}


// --- utils internal ---

function updateDb() {
    console.log("Updating database...");
    console.log("users", users);
    const jsonData = JSON.stringify(dbJson, null, 2);

    console.log("jsonData", jsonData);

    fs.writeFile(FILE_PATH, jsonData, (err) => {
        if (err) {
            console.error("Error writing file:", err);
        } else {
            console.log("File successfully updated!");
        }
    });
}


// --- export ---
const db = {
  createUser,
  getUsers,
  getUserById,
  getUserByNameAndEmail,
  getUserByEmail,
  updateUser,
  deleteUser,
};

export default db;
