# Lab 08 - NestJS: Dependency Injection and DTO Validation (CS-301L)

The Lab 07 Student API, rebuilt in NestJS.

## Setup
```
npm install
```

## Run
```
npm run start:dev                  # auto-restart on save (http://localhost:3000)
STORAGE=memory npm run start:dev   # in-memory store instead of data/students.json
LOG_TO_FILE=true npm run start:dev # FileAppLogger writes to logs/app.log
```
(Windows PowerShell: `$env:STORAGE="memory"; npm run start:dev`)

## Test
```
npm test          # unit + DTO tests
npm run test:e2e  # end-to-end tests (in-memory store)
```
Postman: import `postman/Lab08_Nest_Student_API.postman_collection.json`
and run it with the Collection Runner. Keep `data/students.json` equal to
`data/students.seed.json` before the first run.

## Where things are
| Idea | File |
|---|---|
| String token + `useValue` | `src/core/app-config.ts`, `src/core/core.module.ts` |
| Abstract-class token + `useClass` | `src/common/logger/app-logger.ts` |
| Symbol token + `useFactory` | `src/students/store/student-store.ts`, `src/students/students.module.ts` |
| Constructor injection | `src/students/students.service.ts` |
| DTOs, validation, transformation | `src/students/dto/` |
| Global ValidationPipe | `src/common/pipes/app-validation.pipe.ts`, `src/main.ts` |
