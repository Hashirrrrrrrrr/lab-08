# Lab 08 Answers

### (a) Why can an interface not be an injection token?
TypeScript interfaces are pure design-time constructs that are completely removed during transpilation to JavaScript, meaning they do not exist at runtime. Because NestJS performs dependency resolution at runtime via JavaScript metadata reflection, injection tokens must exist at runtime (such as strings, Symbols, or classes/abstract classes). An interface cannot serve as an injection token because there is no runtime artifact for NestJS to identify or look up in the IoC container.

### (b) What does it mean that a provider is a singleton?
In NestJS, providers have a singleton scope by default within the application context. This means NestJS instantiates the provider exactly once during application bootstrapping and caches that single instance in memory. Any class or module requesting that provider receives a reference to the exact same shared instance throughout the lifetime of the application.

### (c) What must you write so that OtherModule can use CoursesService?
First, inside `CoursesModule`, you must export `CoursesService` in the `exports` array (`exports: [CoursesService]`). Second, inside `OtherModule`, you must import `CoursesModule` in its `imports` array (`imports: [CoursesModule]`). Once both steps are configured, `CoursesService` can be injected via constructor injection into any controller or provider inside `OtherModule`.
