# GPT Chat Project

## Tech Stack

- NextJS v15 - Pure JSX, JS and SCSS - FUll stack (My current project). No Typescript.
- MongoDB - mongoose schema
- AI integration APIs - OpenAI, Anthropic, Google, Deepseek
- UI (Framer motion, SCSS and other module as required)
- Authentication - NextAuth latest version v5
- API Routes - NextJS v15
- RAG integration - Langchain, Pinecone DB, OpenAI
- react-icons for icons. You may also use other icons libraries as required.
- Deployment - Vercel

## Development and Features

APP Theme - Dark Mode.

### Phase 1

- Create a chat interface
- The chat interface will be the main home page of the app with the nav buttons in the top and other buttons in the swipable sidebar on the left.
- The chat Interface will have all the AI models listed - Which includes all the current models from OpenAI, Anthropic, Google, Deepseek.
- The chat interface will have a text input to enter the prompt and a send button.
- The model will be selected from the AI models list from the left top dropdown of the chat interface.
- While chatting using the models the response must be streamed in realtime and should be fomatted properly with markdowns on the chat interface so that the response looks good and fomatted with spaces, emojis and headings and stuff.
- The chat interface should have a nice UI/UX.
- If the AI models responds code, then the code will be formatted with syntax highlighting, along with a copy button on the top right of the code block. So that the user can copy the code and paste it in the code editor.
- The UI of the app must be extremely advanced with modern animations and transitions using framer-motion and SCSS and with fade in and fade out animations on load and on chat response and on scroll of the chat history Also on scroll of the pages if required.
  Completely in dark mode.
- There must be a API key button on the top left on the nav bar on the top on click of which a new page will open where user can enter the OpenAI, Anthropic, Google and Deepseek API key and save it. Currently the API keys are saved locally in the browser temporarily.
- All the pages and the app should look extremely advanced, smooth with modern UI and slick animations in dark mode.

### Phase 2

## Development Progress

### Phase 1 Progress (In Development)

1. Initial Setup

   - [x] Project created with Next.js 15
   - [x] Required dependencies installed
   - [x] Basic project structure setup
   - [x] Environment variables configuration

2. Chat Interface

   - [x] Main chat UI implementation
   - [x] AI models dropdown integration
   - [x] Real-time streaming setup
   - [x] Markdown formatting
   - [x] Code block with syntax highlighting
   - [x] Copy functionality for code blocks

3. Animations & UI

   - [x] Framer Motion integration
   - [x] Dark mode implementation
   - [x] Loading animations
   - [x] Chat transitions
   - [x] Scroll animations

4. API Integration

   - [x] OpenAI setup
   - [x] Anthropic integration
   - [x] Google AI integration
   - [x] API key management page
   - [x] Local storage for API keys

5. Navigation & Layout
   - [x] Top navigation bar
   - [ ] Swipable sidebar
   - [x] Responsive design
   - [x] Settings menu

Current Status: Core features implemented. Next steps:

1. Implement swipable sidebar
2. Add error handling and fallback UI
3. Test API integrations
4. Add loading states for API key validation
5. Implement proper error messages for API failures

### Code Quality Improvements Completed:

- [x] Fixed import paths to use relative paths (../../) instead of @/ aliases
- [x] Added "use client" directives to all client-side components
- [x] Removed unused UI directory
- [x] Improved code organization and structure

### Next Code Quality Tasks:

- [ ] Add proper TypeScript types (when migrating to TypeScript)
- [ ] Implement error boundaries
- [ ] Add proper loading states
- [ ] Improve component documentation
- [ ] Add unit tests
