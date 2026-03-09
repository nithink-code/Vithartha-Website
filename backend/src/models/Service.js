import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'FileText' },
    category: { type: String, enum: ['Compliance', 'Finance', 'Legal', 'Advisory'], required: true },
    tags: [String], // for recommendation engine
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Service', serviceSchema);
