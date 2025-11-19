const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log('Testing MongoDB Atlas Connection...\n');
console.log('Loading .env from:', path.join(__dirname, '.env'));
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Found in .env' : 'NOT FOUND');

if (!process.env.MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI not found in .env file');
  console.error('Please check that backend/.env exists and contains MONGODB_URI');
  process.exit(1);
}

console.log('Attempting to connect...\n');

const testConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ SUCCESS! Connected to MongoDB Atlas');
    console.log('Database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    console.log('Port:', mongoose.connection.port);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nCollections in database:', collections.length);
    if (collections.length > 0) {
      console.log('Collection names:', collections.map(c => c.name).join(', '));
    }
    
    await mongoose.connection.close();
    console.log('\n✅ Connection closed successfully');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ ERROR: Failed to connect to MongoDB Atlas');
    console.error('Error message:', error.message);
    
    if (error.message.includes('authentication')) {
      console.error('\n💡 TIP: Check your username and password');
      console.error('💡 TIP: Special characters in password need to be URL-encoded');
      console.error('   @ should be %40');
      console.error('   : should be %3A');
      console.error('   / should be %2F');
    }
    
    if (error.message.includes('network')) {
      console.error('\n💡 TIP: Check your network connection');
      console.error('💡 TIP: Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for testing)');
    }
    
    process.exit(1);
  }
};

testConnection();
