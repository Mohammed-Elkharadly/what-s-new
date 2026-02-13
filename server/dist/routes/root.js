import express from 'express';
import asyncHandler from 'express-async-handler';
const router = express.Router();
router.get('/', (_req, res) => {
    res.send("hay");
});
export default router;
//# sourceMappingURL=root.js.map