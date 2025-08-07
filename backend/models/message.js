
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  wa_id:      { type: String, required: true },
  contact_name:   { type: String, required: true },    // ← new
  contact_number: { type: String, required: true },    // ← new
  message_id:{ type: String, required: true, unique: true },  // store the payload ID
  message:    { type: String, required: true },
  status:     { type: String, enum: ['sent','delivered','read'], default: 'sent' },
  timestamp:  { type: Date, default: Date.now }
});

export default mongoose.model('processed_messages', messageSchema);



