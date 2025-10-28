import Link from "next/link"
import { Logo } from "../icons/logo"

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <Logo />
            <p className="text-sm text-muted-foreground">
              Your next adventure starts here.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-center md:justify-end">
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Contact
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Policies
            </Link>
            <Link href="/vendor-signup" className="text-sm text-muted-foreground hover:text-primary">
              Vendor Signup
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              About Us
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t pt-4 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} GoWorld Tours. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
