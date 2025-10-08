// This file contains all the queries required for Week 1 Assignment

const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb://localhost:27017';
const dbName = 'plp_bookstore';
const collectionName = 'books';

// Main function to run all queries
async function runQueries() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // ============================================
    // TASK 2: BASIC CRUD OPERATIONS
    // ============================================
    console.log('📚 TASK 2: BASIC CRUD OPERATIONS\n');

    // Query 1: Find all books in a specific genre (Fiction)
    console.log('1️⃣  Find all books in "Fiction" genre:');
    const fictionBooks = await collection.find({ genre: 'Fiction' }).toArray();
    console.log(`   Found ${fictionBooks.length} books:`);
    fictionBooks.forEach(book => console.log(`   - ${book.title} by ${book.author}`));
    console.log();

    // Query 2: Find books published after a certain year (after 1950)
    console.log('2️⃣  Find books published after 1950:');
    const recentBooks = await collection.find({ 
      published_year: { $gt: 1950 } 
    }).toArray();
    console.log(`   Found ${recentBooks.length} books:`);
    recentBooks.forEach(book => console.log(`   - ${book.title} (${book.published_year})`));
    console.log();

    // Query 3: Find books by a specific author (George Orwell)
    console.log('3️⃣  Find books by George Orwell:');
    const orwellBooks = await collection.find({ 
      author: 'George Orwell' 
    }).toArray();
    console.log(`   Found ${orwellBooks.length} books:`);
    orwellBooks.forEach(book => console.log(`   - ${book.title} (${book.published_year})`));
    console.log();

    // Query 4: Update the price of a specific book
    console.log('4️⃣  Update the price of "1984" to $13.99:');
    const updateResult = await collection.updateOne(
      { title: '1984' },
      { $set: { price: 13.99 } }
    );
    console.log(`   Modified ${updateResult.modifiedCount} document(s)`);
    const updatedBook = await collection.findOne({ title: '1984' });
    console.log(`   New price: $${updatedBook.price}`);
    console.log();

    // Query 5: Delete a book by its title
    console.log('5️⃣  Delete "Animal Farm" from the collection:');
    const deleteResult = await collection.deleteOne({ title: 'Animal Farm' });
    console.log(`   Deleted ${deleteResult.deletedCount} document(s)`);
    const remainingCount = await collection.countDocuments();
    console.log(`   Books remaining in collection: ${remainingCount}`);
    console.log();

    // ============================================
    // TASK 3: ADVANCED QUERIES
    // ============================================
    console.log('\n🔍 TASK 3: ADVANCED QUERIES\n');

    // Query 1: Find books that are both in stock AND published after 2010
    console.log('1️⃣  Books in stock AND published after 2010:');
    const inStockRecent = await collection.find({
      in_stock: true,
      published_year: { $gt: 2010 }
    }).toArray();
    console.log(`   Found ${inStockRecent.length} books:`);
    inStockRecent.forEach(book => console.log(`   - ${book.title} (${book.published_year})`));
    console.log();

    // Query 2: Use projection (return only title, author, and price)
    console.log('2️⃣  All books with ONLY title, author, and price (projection):');
    const projectedBooks = await collection.find(
      {},
      { projection: { title: 1, author: 1, price: 1, _id: 0 } }
    ).limit(5).toArray();
    console.log('   First 5 books:');
    projectedBooks.forEach(book => {
      console.log(`   - "${book.title}" by ${book.author} - $${book.price}`);
    });
    console.log();

    // Query 3: Sort books by price (ascending and descending)
    console.log('3️⃣  Books sorted by price (ASCENDING - cheapest first):');
    const booksByPriceAsc = await collection.find({})
      .sort({ price: 1 })
      .limit(5)
      .toArray();
    booksByPriceAsc.forEach(book => {
      console.log(`   - ${book.title}: $${book.price}`);
    });
    console.log();

    console.log('   Books sorted by price (DESCENDING - most expensive first):');
    const booksByPriceDesc = await collection.find({})
      .sort({ price: -1 })
      .limit(5)
      .toArray();
    booksByPriceDesc.forEach(book => {
      console.log(`   - ${book.title}: $${book.price}`);
    });
    console.log();

    // Query 4: Pagination (5 books per page)
    console.log('4️⃣  Pagination (5 books per page):');
    const pageSize = 5;
    
    // Page 1
    console.log('   📄 Page 1:');
    const page1 = await collection.find({})
      .skip(0)
      .limit(pageSize)
      .toArray();
    page1.forEach(book => console.log(`   - ${book.title}`));
    console.log();

    // Page 2
    console.log('   📄 Page 2:');
    const page2 = await collection.find({})
      .skip(pageSize)
      .limit(pageSize)
      .toArray();
    page2.forEach(book => console.log(`   - ${book.title}`));
    console.log();

    // ============================================
    // TASK 4: AGGREGATION PIPELINE
    // ============================================
    console.log('\n📊 TASK 4: AGGREGATION PIPELINE\n');

    // Pipeline 1: Calculate average price of books by genre
    console.log('1️⃣  Average price of books by genre:');
    const avgPriceByGenre = await collection.aggregate([
      {
        $group: {
          _id: '$genre',
          averagePrice: { $avg: '$price' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { averagePrice: -1 }
      }
    ]).toArray();
    
    avgPriceByGenre.forEach(genre => {
      console.log(`   - ${genre._id}: $${genre.averagePrice.toFixed(2)} (${genre.count} books)`);
    });
    console.log();

    // Pipeline 2: Find the author with the most books
    console.log('2️⃣  Author with the most books:');
    const authorWithMostBooks = await collection.aggregate([
      {
        $group: {
          _id: '$author',
          bookCount: { $sum: 1 },
          titles: { $push: '$title' }
        }
      },
      {
        $sort: { bookCount: -1 }
      },
      {
        $limit: 1
      }
    ]).toArray();
    
    if (authorWithMostBooks.length > 0) {
      const topAuthor = authorWithMostBooks[0];
      console.log(`   - ${topAuthor._id}: ${topAuthor.bookCount} books`);
      console.log(`   Books: ${topAuthor.titles.join(', ')}`);
    }
    console.log();

    // Pipeline 3: Group books by publication decade
    console.log('3️⃣  Books grouped by publication decade:');
    const booksByDecade = await collection.aggregate([
      {
        $addFields: {
          decade: {
            $subtract: [
              '$published_year',
              { $mod: ['$published_year', 10] }
            ]
          }
        }
      },
      {
        $group: {
          _id: '$decade',
          count: { $sum: 1 },
          books: { $push: '$title' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]).toArray();
    
    booksByDecade.forEach(decade => {
      console.log(`   - ${decade._id}s: ${decade.count} books`);
      decade.books.forEach(book => console.log(`     • ${book}`));
    });
    console.log();

    // ============================================
    // TASK 5: INDEXING
    // ============================================
    console.log('\n⚡ TASK 5: INDEXING\n');

    // Create index on title field
    console.log('1️⃣  Creating index on "title" field:');
    await collection.createIndex({ title: 1 });
    console.log('   ✅ Index created on title field');
    console.log();

    // Create compound index on author and published_year
    console.log('2️⃣  Creating compound index on "author" and "published_year":');
    await collection.createIndex({ author: 1, published_year: -1 });
    console.log('   ✅ Compound index created');
    console.log();

    // List all indexes
    console.log('3️⃣  All indexes in the collection:');
    const indexes = await collection.indexes();
    indexes.forEach(index => {
      console.log(`   - ${index.name}: ${JSON.stringify(index.key)}`);
    });
    console.log();

    // Use explain() to demonstrate performance
    console.log('4️⃣  Performance analysis using explain():');
    console.log('\n   Query: Find book by title "The Hobbit"');
    
    const explainResult = await collection.find({ title: 'The Hobbit' })
      .explain('executionStats');
    
    console.log(`   - Execution time: ${explainResult.executionStats.executionTimeMillis}ms`);
    console.log(`   - Documents examined: ${explainResult.executionStats.totalDocsExamined}`);
    console.log(`   - Documents returned: ${explainResult.executionStats.nReturned}`);
    console.log(`   - Index used: ${explainResult.executionStats.executionStages.indexName || 'No index (collection scan)'}`);
    console.log();

    console.log('\n✨ All queries completed successfully!\n');

  } catch (err) {
    console.error('❌ Error occurred:', err);
  } finally {
    await client.close();
    console.log('🔒 Connection closed');
  }
}

// Run all queries
runQueries().catch(console.error);

