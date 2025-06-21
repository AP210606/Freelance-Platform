const Contract = require('../models/Contract');
const Project = require('../models/Project'); // To update project status

// @desc    Get all contracts for the logged-in user (client or freelancer)
// @route   GET /api/contracts/my-contracts
// @access  Private
const getMyContracts = async (req, res) => {
    try {
        let contracts;
        if (req.user.role === 'client') {
            contracts = await Contract.find({ clientId: req.user.id })
                                      .populate('projectId', 'title description')
                                      .populate('freelancerId', 'name email');
        } else if (req.user.role === 'freelancer') {
            contracts = await Contract.find({ freelancerId: req.user.id })
                                      .populate('projectId', 'title description')
                                      .populate('clientId', 'name email');
        } else {
            return res.status(403).json({ message: 'Unauthorized role to view contracts' });
        }
        res.status(200).json(contracts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching contracts' });
    }
};

// @desc    Mark a contract as 'completed' by the freelancer
// @route   PUT /api/contracts/:id/complete
// @access  Private (Freelancer only, owner of contract)
const completeContract = async (req, res) => {
    try {
        const contract = await Contract.findById(req.params.id).populate('projectId');
        if (!contract) {
            return res.status(404).json({ message: 'Contract not found' });
        }

        // Ensure logged-in user is the freelancer for this contract
        if (contract.freelancerId.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'Not authorized to complete this contract' });
        }

        // Only allow completing 'in_progress' contracts
        if (contract.status !== 'in_progress') {
            return res.status(400).json({ message: 'Contract is not in a status to be completed.' });
        }

        contract.status = 'completed';
        contract.endDate = Date.now();
        await contract.save();

        // Optionally, update project status to 'completed' as well (can be approved later)
        if (contract.projectId) {
            const project = await Project.findById(contract.projectId._id);
            if (project) {
                project.status = 'completed'; // Project is completed by freelancer, awaiting client approval
                await project.save();
            }
        }

        res.status(200).json({ message: 'Contract marked as completed', contract });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error completing contract' });
    }
};

// @desc    Approve a completed contract by the client
// @route   PUT /api/contracts/:id/approve
// @access  Private (Client only, owner of contract)
const approveContract = async (req, res) => {
    try {
        const contract = await Contract.findById(req.params.id).populate('projectId');
        if (!contract) {
            return res.status(404).json({ message: 'Contract not found' });
        }

        // Ensure logged-in user is the client for this contract
        if (contract.clientId.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'Not authorized to approve this contract' });
        }

        // Only allow approving 'completed' contracts
        if (contract.status !== 'completed') {
            return res.status(400).json({ message: 'Contract is not in a status to be approved.' });
        }

        contract.status = 'approved';
        contract.paymentStatus = 'paid'; // Assuming payment is handled here or integrated later
        await contract.save();

        // Update project status to 'approved'
        if (contract.projectId) {
            const project = await Project.findById(contract.projectId._id);
            if (project) {
                project.status = 'completed'; // Final status for project
                await project.save();
            }
        }

        res.status(200).json({ message: 'Contract approved and marked as paid', contract });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error approving contract' });
    }
};


module.exports = {
    getMyContracts,
    completeContract,
    approveContract
};