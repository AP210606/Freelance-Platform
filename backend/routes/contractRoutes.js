const express = require('express');
const router = express.Router();
const {
    getMyContracts,
    completeContract,
    approveContract
} = require('../controllers/contractController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Private routes for contracts
router.get('/my-contracts', protect, getMyContracts);
router.put('/:id/complete', protect, authorizeRoles('freelancer'), completeContract);
router.put('/:id/approve', protect, authorizeRoles('client'), approveContract);

module.exports = router;