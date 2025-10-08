# 📚 MongoDB Bookstore - Week 1 Assignment

**Student:** Kidist Ayele  
**Assignment:** MongoDB Data Layer Fundamentals and Advanced Techniques

## 🎯 Project Overview

This project demonstrates MongoDB fundamentals including CRUD operations, advanced queries, aggregation pipelines, and indexing using a bookstore database.

## 🗄️ Database Schema

- **Database:** `plp_bookstore`
- **Collection:** `books`
- **Documents:** 12 book records with fields: title, author, genre, published_year, price, in_stock, pages, publisher

## 🚀 Quick Start

### Prerequisites

- Node.js (v14+)
- MongoDB running locally or MongoDB Atlas

### Setup & Run

```bash
# Install dependencies
npm install

# Insert sample data
node insert_books.js

# Run all assignment queries
node queries.js
```

## ✅ Assignment Tasks Completed

### Task 1: MongoDB Setup

- Created `plp_bookstore` database and `books` collection
- Inserted 12 book documents

### Task 2: Basic CRUD Operations

- Find books by genre, year, author
- Update book prices
- Delete books by title

### Task 3: Advanced Queries

- Complex filtering (in stock + published after 2010)
- Projection (select specific fields)
- Sorting and pagination

### Task 4: Aggregation Pipeline

- Average price by genre
- Author with most books
- Books grouped by decade

### Task 5: Indexing

- Single field index on `title`
- Compound index on `author` + `published_year`
- Performance analysis with `explain()`

## 📁 Files

- `insert_books.js` - Populates database with sample data
- `queries.js` - All assignment queries with explanations
- `package.json` - Dependencies
- `README.md` - This file

## 🔍 MongoDB Basics

### Key Concepts

- **Database** = Container (plp_bookstore)
- **Collection** = Table (books)
- **Document** = Row (one book)

### Common Operators

```javascript
$gt; // Greater than
$lt; // Less than
$eq; // Equal to
$in; // In array
```

### Example Queries

```javascript
// Find Fiction books
db.books.find({ genre: "Fiction" });

// Find books after 1950
db.books.find({ published_year: { $gt: 1950 } });

// Update price
db.books.updateOne({ title: "1984" }, { $set: { price: 13.99 } });
```

## 📸 Screenshots

### MongoDB Compass Database View

<img width="1332" height="705" alt="image" src="https://github.com/user-attachments/assets/3252867e-fb6d-47a3-bcae-49cfcc194f3b" />


**Screenshot shows:**

- Database: `plp_bookstore`
- Collection: `books` with 11 documents
- Sample query: `db.books.find({ genre: "Fiction" })`
- Document structure with all required fields

## 🐛 Troubleshooting

**Error: Cannot find module 'mongodb'**

```bash
npm install mongodb
```

**Error: Connection refused**

- Make sure MongoDB is running
- Check connection string in scripts

