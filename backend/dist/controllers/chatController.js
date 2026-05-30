import { aiService } from '../services/aiService.js';
import { logger } from '../utils/logger.js';
import { prisma } from '../config/db.js';
export class ChatController {
    // Send a message to the AI assistant
    async sendMessage(req, res, next) {
        try {
            const userId = req.userId;
            const { message, context } = req.body;
            if (!message || typeof message !== 'string') {
                res.status(400).json({ success: false, error: 'Message is required' });
                return;
            }
            // Generate AI response using the design suggestions engine
            const contextStr = context
                ? `Style: ${context.style || 'Modern'}, Room: ${context.roomType || 'Living Room'}`
                : 'General interior design';
            const suggestions = await aiService.generateDesignSuggestions(context?.roomType || 'Living Room', context?.style || 'Modern');
            const aiResponse = `Here are my design suggestions for your ${contextStr}:\n\n${suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
            // Save to database as a single message/response pair
            const chat = await prisma.chat.create({
                data: {
                    userId,
                    message,
                    response: aiResponse,
                },
            });
            logger.info(`Chat message processed for user ${userId}, chat ${chat.id}`);
            res.json({
                success: true,
                data: {
                    chatId: chat.id,
                    message: { role: 'assistant', content: aiResponse },
                    messageCount: 1,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get chat history
    async getHistory(req, res, next) {
        try {
            const userId = req.userId;
            const chatId = req.params.chatId;
            const chat = await prisma.chat.findFirst({
                where: {
                    id: chatId,
                    userId,
                },
            });
            if (!chat) {
                res.status(404).json({
                    success: false,
                    error: 'Chat not found',
                });
                return;
            }
            res.json({
                success: true,
                data: {
                    chatId: chat.id,
                    messages: [
                        { role: 'user', content: chat.message },
                        { role: 'assistant', content: chat.response },
                    ],
                    createdAt: chat.createdAt,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get all chats for user
    async getAllChats(req, res, next) {
        try {
            const userId = req.userId;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const chats = await prisma.chat.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip: (page - 1) * limit,
                select: {
                    id: true,
                    message: true,
                    response: true,
                    createdAt: true,
                },
            });
            // Get preview of each chat (first 100 chars of message)
            const chatsWithPreview = chats.map(chat => ({
                id: chat.id,
                preview: chat.message?.slice(0, 100) || 'New conversation',
                messageCount: 2, // 1 user message + 1 response
                createdAt: chat.createdAt,
            }));
            const total = await prisma.chat.count({ where: { userId } });
            res.json({
                success: true,
                data: {
                    chats: chatsWithPreview,
                    pagination: {
                        page,
                        limit,
                        total,
                        pages: Math.ceil(total / limit),
                    },
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Start a new chat
    async createChat(req, res, next) {
        try {
            const userId = req.userId;
            const { message } = req.body;
            const chat = await prisma.chat.create({
                data: {
                    userId,
                    message: message || '',
                    response: '',
                },
            });
            res.status(201).json({
                success: true,
                data: {
                    chatId: chat.id,
                    message: 'Chat created successfully',
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Delete a chat
    async deleteChat(req, res, next) {
        try {
            const userId = req.userId;
            const chatId = req.params.chatId;
            const chat = await prisma.chat.findFirst({
                where: { id: chatId, userId },
            });
            if (!chat) {
                res.status(404).json({
                    success: false,
                    error: 'Chat not found',
                });
                return;
            }
            await prisma.chat.delete({
                where: { id: chatId },
            });
            res.json({
                success: true,
                message: 'Chat deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get quick suggestions without creating a chat
    async getQuickSuggestions(req, res, next) {
        try {
            const { style, roomType } = req.query;
            const suggestions = await aiService.generateDesignSuggestions(roomType || 'Living Room', style || 'Modern');
            res.json({
                success: true,
                data: suggestions,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
export const chatController = new ChatController();
//# sourceMappingURL=chatController.js.map