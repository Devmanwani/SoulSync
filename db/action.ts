//@ts-nocheck
'use server'
import { DataAPIClient } from '@datastax/astra-db-ts';

// Get an existing collection
const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN);
console.log(process.env.ASTRA_DB_API_ENDPOINT)
const database = client.db(process.env.ASTRA_DB_API_ENDPOINT as string);
const collection = database.collection('astrodata');



// Insert a document into the collection
export async function insertOne(details) {
  try {
    // Check if the document already exists (you can change the condition based on your needs)
    const existingDoc = await collection.findOne({ category: details.category, name: details.name });

    if (existingDoc) {
      // If the document exists, log and do not insert
      console.log('Document already exists:', existingDoc);
      return { success: false, message: 'Document already exists.' };
    }

    // If the document does not exist, insert the new document
    const result = await collection.insertOne(details);
    console.log('Document inserted:', result);
    return { success: true, message: 'Document inserted successfully.' };
  } catch (error) {
    console.error('Error inserting document:', error);
    return { success: false, message: 'Error inserting document.' };
  }
}



