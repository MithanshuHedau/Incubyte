const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/sweet.controller");
const { authenticate, requireAdmin } = require("../middleware/auth.middleware");

// Protected routes
router.post("/", authenticate, ctrl.createSweet);
router.get("/", authenticate, ctrl.getAllSweets);
router.get("/search", authenticate, ctrl.searchSweets);
router.put("/:id", authenticate, ctrl.updateSweet);
router.delete("/:id", authenticate, requireAdmin, ctrl.deleteSweet);
router.get("/allUsers", authenticate, requireAdmin, ctrl.getAllUsers);

// Purchase + restock
router.post("/:id/purchase", authenticate, ctrl.purchaseSweet);
router.post("/:id/restock", authenticate, requireAdmin, ctrl.restockSweet);

module.exports = router;
