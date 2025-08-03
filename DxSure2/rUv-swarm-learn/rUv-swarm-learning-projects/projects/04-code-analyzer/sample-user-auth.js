
// user-auth.js - Authentication module with security issues
const express = require('express');
const mysql = require('mysql');

function authenticateUser(username, password) {
    // SECURITY ISSUE: SQL Injection vulnerability
    const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
    
    // SECURITY ISSUE: Database connection without proper error handling
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '', // SECURITY ISSUE: Empty password
        database: 'users'
    });
    
    connection.query(query, (error, results) => {
        if (error) {
            // SECURITY ISSUE: Exposing internal errors to client
            console.log("Database error: " + error);
            return null;
        }
        return results;
    });
}

// SECURITY ISSUE: No input validation
function createUser(userData) {
    const query = "INSERT INTO users VALUES ('" + userData.username + "', '" + userData.password + "')";
    // More vulnerable code...
}

module.exports = { authenticateUser, createUser };
