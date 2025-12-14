const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/sweet.controller");
const { authenticate, requireAdmin } = require("../middleware/auth.middleware");

// Protected routes
router.post("/", authenticate, requireAdmin, ctrl.createSweet);
router.get("/", authenticate, ctrl.getAllSweets);
router.get("/search", authenticate, ctrl.searchSweets);
router.put("/:id", authenticate, requireAdmin, ctrl.updateSweet);
router.delete("/:id", authenticate, requireAdmin, ctrl.deleteSweet);
router.get("/allUsers", authenticate, requireAdmin, ctrl.getAllUsers);

// Purchase history routes
router.get("/my-purchases", authenticate, ctrl.getMyPurchases);
router.get("/all-purchases", authenticate, requireAdmin, ctrl.getAllPurchases);

// Purchase + restock
router.post("/:id/purchase", authenticate, ctrl.purchaseSweet);
router.post("/:id/restock", authenticate, requireAdmin, ctrl.restockSweet);

module.exports = router;
