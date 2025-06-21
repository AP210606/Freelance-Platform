const express = require('express');
const router = express.Router();
const {
    getProjects,
    getProjectById,
    createProject,
    getMyProjects,
    updateProject,
    deleteProject
} = require('../controllers/projectController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getProjects);

// Specific routes should come before generic ones
// GET /api/projects/my-projects should be defined before /api/projects/:id
router.get('/my-projects', protect, authorizeRoles('client'), getMyProjects); // This needs to be moved up

router.get('/:id', getProjectById); // This is the generic route for fetching by ID

// Private routes (require authentication)
router.post('/', protect, authorizeRoles('client'), createProject);
router.put('/:id', protect, authorizeRoles('client'), updateProject);
router.delete('/:id', protect, authorizeRoles('client'), deleteProject);

module.exports = router;