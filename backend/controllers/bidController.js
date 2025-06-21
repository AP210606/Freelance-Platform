const Bid = require('../models/Bid');
const Project = require('../models/Project');
const Contract = require('../models/Contract'); // To create a contract upon acceptance

// @desc    Submit a bid for a project
// @route   POST /api/bids
// @access  Private (Freelancer only)
const submitBid = async (req, res) => {
    const { projectId, amount, timeline, message } = req.body;

    if (!projectId || !amount || !timeline || !message) {
        return res.status(400).json({ message: 'Please include project ID, amount, timeline, and message' });
    }

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Ensure project is still open for bids
        if (project.status !== 'open') {
            return res.status(400).json({ message: 'This project is no longer open for bids.' });
        }

        // Ensure freelancer hasn't already bid on this project (optional, but good practice)
        const existingBid = await Bid.findOne({ projectId, freelancerId: req.user.id });
        if (existingBid) {
            return res.status(400).json({ message: 'You have already placed a bid on this project.' });
        }

        const newBid = await Bid.create({
            projectId,
            freelancerId: req.user.id, // The logged-in user is the freelancer
            amount,
            timeline,
            message,
            status: 'pending'
        });
        res.status(201).json(newBid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error submitting bid' });
    }
};

// @desc    Get all bids for a specific project
// @route   GET /api/bids/project/:projectId
// @access  Private (Client only, owner of project)
const getBidsForProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Ensure logged-in user is the project owner
        if (project.clientId.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view bids for this project' });
        }

        const bids = await Bid.find({ projectId: req.params.projectId })
                              .populate('freelancerId', 'name email'); // Populate freelancer details
        res.status(200).json(bids);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching bids' });
    }
};

// @desc    Accept a bid
// @route   PUT /api/bids/:id/accept
// @access  Private (Client only, owner of project that bid belongs to)
const acceptBid = async (req, res) => {
    try {
        const bid = await Bid.findById(req.params.id).populate('projectId');
        if (!bid) {
            return res.status(404).json({ message: 'Bid not found' });
        }

        const project = bid.projectId;
        if (!project) {
            return res.status(404).json({ message: 'Associated project not found' });
        }

        // Ensure logged-in user is the project owner
        if (project.clientId.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'Not authorized to accept this bid' });
        }

        // Ensure project is still open and no bid has been accepted yet
        if (project.status !== 'open') {
            return res.status(400).json({ message: 'Project is no longer open for bids or already has an accepted bid.' });
        }

        // Update bid status to accepted
        bid.status = 'accepted';
        await bid.save();

        // Update project status and link to the accepted bid
        project.status = 'in_progress';
        project.acceptedBidId = bid._id;
        await project.save();

        // Create a new contract
        const contract = await Contract.create({
            projectId: project._id,
            clientId: project.clientId,
            freelancerId: bid.freelancerId,
            bidId: bid._id,
            status: 'in_progress'
        });

        // Optionally, reject all other bids for this project
        await Bid.updateMany(
            { projectId: project._id, _id: { $ne: bid._id }, status: 'pending' },
            { $set: { status: 'rejected' } }
        );

        res.status(200).json({
            message: 'Bid accepted and contract created successfully',
            bid,
            project,
            contract
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error accepting bid' });
    }
};

// @desc    Get bids made by the logged-in freelancer
// @route   GET /api/bids/my-bids
// @access  Private (Freelancer only)
const getMyBids = async (req, res) => {
    try {
        const bids = await Bid.find({ freelancerId: req.user.id })
                              .populate('projectId', 'title status'); // Populate project title and status
        res.status(200).json(bids);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching my bids' });
    }
};


module.exports = {
    submitBid,
    getBidsForProject,
    acceptBid,
    getMyBids
};