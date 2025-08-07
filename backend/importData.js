// importData.js

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Message from './models/message.js';  // Ensure correct path to Message model

dotenv.config();  // Load environment variables

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

await mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => { console.error(err); process.exit(1); });

const dataFolder = join(__dirname, 'uploadedFiles');  // folder for your JSON files

async function importData() {
  try {
    const files = fs.readdirSync(dataFolder).filter(f => f.endsWith('.json'));
    console.log(`🔍 Found ${files.length} JSON file(s):`, files);  // Log all files found

    let totalInserted = 0;

    for (const file of files) {
      const raw = fs.readFileSync(join(dataFolder, file), 'utf-8');
      const payload = JSON.parse(raw);
      const change = payload.metaData.entry[0].changes[0].value;

      if (change.messages) {
        const msgObj = change.messages[0];
        const contact = change.contacts[0];
        const wa_id = contact.wa_id;
        const name = contact.profile?.name || wa_id;   // Name or WA ID
        const number = wa_id;                          // Default number to wa_id
        const messageId = msgObj.id;                   // Message ID
        const text = msgObj.text?.body || '';          // Message content
        const timestamp = new Date(Number(msgObj.timestamp) * 1000);  // Timestamp

        // Insert message into the database
        await Message.updateOne(
          { message_id: messageId },
          {
            $setOnInsert: {
              wa_id,
              contact_name: name,
              contact_number: number,
              message_id: messageId,
              message: text,
              timestamp,
            }
          },
          { upsert: true }
        );
        console.log(`➕ Inserted message for ${name} (${wa_id})`);

        totalInserted++;
      }
    }

    console.log(`🎉 Import complete: ${totalInserted} messages inserted.`);

  } catch (err) {
    console.error('❌ Import error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔒 MongoDB connection closed.');
  }
}

importData();
