const mongoose = require('mongoose');

// Define connection strings
const sourceUri = process.env.MONGODB_URI
const destinationUri = 'mongodb+srv://sohanur25800:123@cluster0.tnafa.mongodb.net/';

// Create separate connections for source and destination
const sourceConnection = mongoose.createConnection(sourceUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

console.log(sourceConnection);
const destinationConnection = mongoose.createConnection(destinationUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
console.log(destinationConnection)

// Define schemas and models
const schema = new mongoose.Schema({}, { strict: false }); // Flexible schema for dynamic data
const SourceModel = sourceConnection.model('SourceCollection', schema);
const DestinationModel = destinationConnection.model('DestinationCollection', schema);

async function copyData() {
    try {
        // Fetch data from source collection
        const data = await SourceModel.find();

        if (data.length === 0) {
            console.log('No data found in source collection.');
            return;
        }

        // Insert data into destination collection
        const result = await DestinationModel.insertMany(data);
        console.log(`Copied ${result.length} documents to the destination collection.`);
    } catch (error) {
        console.error('Error copying data:', error);
    } finally {
        // Close the connections
        await sourceConnection.close();
        await destinationConnection.close();
    }
}

export default copyData
