# Next.js App Router Starter

Minimal Next.js 13+ App Router setup following the agreed structure.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file with the API key:

```bash
cp .env.example .env.local
```

Edit `.env.local` and set your key:

```bash
KSENSE_API_KEY="your_api_key_here"
```

## Run

```bash
npm run dev
```

## Structure

```
app/
  layout.tsx
  page.tsx
  dashboard/
    page.tsx
    loading.tsx
  api/
    users/
      route.ts
components/
  ui/
    Button.tsx
  forms/
    UserForm.tsx
lib/
  services/
    userService.ts
models/
  user.ts
types/
  api.ts
```

## Notes

- Server-side API access lives in `app/api/users/route.ts`.
- External API fetch logic lives in `lib/services/userService.ts`.
