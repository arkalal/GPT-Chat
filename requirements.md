# GPT Chat Project

## Tech Stack

- NextJS v15 - Pure JSX and SCSS - Full stack
- MongoDB - mongoose schema
- AI integration APIs - OpenAI, Anthropic, Google, Deepseek
- UI - Framer Motion and SCSS modules
- Authentication - NextAuth latest version v5
- API Routes - NextJS v15
- RAG integration - Langchain, Pinecone DB, OpenAI
- react-icons for icons
- Deployment - Vercel

## Development and Features

APP Theme - Dark Mode.

### Project Structure Requirements

1. Component Organization:

   - All components must be in the root `/components` directory
   - No components should be in `src/components`
   - Component structure:
     ```
     /components
     ├── ui/           # Reusable UI components
     ├── hooks/        # Custom hooks
     ├── Chat/         # Chat-related components
     └── Layout/       # Layout components
     ```

2. File Format Requirements:

   - All files must be JavaScript (.js)
   - Each component should have its own SCSS module
   - Use BEM methodology for SCSS class naming
   - No inline styles - all styling should be in SCSS modules

3. Import Path Requirements:
   - Use relative paths (../../) instead of @/ aliases
   - All imports should reference the root components directory
   - Example: `import Button from "../../components/ui/button"`

### Dependencies and Configuration Requirements

1. SCSS Configuration:

   - Use `sass` version ^1.69.0 for modern SCSS support
   - Use modern SCSS features and functions
   - Implement proper SCSS module system
   - Use SCSS variables for theme consistency

2. Component Styling:
   - Each component should have a corresponding .scss module file
   - Use BEM methodology for class naming
   - Implement proper dark theme using SCSS variables
   - Use SCSS mixins for reusable styles

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

### Phase 1 Progress (In Development)

1. Initial Setup

   - [x] Project created with Next.js 15
   - [x] Required dependencies installed
   - [x] Basic project structure setup
   - [x] Environment variables configuration
   - [ ] Fix SCSS deprecation warnings
   - [ ] Update Tailwind CSS configuration
   - [ ] Convert all TypeScript files to JavaScript
   - [ ] Move components to root components directory

2. Component Migration Tasks:

   - [ ] Move all components from src/components to /components
   - [ ] Convert all .tsx files to .js
   - [ ] Update import paths in all files
   - [ ] Remove TypeScript types and interfaces
   - [ ] Add JSDoc comments for documentation
   - [ ] Test all components after migration

3. UI Component Updates:

   - [ ] Implement new Button component
   - [ ] Implement new Input component
   - [ ] Implement new Dropdown component
   - [ ] Implement new Modal component
   - [ ] Implement new Toast component
   - [ ] Update all existing components to use new UI components

4. Chat Interface

   - [x] Main chat UI implementation
   - [x] AI models dropdown integration
   - [x] Real-time streaming setup
   - [x] Markdown formatting
   - [x] Code block with syntax highlighting
   - [x] Copy functionality for code blocks

5. Animations & UI

   - [x] Framer Motion integration
   - [x] Dark mode implementation
   - [x] Loading animations
   - [x] Chat transitions
   - [x] Scroll animations

6. API Integration

   - [x] OpenAI setup
   - [x] Anthropic integration
   - [x] Google AI integration
   - [x] API key management page
   - [x] Local storage for API keys

7. Navigation & Layout
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

### Current Issues to Fix:

1. [ ] Convert all styles to SCSS modules
2. [ ] Implement proper SCSS variables for theming
3. [ ] Create mixins for common styles
4. [ ] Update component imports to use SCSS modules
5. [ ] Move all components to root components directory
6. [ ] Update component imports across the application
7. [ ] Fix SCSS color module usage:
   - Replace `color.adjust()` with `rgba()` or SASS `lighten()`/`darken()` functions
   - For transparency adjustments, use `rgba()` directly
   - Example: Change `color.adjust($color-gray-500, $alpha: -0.9)` to `rgba($color-gray-500, 0.1)`
   - Update all instances of color.adjust() across SCSS files

### Recently Fixed Issues:

1. [x] Fixed React Key Prop Error in Chat Interface:
   - Issue: Duplicate keys were being generated when adding messages and streaming responses
   - Root Cause: Using timestamp alone for IDs and batch updates causing race conditions
   - Solution Implemented:
     - Created UUID-like unique IDs combining timestamp and random string
     - Separated user and assistant message additions
     - Added message only after response starts
     - Implemented proper message update logic using array indices
     - Added proper error state handling for missing messages
     - Used AnimatePresence mode="sync" for better animation control
     - Added unique key for typing indicator
   - Impact: Resolved "Encountered two children with the same key" error and improved message handling reliability

### UI Updates Completed:

- [x] Updated chat interface to match v0.dev design
- [x] Implemented gradient title text using SCSS
- [x] Added suggestion buttons with proper SCSS styling
- [x] Improved input field design
- [x] Enhanced overall spacing and layout
- [x] Implemented modern dark theme using SCSS variables
