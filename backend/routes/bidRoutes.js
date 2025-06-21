const express = require('express');
const router = express.Router();
const {
    submitBid,
    getBidsForProject,
    acceptBid,
    getMyBids
} = require('../controllers/bidController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Private routes (require authentication)
router.post('/', protect, authorizeRoles('freelancer'), submitBid);
router.get('/my-bids', protect, authorizeRoles('freelancer'), getMyBids);
router.get('/project/:projectId', protect, authorizeRoles('client'), getBidsForProject);
router.put('/:id/accept', protect, authorizeRoles('client'), acceptBid);

module.exports = router;