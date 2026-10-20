# Lab 08 - Validation Results

This document records the actual responses returned by the application for valid and invalid requests (as specified in Task 3, Requirements 6 and 7), along with an explanation of which decorator produced each validation message.

---

### Request 1: Valid POST (Data Transformation & Sanitization)
- **Endpoint**: `POST /api/courses`
- **Payload**:
  ```json
  {
    "code": " cs-420 ",
    "title": " Compilers ",
    "creditHours": 3,
    "instructor": "Dr. Hamza Rauf",
    "department": "Computer Science",
    "tags": ["Theory", "CORE"]
  }
  ```
- **Response Status**: `201 Created`
- **Response Body**:
  ```json
  {
    "code": "CS-420",
    "title": "Compilers",
    "creditHours": 3,
    "instructor": "Dr. Hamza Rauf",
    "department": "Computer Science",
    "tags": ["theory", "core"]
  }
  ```
- **Comment / Decorators**:
  - `@Transform(trimUpper)` stripped leading/trailing spaces and transformed `cs-420` to `CS-420`.
  - `@Transform(trim)` cleaned `title` from `" Compilers "` to `"Compilers"`.
  - `@Transform` on tags converted `["Theory", "CORE"]` to lower-case `["theory", "core"]`.

---

### Request 2: POST with `creditHours: "3"` (Text instead of number)
- **Endpoint**: `POST /api/courses`
- **Payload**:
  ```json
  {
    "code": "CS-421",
    "title": "Compiler Lab",
    "creditHours": "3",
    "instructor": "Dr. Hamza Rauf",
    "department": "Computer Science"
  }
  ```
- **Response Status**: `400 Bad Request`
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "error": "Validation failed",
    "details": [
      "creditHours must be at most 4",
      "creditHours must be at least 1",
      "creditHours must be a whole number"
    ]
  }
  ```
- **Comment / Decorators**:
  - `@IsInt({ message: 'creditHours must be a whole number' })` failed because the incoming value was of type string (`"3"`), not integer.

---

### Request 3: POST with Invalid Code, Short Title, and Exceeded Credits
- **Endpoint**: `POST /api/courses`
- **Payload**:
  ```json
  {
    "code": "CS3",
    "title": "AI",
    "creditHours": 9,
    "instructor": "Dr. Hamza",
    "department": "Data Science"
  }
  ```
- **Response Status**: `400 Bad Request`
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "error": "Validation failed",
    "details": [
      "code must look like CS-301 or CS-301L",
      "title must be at least 3 characters",
      "creditHours must be at most 4"
    ]
  }
  ```
- **Comment / Decorators**:
  - `@Matches(/^CS-\\d{3}L?$/)` produced `"code must look like CS-301 or CS-301L"`.
  - `@MinLength(3)` produced `"title must be at least 3 characters"`.
  - `@Max(4)` produced `"creditHours must be at most 4"`.

---

### Request 4: POST with 6 Tags
- **Endpoint**: `POST /api/courses`
- **Payload**:
  ```json
  {
    "code": "CS-422",
    "title": "Machine Learning",
    "creditHours": 3,
    "instructor": "Dr. Hamza",
    "department": "Data Science",
    "tags": ["1", "2", "3", "4", "5", "6"]
  }
  ```
- **Response Status**: `400 Bad Request`
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "error": "Validation failed",
    "details": [
      "tags must have at most 5 items"
    ]
  }
  ```
- **Comment / Decorators**:
  - `@ArrayMaxSize(5, { message: 'tags must have at most 5 items' })` on `tags` rejected the 6-element array.

---

### Request 5: GET with `minCredits=abc` (Non-numeric Query Parameter)
- **Endpoint**: `GET /api/courses?minCredits=abc`
- **Response Status**: `400 Bad Request`
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "error": "Validation failed",
    "details": [
      "minCredits must be at most 4",
      "minCredits must be at least 1",
      "minCredits must be a whole number"
    ]
  }
  ```
- **Comment / Decorators**:
  - `@Type(() => Number)` transformed `"abc"` to `NaN`.
  - `@IsInt({ message: 'minCredits must be a whole number' })` failed because `NaN` is not an integer.

---

### Request 6: GET with `sort=title` (Disallowed Sort Field)
- **Endpoint**: `GET /api/courses?sort=title`
- **Response Status**: `400 Bad Request`
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "error": "Validation failed",
    "details": [
      "sort can only be \"creditHours\""
    ]
  }
  ```
- **Comment / Decorators**:
  - `@IsIn(['creditHours'], { message: 'sort can only be "creditHours"' })` strictly enforced that only `creditHours` is permitted as a sorting attribute.

---

### Request 7: GET with `abc` as Course Code (Invalid URL Pattern)
- **Endpoint**: `GET /api/courses/abc`
- **Response Status**: `400 Bad Request`
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "error": "Validation failed",
    "details": [
      "code must look like CS-301 or CS-301L"
    ]
  }
  ```
- **Comment / Decorators**:
  - `CodeParamDto` with `@Matches(/^CS-\\d{3}L?$/)` rejected `"abc"` at the parameter validation stage before reaching the service (returning 400 instead of 404).

---

### Request 8: GET `/api/fees/BSCS-023` (Missing Required Query Value)
- **Endpoint**: `GET /api/fees/BSCS-023`
- **Response Status**: `400 Bad Request`
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "error": "Validation failed",
    "details": [
      "creditHours must be at most 24",
      "creditHours must be at least 1",
      "creditHours must be a whole number"
    ]
  }
  ```
- **Comment / Decorators**:
  - In `FeeQueryDto`, `creditHours` is not marked `@IsOptional()`. `@Type(() => Number)` converts missing/undefined to `NaN`, causing `@IsInt`, `@Min(1)`, and `@Max(24)` to reject the request.

---

### Request 9: PATCH with `"code": "CS-999"` (Omitted Field / Forbid Non-Whitelisted)
- **Endpoint**: `PATCH /api/courses/CS-301L`
- **Payload**:
  ```json
  {
    "code": "CS-999"
  }
  ```
- **Response Status**: `400 Bad Request`
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "error": "Validation failed",
    "details": [
      "property code should not exist"
    ]
  }
  ```
- **Comment / Decorators**:
  - `UpdateCourseDto` inherits from `OmitType(CreateCourseDto, ['code'] as const)`. Because `code` is omitted from the DTO, the global pipe's `forbidNonWhitelisted: true` flags it as an unallowed property.

---

### Request 10: POST with Extra Property `"isAdmin": true` (Whitelist / Forbid Non-Whitelisted)
- **Endpoint**: `POST /api/courses`
- **Payload**:
  ```json
  {
    "code": "CS-423",
    "title": "Deep Learning",
    "creditHours": 3,
    "instructor": "Dr. Hamza",
    "department": "Data Science",
    "isAdmin": true
  }
  ```
- **Response Status**: `400 Bad Request`
- **Response Body**:
  ```json
  {
    "statusCode": 400,
    "error": "Validation failed",
    "details": [
      "property isAdmin should not exist"
    ]
  }
  ```
- **Comment / Decorators**:
  - The `forbidNonWhitelisted: true` setting in `createValidationPipe()` detected `isAdmin`, which is not declared on `CreateCourseDto`, and rejected the payload.
