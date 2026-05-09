import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <main className="min-h-screen bg-background px-6 py-24">
      <div className="container mx-auto max-w-2xl">
        <p className="text-sm text-muted-foreground mb-4">About</p>
        <h1 className="text-4xl font-semibold text-foreground mb-6 tracking-tight sm:text-5xl">
          A small starter with room to grow.
        </h1>
        <p className="text-base leading-8 text-muted-foreground">
          TanStack Start gives you type-safe routing, server functions, and
          modern SSR defaults. Use this as a clean foundation, then layer in
          your own routes, styling, and add-ons.
        </p>
      </div>
    </main>
  )
}
