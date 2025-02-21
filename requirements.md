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

4. If you are using React hooks in any functional component, always use "use client" at the top of the component file.

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
   - [x] Fix SCSS deprecation warnings
   - [x] Update Tailwind CSS configuration
   - [x] Convert all TypeScript files to JavaScript
   - [x] Move components to root components directory

2. Component Migration Tasks:

   - [x] Move all components from src/components to /components
   - [x] Convert all .tsx files to .js
   - [x] Update import paths in all files
   - [x] Remove TypeScript types and interfaces
   - [x] Add JSDoc comments for documentation
   - [x] Test all components after migration

3. UI Component Updates:

   - [x] Implement new Button component
   - [x] Implement new Input component
   - [x] Implement new Dropdown component
   - [x] Implement new Modal component
   - [x] Implement new Toast component
   - [x] Update all existing components to use new UI components
   - [x] Add click-outside behavior to dropdowns
   - [x] Update model list with latest AI models

4. Chat Interface

   - [x] Main chat UI implementation
   - [x] AI models dropdown integration
   - [x] Real-time streaming setup
   - [x] Markdown formatting
   - [x] Code block with syntax highlighting
   - [x] Copy functionality for code blocks
   - [x] Elegant background with floating shapes
   - [x] Homepage with animated title and suggestions
   - [x] Smooth transitions between home and chat states
   - [x] Click-outside handling for dropdowns
   - [x] Updated AI models list with latest versions

5. Animations & UI

   - [x] Framer Motion integration
   - [x] Dark mode implementation
   - [x] Loading animations
   - [x] Chat transitions
   - [x] Scroll animations
   - [x] Floating background shapes
   - [x] Title gradient animations
   - [x] Suggestion button hover effects

6. API Integration

   - [x] OpenAI setup
   - [x] Anthropic integration
   - [x] Google AI integration
   - [x] API key management page
   - [x] Local storage for API keys
   - [x] Support for latest model versions
   - [x] Removed deprecated model versions

7. Navigation & Layout
   - [x] Top navigation bar
   - [ ] Swipable sidebar
   - [x] Responsive design
   - [x] Settings menu

### Recently Completed Features:

1. [x] Updated app name and metadata to "AI Hub - Your Universal AI Assistant"
2. [x] Enhanced homepage title to "Your Gateway to AI Excellence"
3. [x] Updated platform description to be more concise and impactful
4. [x] Added proper spacing between prompt suggestions and platform title
5. [x] Removed top description sentence from homepage
6. [x] Reordered homepage elements to show suggestions first
7. [x] Added elegant floating background shapes
8. [x] Implemented gradient title animations
9. [x] Added smooth transitions between home and chat states
10. [x] Improved suggestion buttons with hover effects and backdrop blur
11. [x] Fixed homepage layout with proper spacing
12. [x] Added conditional rendering for chat/home states
13. [x] Implemented proper z-indexing for all elements
14. [x] Fixed chat bubble animations to remove blinking effect
15. [x] Updated chat message hover effects for better stability
16. [x] Improved dark theme consistency in chat interface
17. [x] Optimized message transitions and animations
18. [x] Enhanced chat bubble shadows and gradients
19. [x] Added click-outside behavior to model dropdown
20. [x] Updated AI models to latest available versions
21. [x] Removed deprecated model versions
22. [x] Improved dropdown UI with provider grouping

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
8. [ ] Implement consistent animation timing across components
9. [ ] Add proper transition states for all interactive elements
10. [ ] Optimize backdrop blur performance
11. [ ] Add fallback styles for browsers that don't support backdrop-filter

### Next Steps:

1. Implement swipable sidebar
2. Add error handling and fallback UI
3. Test API integrations
4. Add loading states for API key validation
5. Implement proper error messages for API failures
6. Add user settings persistence
7. Implement chat history storage
8. Optimize chat message rendering performance
9. Add proper scroll restoration
10. Implement message grouping by time
