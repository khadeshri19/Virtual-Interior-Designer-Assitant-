import { Router } from 'express';
import { chatController } from '../controllers/chatController.js';
import { authMiddleware } from '../middleware/auth.js';
import { chatLimiter } from '../middleware/rateLimit.js';
import { validate, chatMessageSchema } from '../middleware/validate.js';

const router = Router();

// All chat routes require authentication
router.use(authMiddleware);

// IMPORTANT: Static routes MUST come before parameterized routes
// Otherwise Express matches /:chatId for /quick/suggestions (chatId = "quick")

// Get quick suggestions (MUST be above /:chatId)
router.get('/quick/suggestions', chatController.getQuickSuggestions.bind(chatController));

// Send message to AI assistant
router.post(
    '/message',
    chatLimiter,
    validate(chatMessageSchema),
    chatController.sendMessage.bind(chatController)
);

// Create new chat
router.post('/', chatController.createChat.bind(chatController));

// Get all chats
router.get('/', chatController.getAllChats.bind(chatController));

// Get chat history (parameterized — MUST be after static routes)
router.get('/:chatId', chatController.getHistory.bind(chatController));

// Delete chat
router.delete('/:chatId', chatController.deleteChat.bind(chatController));

export default router;
