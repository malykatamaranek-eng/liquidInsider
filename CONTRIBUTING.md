# Contributing to LiquidInsider

First off, thank you for considering contributing to LiquidInsider! It's people like you that make this project better.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps which reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots and animated GIFs if possible**
* **Include your environment details** (OS, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior and explain which behavior you expected to see instead**
* **Explain why this enhancement would be useful**

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Follow the JavaScript/TypeScript styleguides
* Include thoughtfully-worded, well-structured tests
* Document new code
* End all files with a newline

## Development Process

### Getting Started

1. **Fork the repository**
   ```bash
   # Click the Fork button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/liquidInsider.git
   cd liquidInsider
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/malykatamaranek-eng/liquidInsider.git
   ```

4. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

### Development Setup

1. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

2. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

3. **Setup database**
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma generate
   npm run seed
   ```

4. **Start development servers**
   ```bash
   # Backend (in one terminal)
   cd backend
   npm run dev
   
   # Frontend (in another terminal)
   cd frontend
   npm run dev
   ```

### Making Changes

1. **Make your changes**
   * Write clean, readable code
   * Follow the existing code style
   * Add comments for complex logic
   * Update documentation if needed

2. **Test your changes**
   ```bash
   # Backend tests
   cd backend
   npm test
   
   # Frontend tests
   cd frontend
   npm test
   ```

3. **Lint your code**
   ```bash
   # Backend
   cd backend
   npm run lint
   
   # Frontend
   cd frontend
   npm run lint
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   # or
   git commit -m "fix: resolve issue with..."
   ```

### Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

* `feat:` - A new feature
* `fix:` - A bug fix
* `docs:` - Documentation only changes
* `style:` - Changes that don't affect code meaning (white-space, formatting)
* `refactor:` - Code change that neither fixes a bug nor adds a feature
* `perf:` - Code change that improves performance
* `test:` - Adding missing tests or correcting existing tests
* `chore:` - Changes to build process or auxiliary tools

Examples:
```
feat: add user wishlist functionality
fix: resolve cart total calculation bug
docs: update API documentation
refactor: simplify product filter logic
```

### Submitting Changes

1. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request**
   * Go to your fork on GitHub
   * Click "New Pull Request"
   * Select your branch
   * Fill in the PR template
   * Submit the PR

3. **Wait for review**
   * Address any feedback
   * Make requested changes
   * Push additional commits if needed

## Styleguides

### TypeScript Styleguide

* Use TypeScript strict mode
* Define types for all function parameters and return values
* Use interfaces for object shapes
* Use enums for fixed sets of values
* Avoid `any` type when possible
* Use meaningful variable names

Example:
```typescript
interface Product {
  id: string;
  name: string;
  price: number;
}

const getProduct = async (id: string): Promise<Product> => {
  // implementation
};
```

### React/Next.js Styleguide

* Use functional components with hooks
* Use TypeScript with proper prop types
* Extract reusable logic into custom hooks
* Keep components small and focused
* Use meaningful component names

Example:
```typescript
interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  // implementation
};
```

### CSS/Tailwind Styleguide

* Use Tailwind utility classes
* Group related utilities together
* Use custom utilities in tailwind.config.js for repeated patterns
* Mobile-first responsive design
* Use meaningful class names for custom CSS

### API Design

* Use RESTful conventions
* Use proper HTTP methods (GET, POST, PUT, DELETE)
* Use proper status codes
* Include proper error messages
* Version your API if making breaking changes
* Document all endpoints

### Database

* Use descriptive model and field names
* Add indexes for frequently queried fields
* Use migrations for schema changes
* Include proper relations
* Add comments for complex queries

## Project Structure

```
liquidInsider/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── routes/         # Route definitions
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Middleware functions
│   │   ├── utils/          # Helper functions
│   │   └── types/          # TypeScript types
│   └── prisma/             # Database schema
├── frontend/
│   ├── app/                # Next.js pages
│   ├── components/         # React components
│   └── lib/                # Utilities and contexts
└── docs/                   # Documentation
```

## Testing

### Backend Testing

* Write unit tests for utilities and services
* Write integration tests for API endpoints
* Test error cases and edge cases
* Mock external dependencies
* Aim for high code coverage

### Frontend Testing

* Write unit tests for utilities
* Write component tests with React Testing Library
* Test user interactions
* Test error states
* Test responsive behavior

## Documentation

* Update README.md if needed
* Update API.md for API changes
* Add JSDoc comments for complex functions
* Update DEPLOYMENT.md for infrastructure changes
* Include examples in documentation

## Review Process

1. At least one maintainer must review and approve
2. All CI checks must pass
3. Code must follow the styleguides
4. Tests must be included
5. Documentation must be updated

## Release Process

1. Version bump in package.json
2. Update CHANGELOG.md
3. Create a git tag
4. Push to main branch
5. GitHub Actions will deploy

## Getting Help

* **Discord:** Join our Discord server
* **Issues:** Open a GitHub issue
* **Email:** dev@liquidinsider.com

## Recognition

Contributors will be recognized in:
* README.md contributors section
* Release notes
* Project website (coming soon)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to LiquidInsider! 🎉
