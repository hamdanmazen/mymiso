import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function HeroBanner() {
  return (
    <section className="mt-6 rounded-large overflow-hidden bg-surface-raised border border-border-default">
      <div className="flex flex-col md:flex-row items-center gap-8 p-8 md:p-12">
        <div className="flex-1 space-y-4">
          <Badge variant="flash" pulse>
            Grand Opening
          </Badge>
          <h1 className="text-[32px] sm:text-[48px] font-bold tracking-tight leading-[1.1]">
            Sell Fast.{" "}
            <span className="text-mizo-red">Shop Better.</span>
          </h1>
          <p className="text-text-secondary text-[16px] leading-relaxed max-w-lg">
            Discover thousands of products from verified sellers. From
            electronics to fashion, find everything you need on Mymiso.
          </p>
          <div className="flex gap-3 pt-2">
            <Link href="/products">
              <Button size="lg">Start Shopping</Button>
            </Link>
            <Link href="/signup">
              <Button variant="secondary" size="lg">
                Start Selling
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="w-64 h-64 rounded-large bg-gradient-to-br from-mizo-red/20 via-mizo-teal/10 to-mizo-cream/20 flex items-center justify-center border border-border-subtle">
            <div className="text-center space-y-2">
              <span className="text-[48px]">🛍️</span>
              <p className="text-text-muted text-[13px]">
                Your marketplace awaits
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
