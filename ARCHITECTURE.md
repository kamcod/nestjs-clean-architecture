# Clean Architecture in NestJS

This project follows Clean Architecture principles, ensuring separation of concerns and maintainability.

## Architecture Layers

```
src/
├── core/                          # Business Logic Layer (Domain + Use Cases)
│   ├── domain/                    # Enterprise Business Rules
│   │   ├── entities/              # Domain entities (business objects)
│   │   └── repositories/          # Repository interfaces
│   └── use-cases/                 # Application Business Rules
│
├── application/                   # Application Layer
│   ├── dtos/                      # Data Transfer Objects
│   └── interfaces/                # Application interfaces
│
├── infrastructure/                # Infrastructure Layer
│   ├── database/                  # Database configuration
│   └── repositories/              # Repository implementations
│
├── presentation/                  # Presentation Layer
│   ├── controllers/               # REST API controllers
│   └── modules/                   # NestJS modules
│
└── shared/                        # Shared utilities
    ├── guards/                    # NestJS guards
    ├── interceptors/              # NestJS interceptors
    └── filters/                   # Exception filters
```

## Layer Responsibilities

### 1. Core Layer (Domain + Use Cases)
**Purpose:** Contains business logic independent of frameworks and external dependencies.

- **Entities**: Pure business objects with domain logic
- **Repository Interfaces**: Define contracts for data access (not implementations)
- **Use Cases**: Orchestrate business flows and use domain entities

**Rules:**
- No dependencies on other layers
- No framework-specific code
- Pure TypeScript/JavaScript

### 2. Application Layer
**Purpose:** Defines DTOs and interfaces for communication between layers.

- **DTOs**: Data structures for API requests/responses
- **Interfaces**: Application-level contracts

### 3. Infrastructure Layer
**Purpose:** Implements technical details and external dependencies.

- **Repository Implementations**: Concrete implementations of repository interfaces
- **Database Configuration**: ORM setup, migrations, etc.
- **External Services**: Third-party API integrations

**Rules:**
- Implements interfaces from core layer
- Contains all framework-specific code
- Can depend on core layer

### 4. Presentation Layer
**Purpose:** Handles HTTP requests and user interaction.

- **Controllers**: Handle HTTP requests/responses
- **Modules**: NestJS dependency injection configuration

**Rules:**
- Depends on use cases from core layer
- Only concerned with HTTP and presentation logic

## Dependency Flow

```
Presentation → Application → Core ← Infrastructure
```

- **Presentation** depends on **Use Cases** (core layer)
- **Infrastructure** implements interfaces from **Core**
- **Core** has no dependencies on outer layers (Dependency Inversion Principle)

## Example: User Module

### 1. Domain Entity
```typescript
// src/core/domain/entities/user.entity.ts
export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    // ...
  ) {}
}
```

### 2. Repository Interface
```typescript
// src/core/domain/repositories/user.repository.interface.ts
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
}
```

### 3. Use Case
```typescript
// src/core/use-cases/create-user.use-case.ts
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: CreateUserInput): Promise<User> {
    // Business logic here
  }
}
```

### 4. Repository Implementation
```typescript
// src/infrastructure/repositories/user.repository.ts
@Injectable()
export class UserRepository implements IUserRepository {
  // Concrete implementation (in-memory, TypeORM, Prisma, etc.)
}
```

### 5. Controller
```typescript
// src/presentation/controllers/users.controller.ts
@Controller('users')
export class UsersController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  async createUser(@Body() dto: UserDto) {
    return await this.createUserUseCase.execute(dto);
  }
}
```

### 6. Module (Dependency Injection)
```typescript
// src/presentation/modules/users.module.ts
@Module({
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    {
      provide: IUserRepository,
      useClass: UserRepository, // Can easily swap implementations
    },
  ],
})
export class UsersModule {}
```

## Benefits

1. **Testability**: Easy to unit test use cases without touching the database
2. **Maintainability**: Clear separation of concerns
3. **Flexibility**: Easy to swap implementations (e.g., change from in-memory to PostgreSQL)
4. **Independence**: Business logic is framework-agnostic
5. **Scalability**: Each layer can evolve independently

## Testing Strategy

### Unit Tests
- **Entities**: Test business logic in entities
- **Use Cases**: Mock repository interfaces

### Integration Tests
- **Controllers**: Test HTTP endpoints
- **Repositories**: Test database operations

### Example: Testing Use Case
```typescript
describe('CreateUserUseCase', () => {
  it('should create a user', async () => {
    const mockRepo: IUserRepository = {
      findByEmail: jest.fn().mockResolvedValue(null),
      save: jest.fn().mockImplementation(user => Promise.resolve(user)),
    };

    const useCase = new CreateUserUseCase(mockRepo);
    const result = await useCase.execute({ email: 'test@test.com', name: 'Test' });

    expect(result.email).toBe('test@test.com');
  });
});
```

## Running the Application

```bash
# Install dependencies
npm install

# Run in development mode
npm run start:dev

# Run tests
npm run test
```

## API Endpoints

### Users
- `POST /users` - Create a new user
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID

### Example Request
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "name": "John Doe"}'
```

## Next Steps

1. **Add Database**: Replace in-memory repository with TypeORM/Prisma
2. **Add Authentication**: Implement JWT authentication in use cases
3. **Add Swagger**: Document API with OpenAPI
4. **Add Tests**: Write unit and integration tests
5. **Add Error Handling**: Create custom exception filters
6. **Add Logging**: Implement structured logging
