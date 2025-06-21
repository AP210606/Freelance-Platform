const Project = require('../models/Project');
const User = require('../models/User'); // To populate client info

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public (can be filtered by status or client in future)
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ status: 'open' }) // Only show 'open' projects initially
                                      .populate('clientId', 'name email role'); // Populate client details
        res.status(200).json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching projects' });
    }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
                                    .populate('clientId', 'name email role')
                                    .populate('acceptedBidId'); // If an accepted bid exists
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching project' });
    }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (Client only)
const createProject = async (req, res) => {
    const { title, description, budget, deadline } = req.body;

    if (!title || !description || !budget) {
        return res.status(400).json({ message: 'Please include title, description, and budget' });
    }

    try {
        // req.user comes from the protect middleware
        const newProject = await Project.create({
            clientId: req.user.id, // The logged-in user is the client
            title,
            description,
            budget,
            deadline: deadline || null, // Allow deadline to be optional
            status: 'open'
        });
        res.status(201).json(newProject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating project' });
    }
};

// @desc    Get projects posted by the logged-in client
// @route   GET /api/projects/my-projects
// @access  Private (Client only)
const getMyProjects = async (req, res) => {
    try {
        const projects = await Project.find({ clientId: req.user.id })
                                      .populate('clientId', 'name email')
                                      .populate('acceptedBidId');
        res.status(200).json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching my projects' });
    }
};


// @desc    Update a project (e.g., client can update details before a bid is accepted)
// @route   PUT /api/projects/:id
// @access  Private (Client only, owner of project)
const updateProject = async (req, res) => {
    const { title, description, budget, deadline } = req.body;
    try {
        let project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Ensure logged-in user is the project owner
        if (project.clientId.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this project' });
        }
        
        // Prevent updates if project is already in progress or completed
        if (project.status !== 'open') {
            return res.status(400).json({ message: 'Project cannot be updated once bids are accepted or project is in progress.' });
        }

        project.title = title || project.title;
        project.description = description || project.description;
        project.budget = budget || project.budget;
        project.deadline = deadline || project.deadline;

        const updatedProject = await project.save();
        res.status(200).json(updatedProject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating project' });
    }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (Client only, owner of project)
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Ensure logged-in user is the project owner
        if (project.clientId.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this project' });
        }
        
        // Optionally, prevent deletion if there are active bids or contracts
        if (project.status !== 'open') {
             return res.status(400).json({ message: 'Cannot delete project with active bids or contracts.' });
        }

        await Project.deleteOne({ _id: req.params.id }); // Using deleteOne or findByIdAndDelete
        res.status(200).json({ message: 'Project removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error deleting project' });
    }
};


module.exports = {
    getProjects,
    getProjectById,
    createProject,
    getMyProjects,
    updateProject,
    deleteProject
};