# Hansen backend contract audit — 2026-11-11

Evidence: deployed `/app/app.jar`, copied read-only from `hansen-app` at 185.70.109.92. SHA-256: `4783440e04e72cd2d1a1f8ae709be744c871ee8bed6df62541da8709343c5aa7`. Image creation: 2026-10-02. This is static analysis of Spring controller annotations and DTO field signatures, not authenticated end-to-end verification. Java code was not executed. Application properties, credentials and database records were not read.

## Findings and implementation order

1. Authentication: registration initiate expects email, address, inviteCode. Confirm expects email, verificationCode and optional phoneNumber, not inviteCode/address. Login/refresh return accessToken and refreshToken. Use POST /api/auth/resend-code with email and OtpType (REGISTRATION/RESET_PASSWORD; see enum) rather than restarting registration. No controller mapping for POST /api/auth/google or /api/auth/logout; Spring OAuth2 security handlers exist and need separate callback inspection. Do not send mock-google-token in real mode.
2. Family: GET /api/families/me returns FamilyInfoResponse; member POST/PUT return UserUpdateResponse. Member paths currently align with the deployed controller. Profile image is a protected binary endpoint at /api/families/me/pictures, not avatarUrl in FamilyInfoResponse. Fetch using the access token, render an object URL and revoke it on cleanup. Never send the old UI password field as a profile update: password changes use oldPassword, newPassword and confirmNewPassword.
3. Pool: weekly response contains sessionDate, maxCapacity, bookedCount and status. Current frontend drops these fields and does not filter selected date. Preserve date and capacity/count; never generate demo slots for an empty real schedule. Booking body is {poolSessionId,userIds}; response is an array of individual bookings. Use GET /api/pool/bookings/me/active for the current family. Canceled states differ from REGISTERED. The server also exposes GET /api/families/me/tickets/pool for quotas. Cancel/delete semantics and ticket returns require checking service rules before UI wording.
4. Cinema: list uses full CinemaSessionResponse metadata and posterUrl. Read GET /api/cinema/sessions/{id} for seats with UUID id and seatNumber. Existing hardcoded A1 etc. cannot be posted as seatIds. Body is {userId,cinemaSessionId,seatIds}; decide explicitly which family member owns the booking. Response is an array, one record per seat. Existing GET /api/cinema/bookings?sessionId=... does not match a controller route; use /sessions/{sessionId} or session seat availability. Do not assume a root GET /api/cinema/bookings exists.
5. Reservations: no /api/reservations controller mapping exists. Use family booking history or active pool bookings and cinema data, joining cinema session details where required. Replace localStorage-only listing/cancellation. Group per-seat/per-person rows deliberately; do not treat an array response as one record.
6. Activities: own items use GET /api/activities/me, not /my. dayOfWeek is java.time.DayOfWeek (MONDAY etc.), while UI uses mon/tue; map both ways. No dedicated recurring time field exists; inspect ActivityService interpretation of dateTime before promising time persistence. Images use separate multipart /{id}/images endpoints; sending JSON alone does not upload the cover. Activity ownership/role permissions must be checked with a real account.
7. Gym/materials: no /api/gym/*, /api/reservations or materials controller mappings were found among the deployed application controllers. FacilityController provides a facility catalog and images, not gym sessions/bookings. Gym needs backend work or a clarified product flow; do not invent endpoints.
8. Facilities: GET /api/facilities returns id, code, name, description, imageUrl, targetRoute, active. Home currently uses a static catalog. Map recognized internal routes and respect active state; authenticated image loading may be needed.

## Verification limits

Public HTTP requests reach the backend and protected resources return 401. CORS preflight permits localhost:5173 and 127.0.0.1:5173. A 401 does not prove a route exists; controller annotations above provide static route evidence. No users, bookings, email sends or remote changes were created. Test account/invite and allowed test data operations are still required for live flow verification. Source repository is helpful but not required for this static inventory.

## Rough effort

One developer: 5–9 working days for supported frontend integration plus live validation, assuming a usable account and existing services behave as inferred. Gym backend, materials, production HTTPS, and server hardening are separate scope. Static findings are concrete; final estimates depend on authenticated error behavior and role restrictions.

## Controller inventory

All methods include administrative endpoints; presence does not imply resident authorization.

### ActivityController

| Method | Path |
|---|---|
| GET | `/api/activities` |
| GET | `/api/activities/me` |
| POST | `/api/activities` |
| GET | `/api/activities/{id}` |
| PUT | `/api/activities/{id}` |
| DELETE | `/api/activities/{id}` |
| POST | `/api/activities/{id}/images` |
| GET | `/api/activities/{id}/images` |
| PUT | `/api/activities/{id}/images` |
| DELETE | `/api/activities/{id}/images` |

### AdminController

| Method | Path |
|---|---|
| GET | `/api/admins` |
| POST | `/api/admins` |
| PUT | `/api/admins/{id}` |
| DELETE | `/api/admins/{id}` |
| GET | `/api/admins/families` |
| POST | `/api/admins/families` |
| POST | `/api/admins/families/{familyId}/roles/activity` |
| DELETE | `/api/admins/families/{familyId}/roles/activity` |
| DELETE | `/api/admins/families` |
| POST | `/api/admins/families/{id}/members` |

### AuthController

| Method | Path |
|---|---|
| POST | `/api/auth/register/initiate` |
| POST | `/api/auth/register/confirm` |
| POST | `/api/auth/login` |
| POST | `/api/auth/refresh` |
| POST | `/api/auth/password/forgot` |
| POST | `/api/auth/password/reset` |
| POST | `/api/auth/admins/login/initiate` |
| POST | `/api/auth/admins/login/confirm` |
| POST | `/api/auth/resend-code` |

### CinemaBookingController

| Method | Path |
|---|---|
| POST | `/api/cinema/bookings` |
| GET | `/api/cinema/bookings/{id}` |
| GET | `/api/cinema/bookings/users/{userId}` |
| GET | `/api/cinema/bookings/sessions/{sessionId}` |
| DELETE | `/api/cinema/bookings/{id}` |
| GET | `/api/cinema/bookings/history/families/{id}` |
| POST | `/api/cinema/bookings/{id}/cancel` |
| POST | `/api/cinema/bookings/{id}/uncancel` |

### CinemaHallController

| Method | Path |
|---|---|
| POST | `/api/cinema/halls` |
| GET | `/api/cinema/halls/{hallId}/seats` |
| PUT | `/api/cinema/halls/{hallId}` |
| DELETE | `/api/cinema/halls/{hallId}` |

### CinemaSessionController

| Method | Path |
|---|---|
| POST | `/api/cinema/sessions` |
| GET | `/api/cinema/sessions/{id}` |
| GET | `/api/cinema/sessions/week` |
| PUT | `/api/cinema/sessions/{id}` |
| DELETE | `/api/cinema/sessions/{id}` |
| POST | `/api/cinema/sessions/{id}/cancel` |
| POST | `/api/cinema/sessions/{id}/uncancel` |
| POST | `/api/cinema/sessions/{id}/poster` |
| GET | `/api/cinema/sessions/{id}/poster` |
| PUT | `/api/cinema/sessions/{id}/poster` |
| DELETE | `/api/cinema/sessions/{id}/poster` |

### FacilityController

| Method | Path |
|---|---|
| GET | `/api/facilities` |
| POST | `/api/facilities/{id}/images` |
| GET | `/api/facilities/{id}/images` |
| PUT | `/api/facilities/{id}/images` |
| DELETE | `/api/facilities/{id}/images` |

### FamilyController

| Method | Path |
|---|---|
| PUT | `/api/families/me` |
| GET | `/api/families/me` |
| DELETE | `/api/families/me` |
| POST | `/api/families/me/members` |
| PUT | `/api/families/members/{id}` |
| DELETE | `/api/families/members/{id}` |
| GET | `/api/families/me/tickets/pool` |
| GET | `/api/families/me/bookings/history` |
| GET | `/api/families/me/pictures` |
| POST | `/api/families/me/pictures` |
| DELETE | `/api/families/me/pictures` |
| PUT | `/api/families/me/pictures` |
| GET | `/api/families/{id}` |
| PUT | `/api/families/{id}` |
| DELETE | `/api/families/{id}` |
| GET | `/api/families/{id}/pictures` |

### PoolBookingController

| Method | Path |
|---|---|
| POST | `/api/pool/bookings` |
| GET | `/api/pool/bookings/{id}` |
| GET | `/api/pool/bookings/sessions/{sessionId}` |
| GET | `/api/pool/bookings/families/{familyId}` |
| GET | `/api/pool/bookings/users/{userId}` |
| DELETE | `/api/pool/bookings/{id}` |
| GET | `/api/pool/bookings/me/active` |
| DELETE | `/api/pool/bookings/sessions/{sessionId}` |

### PoolSessionController

| Method | Path |
|---|---|
| POST | `/api/pool/sessions` |
| GET | `/api/pool/sessions/{id}` |
| GET | `/api/pool/sessions/week` |
| PUT | `/api/pool/sessions/{id}` |
| DELETE | `/api/pool/sessions/{id}` |
| POST | `/api/pool/sessions/{id}/cancel` |
| POST | `/api/pool/sessions/{id}/uncancel` |
| POST | `/api/pool/sessions/cancel-by-day` |
| POST | `/api/pool/sessions/uncancel-by-day` |

### PoolTemplateController

| Method | Path |
|---|---|
| GET | `/api/pool/templates` |
| POST | `/api/pool/templates` |
| POST | `/api/pool/templates/generate` |

## DTO fields

These are compiled field signatures. Required/optional and validation rules need annotation inspection; types alone are not a complete OpenAPI schema.

### ActivityRequest

```text
java.lang.String title
java.lang.String description
com.hansenvillage.hansenapp.entity.ActivityType type
java.lang.String phoneNumber
java.util.List<java.time.DayOfWeek> dayOfWeek
java.lang.String location
java.time.LocalDateTime dateTime
```

### ActivityResponse

```text
java.util.UUID id
java.lang.String title
java.lang.String description
java.lang.String imageUrl
com.hansenvillage.hansenapp.entity.ActivityType type
java.lang.String phoneNumber
java.util.List<java.time.DayOfWeek> dayOfWeek
java.time.LocalDateTime dateTime
java.lang.String location
```

### AddMemberRequest

```text
java.lang.String name
java.lang.Integer age
```

### CinemaBookingRequest

```text
java.util.UUID userId
java.util.UUID cinemaSessionId
java.util.List<java.util.UUID> seatIds
```

### CinemaBookingResponse

```text
java.util.UUID bookingId
java.util.UUID cinemaSessionId
java.util.UUID userId
java.util.UUID seatId
```

### CinemaDaysScheduleRequest

```text
java.time.LocalDate sessionDate
java.util.List<com.hansenvillage.hansenapp.dto.CinemaSessionSlotRequest> sessions
```

### CinemaHallRequest

```text
java.lang.String name
```

### CinemaHallResponse

```text
java.util.UUID hallId
java.lang.String name
java.util.List<com.hansenvillage.hansenapp.dto.CinemaSeatResponse> seats
```

### CinemaSeatRequest

```text
java.lang.String seatNumber
```

### CinemaSeatResponse

```text
java.util.UUID id
java.lang.String seatNumber
com.hansenvillage.hansenapp.entity.CinemaSeatStatus status
```

### CinemaSeatWithAvailableResponse

```text
java.util.UUID id
java.lang.String seatNumber
com.hansenvillage.hansenapp.entity.CinemaSeatStatus status
```

### CinemaSessionRequest

```text
java.lang.String movieName
java.time.LocalDateTime startAt
int duration
java.lang.Integer year
java.lang.String ageRating
java.lang.String description
java.util.List<com.hansenvillage.hansenapp.entity.CinemaSessionGenre> genre
com.hansenvillage.hansenapp.entity.CinemaSessionType type
com.hansenvillage.hansenapp.entity.SessionStatus status
```

### CinemaSessionResponse

```text
java.util.UUID id
java.lang.String movieName
java.time.LocalDateTime startAt
java.lang.Integer duration
java.lang.Integer year
java.lang.String ageRating
java.util.List<com.hansenvillage.hansenapp.entity.CinemaSessionGenre> genre
java.lang.String description
com.hansenvillage.hansenapp.entity.CinemaSessionType type
java.lang.String posterUrl
com.hansenvillage.hansenapp.entity.SessionStatus status
```

### CinemaSessionSlotRequest

```text
java.lang.String movieName
java.time.LocalDateTime startAt
int duration
java.lang.Integer year
java.lang.String ageRating
java.lang.String description
java.util.List<com.hansenvillage.hansenapp.entity.CinemaSessionGenre> genre
com.hansenvillage.hansenapp.entity.CinemaSessionType type
java.util.UUID hallId
```

### CinemaSessionWithSeatsResponse

```text
java.util.UUID id
java.lang.String movieName
java.time.LocalDateTime startAt
java.lang.Integer duration
java.lang.String description
java.lang.String posterImage
java.util.List<com.hansenvillage.hansenapp.dto.CinemaSeatResponse> seats
```

### FacilityResponse

```text
java.util.UUID id
java.lang.String code
java.lang.String name
java.lang.String description
java.lang.String imageUrl
java.lang.String targetRoute
boolean active
```

### FamilyBookingHistoryResponse

```text
java.util.List<com.hansenvillage.hansenapp.dto.PoolBookingResponse> poolBookings
java.util.List<com.hansenvillage.hansenapp.dto.CinemaBookingResponse> cinemaBookings
```

### FamilyInfoResponse

```text
java.util.UUID id
java.lang.String email
java.lang.String address
java.lang.String phoneNumber
int memberCount
java.util.List<com.hansenvillage.hansenapp.dto.UserResponse> members
```

### FamilyRegistrationRequest

```text
java.lang.String email
java.lang.String phoneNumber
java.lang.String verificationCode
```

### FamilyRegistrationResponse

```text
java.util.UUID id
java.lang.String email
java.lang.String address
```

### FamilyUpdateRequest

```text
java.lang.String oldPassword
java.lang.String newPassword
java.lang.String confirmNewPassword
java.lang.String email
java.lang.String address
java.lang.String phoneNumber
```

### FamilyUpdateResponse

```text
java.util.UUID id
java.lang.String email
java.lang.String address
java.lang.String phoneNumber
```

### ForgotPasswordRequest

```text
java.lang.String email
```

### LoginRequest

```text
java.lang.String email
java.lang.String password
```

### LoginResponse

```text
java.lang.String accessToken
java.lang.String refreshToken
```

### MessageResponse

```text
java.lang.String message
```

### PoolBookingRequest

```text
java.util.List<java.util.UUID> userIds
java.util.UUID poolSessionId
```

### PoolBookingResponse

```text
java.util.UUID bookingId
java.util.UUID poolSessionId
java.util.UUID userId
java.lang.String userName
java.lang.Integer userAge
com.hansenvillage.hansenapp.entity.PoolBookingStatus status
java.time.LocalDate sessionDate
java.time.LocalTime startTime
java.time.LocalTime endTime
```

### PoolDaysScheduleRequest

```text
java.time.LocalDate sessionDate
java.util.List<com.hansenvillage.hansenapp.dto.PoolSessionSlotsRequest> sessions
```

### PoolSessionRequest

```text
java.time.LocalTime startTime
java.time.LocalTime endTime
java.lang.Integer maxCapacity
com.hansenvillage.hansenapp.entity.SessionStatus status
java.time.LocalDate sessionDate
```

### PoolSessionResponse

```text
java.util.UUID id
java.time.LocalDate sessionDate
java.time.LocalTime startTime
java.time.LocalTime endTime
java.lang.Integer maxCapacity
java.lang.Integer bookedCount
java.lang.String status
```

### PoolSessionSlotsRequest

```text
java.time.LocalTime startTime
java.time.LocalTime endTime
int maxCapacity
```

### PoolTicketsResponse

```text
long maxTickets
long remainingTickets
java.time.LocalDateTime resetTime
```

### RefreshRequest

```text
java.lang.String refreshToken
```

### RegistrationInitiateRequest

```text
java.lang.String email
java.lang.String address
java.lang.String inviteCode
```

### ResendCodeRequest

```text
java.lang.String email
com.hansenvillage.hansenapp.entity.OtpType type
```

### ResetPasswordRequest

```text
java.lang.String email
java.lang.String verificationCode
java.lang.String newPassword
java.lang.String confirmPassword
```

### ResponseError

```text
int status
java.lang.String message
```

### UserResponse

```text
java.util.UUID id
java.lang.String name
java.lang.Integer age
```

### UserUpdateRequest

```text
java.lang.String name
java.lang.Integer age
```

### UserUpdateResponse

```text
java.util.UUID id
java.lang.String name
java.lang.Integer age
```
