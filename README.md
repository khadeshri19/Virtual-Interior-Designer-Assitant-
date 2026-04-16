# VD Assistant - AI-Powered Virtual Interior Designer

Transform empty rooms into inspiring homes with AI-powered interior design. Upload a photo and get instant redesigned versions in multiple styles.

![VD Assistant](./docs/frontend-landing.png)

## 🚀 Features

- **Room Upload & Analysis**: Upload room photos via drag-drop or file select
- **6+ Design Styles**: Modern, Minimalist, Scandinavian, Industrial, Luxury, Traditional
- **AI Image Generation**: Generate 3 redesigned variations using Stable Diffusion
- **Smart Recommendations**: Color palettes, furniture suggestions, layout tips
- **AI Chat Assistant**: Real-time design help powered by Ollama LLM
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark/Light Mode**: Beautiful UI with neumorphic cards and gradient accents

## 🏗️ BTech Viva Ready Architecture

This project implements a hybrid AI architecture optimized for performance and accuracy, perfect for project review and academic evaluation.

```
User Input (Image + Choice)
       ↓
Gemini 1.5 Flash (AI Reasoning Brain)
       ↓
Prompt Logic Engine (TypeScript Rules)
       ↓
Stable Diffusion XL (SDXL) (Rendering Engine)
       ↓
8K High-Fidelity Design Result
```

### 🧠 Modern AI Stack
- **AI Brain**: Gemini 1.5 Flash (Free Tier) - Handles design reasoning and prompt engineering.
- **Rendering Engine**: Stable Diffusion XL (SDXL) - Generators photorealistic architectural shots.
- **Rules Engine**: Mandatory Structural Anchors (TypeScript) - Enforces room identity (e.g., "No sofa in Bedroom").

## 📁 Project Structure

```
vd-assistant/
├── frontend/                 # Next.js 15 frontend
│   ├── src/
│   │   ├── app/             # Next.js App Router pages
│   │   ├── components/      # React components
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   ├── layout/      # Layout components
│   │   │   ├── home/        # Home page sections
│   │   │   ├── design/      # Design wizard steps
│   │   │   └── chat/        # Chat components
│   │   ├── lib/             # Utilities & API
│   │   ├── store/           # Zustand stores
│   │   └── data/            # Mock data
│   └── Dockerfile
│
├── backend/                  # Express.js backend
│   ├── src/
│   │   ├── config/          # Database, Redis, ComfyUI config
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Auth, rate limiting, validation
│   │   ├── models/          # Prisma schema
│   │   ├── repository/      # Data access layer
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic (AI, image)
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Logger, errors
│   └── Dockerfile
│
└── docker-compose.yml        # All services orchestration
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router, SSR/SSG)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **State**: Zustand
- **Animations**: Framer Motion
- **3D**: React Three Fiber (ready for AR previews)
- **Forms**: React Hook Form + Zod
- **HTTP**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Cache/Queue**: Redis + BullMQ
- **File Upload**: Multer
- **Validation**: Zod
- **Logging**: Winston

### AI Services (Self-Hosted)
- **Image Generation**: Stable Diffusion via ComfyUI API
- **Chat LLM**: Ollama with Llama 3.2

## 🚦 Getting Started

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL (or use Docker)
- Redis (or use Docker)

### Quick Start (Development)

1. **Clone the repository**
   ```bash
   cd "Final Year VD Project"
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Start databases with Docker**
   ```bash
   cd ..
   docker-compose up -d postgres redis
   ```

5. **Setup Prisma**
   ```bash
   cd backend
   npx prisma generate --schema=./src/models/prisma/schema.prisma
   npx prisma migrate dev --schema=./src/models/prisma/schema.prisma
   ```

6. **Start backend**
   ```bash
   npm run dev
   ```

7. **Start frontend** (new terminal)
   ```bash
   cd frontend
   npm run dev
   ```

8. **Open in browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Health: http://localhost:3001/health

### Docker Deployment (Production)

```bash
# Build and start all services
docker-compose up --build

# Or start specific services
docker-compose up -d postgres redis
docker-compose up -d backend
docker-compose up -d frontend
```

### AI Services Setup (Optional)

#### Ollama (Chat)
```bash
# Run Ollama container
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama

# Pull Llama 3.2
docker exec -it ollama ollama pull llama3.2
```

#### ComfyUI (Image Generation)
ComfyUI requires a GPU. See [ComfyUI Installation](https://github.com/comfyanonymous/ComfyUI) for setup instructions.

## 📡 API Endpoints

### Designs
- `POST /api/designs` - Create design with image upload
- `POST /api/designs/:id/generate` - Generate AI redesigns
- `GET /api/designs` - Get user's designs
- `GET /api/designs/:id` - Get specific design
- `DELETE /api/designs/:id` - Delete design
- `GET /api/designs/options` - Get styles and room types
- `GET /api/designs/gallery` - Get public gallery
- `GET /api/designs/suggestions` - Get AI suggestions

### Chat
- `POST /api/chat/message` - Send message to AI
- `GET /api/chat` - Get chat history
- `POST /api/chat` - Create new chat
- `DELETE /api/chat/:id` - Delete chat

## 🗃️ Database Schema

```
User
├── id (PK)
├── email
├── name
├── avatar
├── designs[] (relation)
└── chats[] (relation)

Design
├── id (PK)
├── userId (FK → User)
├── originalImage
├── generatedImages[]
├── style
├── roomType
├── budget
├── dimensions
├── status
├── prompt
├── createdAt
└── updatedAt
```

## 🎨 Design Styles

| Style | Description | Color Palette |
|-------|-------------|---------------|
| Modern | Clean lines, bold accents | Navy, Blue, Red, White |
| Minimalist | Less is more | White, Gray, Black |
| Scandinavian | Nordic warmth | White, Cream, Brown, Teal |
| Industrial | Raw materials | Charcoal, Silver, Orange |
| Luxury | Opulent finishes | Black, Gold, Cream |
| Traditional | Classic charm | Brown, Beige, Forest Green |

## 🔧 Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend (.env)
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/vd_assistant
REDIS_URL=redis://localhost:6379
PORT=3001
NODE_ENV=development
COMFYUI_URL=http://localhost:8188
OLLAMA_URL=http://localhost:11434
FRONTEND_URL=http://localhost:3000
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

## 📱 Screenshots

### Landing Page
Modern hero section with gradient backgrounds and floating cards.

### Design Wizard
Step-by-step process: Upload → Room Type → Style → Options → Generate → Results

### Gallery
Filter and search completed designs with likes and views.

### Chat Assistant
Floating AI-powered chat for instant design help.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Stable Diffusion](https://stability.ai/)
- [Ollama](https://ollama.ai/)
- [Framer Motion](https://www.framer.com/motion/)

---

Built with ❤️ for the Final Year VD Project
#   V i r t u a l - I n t e r i o r - D e s i g n e r - A s s i t a n t -  
 