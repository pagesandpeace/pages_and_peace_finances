import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
      <section className="w-full max-w-4xl mx-auto flex flex-col md:flex-row bg-white/90 rounded-3xl shadow-xl overflow-hidden border border-[rgba(0,0,0,0.05)]">
        {/* LEFT — Brand / Message */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-b from-[#5DA865] to-[#4b8f54] text-[#FAF6F1] p-10 md:w-1/2">
          <div>
            <Image
              src="/logo_black_transparent.svg"
              alt="Pages & Peace Finances Logo"
              width={150}
              height={150}
              className="invert brightness-200"
              priority
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold leading-snug">
              Pages & Peace Finances
            </h2>
            <p className="text-[#f3ede7] text-sm max-w-xs">
              Manage your café’s books with clarity and calm.
            </p>
          </div>

          <p className="text-xs text-[#e6e2dc] mt-8">
            © {new Date().getFullYear()} Pages & Peace. All rights reserved.
          </p>
        </div>

        {/* RIGHT — Form */}
        <div className="flex flex-col justify-center items-center p-8 sm:p-12 md:w-1/2">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </section>
    </main>
  );
}
