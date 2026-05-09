export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border mt-auto">
      <div className="container mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {year} PrintAI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150">
              隐私政策
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150">
              服务条款
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
