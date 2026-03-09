import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from '../models/Service.js';

dotenv.config();

const services = [
    {
        id: 'itax-01',
        title: 'Income Tax Compliance',
        description: 'Complete management of Income Tax filings, notices, and strategic planning.',
        category: 'Finance',
        tags: ['income-tax', 'compliance', 'growing', 'established']
    },
    {
        id: 'gst-01',
        title: 'GST Management',
        description: 'Monthly returns, reconciliation, and audit support for businesses of all sizes.',
        category: 'Compliance',
        tags: ['gst', 'compliance', 'growing']
    },
    {
        id: 'corp-01',
        title: 'Company Incorporation',
        description: 'Legal foundation for your new venture, including Company and LLP registrations.',
        category: 'Legal',
        tags: ['startup', 'incorporation', 'registration']
    },
    {
        id: 'vcfo-01',
        title: 'Virtual CFO',
        description: 'Professional financial leadership and reporting for data-driven growth.',
        category: 'Advisory',
        tags: ['cfo', 'scaling', 'established']
    },
    {
        id: 'vacct-01',
        title: 'Virtual Accountant',
        description: 'Expert-led bookkeeping, billing, and documentation management.',
        category: 'Finance',
        tags: ['accounting', 'scaling', 'growing']
    },
    {
        id: 'startup-01',
        title: 'Start-up Consultation',
        description: 'Strategic advice on benefits, registrations, and scaling for new entrepreneurs.',
        category: 'Advisory',
        tags: ['startup', 'registration']
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vithartha');
        await Service.deleteMany({});
        await Service.insertMany(services);
        console.log('✅ Services Seeded Successfully');
        mongoose.connection.close();
    } catch (error) {
        console.error('❌ Seeding Error:', error);
    }
};

seedDB();
