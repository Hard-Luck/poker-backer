import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | PokerBacker",
  description: "Privacy policy for PokerBacker.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-full overflow-y-auto bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-3xl space-y-8 rounded-lg border border-border bg-card/60 p-6 shadow-sm sm:p-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            PokerBacker
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">
            Last updated: April 22, 2026
          </p>
        </div>

        <section className="space-y-3">
          <p>
            PokerBacker is a poker staking and bankroll tracking app. We only
            collect the data needed to create your account, run the product, and
            keep your records available to you.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">What We Collect</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm sm:text-base">
            <li>
              Account information such as your name, email address, and
              authentication identifiers.
            </li>
            <li>
              Data you enter into the app, including backers, players, sessions,
              chops, top-ups, notes, and comments.
            </li>
            <li>
              Basic technical data required to operate the service, such as
              session and security information.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">How We Use Data</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm sm:text-base">
            <li>To authenticate users and secure accounts.</li>
            <li>To store, display, and sync poker backing records.</li>
            <li>
              To maintain app reliability, prevent abuse, and diagnose issues.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">How We Share Data</h2>
          <p>
            We do not sell your personal data. Data is only shared with service
            providers needed to run the app, such as authentication,
            infrastructure, and database providers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Data Retention</h2>
          <p>
            We keep your data for as long as your account remains active or as
            needed to operate the service, comply with legal obligations,
            resolve disputes, and enforce our terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Your Choices</h2>
          <p>
            You can request deletion of your account and related data using the
            data deletion process at{" "}
            <a
              className="font-medium underline underline-offset-4"
              href="/data-deletion"
            >
              /data-deletion
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Contact</h2>
          <p>
            For privacy-related questions, contact the project owner through the
            project repository at{" "}
            <a
              className="font-medium underline underline-offset-4"
              href="https://github.com/Hard-Luck/poker-backer"
              rel="noreferrer"
              target="_blank"
            >
              github.com/Hard-Luck/poker-backer
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
