import Lead from '../models/Lead.js';

export const createLead = async (req, res) => {
    try {
        const { user, name, email, serviceName, cost } = req.body;

        const newLead = new Lead({
            user: user || null,
            name,
            email,
            serviceName,
            cost: cost || 1000
        });

        await newLead.save();
        res.status(201).json({ success: true, message: 'Interest recorded effectively', lead: newLead });
    } catch (error) {
        console.error('Error creating lead:', error);
        res.status(500).json({ success: false, message: 'Server Error recording interest' });
    }
};

export const getLeads = async (req, res) => {
    try {
        const { userId } = req.query;
        let query = {};
        if (userId) query.user = userId;

        const leads = await Lead.find(query)
            .populate('user', 'name email profile')
            .sort({ createdAt: -1 });
        res.status(200).json(leads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const updateLead = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body, updatedAt: Date.now() };

        // If it's a $push operation (from frontend mock)
        let updatedLead;
        if (req.body.$push) {
            updatedLead = await Lead.findByIdAndUpdate(
                id,
                { $push: req.body.$push, updatedAt: Date.now() },
                { new: true }
            );
        } else {
            updatedLead = await Lead.findByIdAndUpdate(
                id,
                updateData,
                { new: true }
            );
        }

        if (!updatedLead) {
            return res.status(404).json({ success: false, message: 'Lead not found' });
        }

        res.status(200).json({ success: true, lead: updatedLead });
    } catch (error) {
        console.error('Error updating lead:', error);
        res.status(500).json({ success: false, message: 'Error updating lead' });
    }
};
