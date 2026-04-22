import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Deletion | PokerBacker",
  description: "How to request account and data deletion for PokerBacker.",
};

export default function DataDeletionPage() {
  return (
    <main className="min-h-full overflow-y-auto bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-3xl space-y-8 rounded-lg border border-border bg-card/60 p-6 shadow-sm sm:p-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            PokerBacker
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Data Deletion</h1>
          <p className="text-sm text-muted-foreground">
            Last updated: April 22, 2026
          </p>
        </div>

        <section className="space-y-3">
          <p>
            If you want your PokerBacker account and its associated data
            deleted, use one of the methods below.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            Option 1: Delete From Your Account
          </h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm sm:text-base">
            <li>Sign in to PokerBacker.</li>
            <li>
              Open the account menu in the top-right user profile control.
            </li>
            <li>Go to account management and delete your account.</li>
          </ol>
          <p>
            This removes access to the app and starts deletion of the data tied
            to your account.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            Option 2: Request Deletion Manually
          </h2>
          <p>
            If you cannot access your account, contact the project owner through{" "}
            <a
              className="font-medium underline underline-offset-4"
              href="https://github.com/Hard-Luck/poker-backer"
              rel="noreferrer"
              target="_blank"
            >
              github.com/Hard-Luck/poker-backer
            </a>
            and include the email address associated with your account.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">What Gets Deleted</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm sm:text-base">
            <li>Your account profile data.</li>
            <li>
              Your poker backing records, including sessions, chops, top-ups,
              comments, and notes associated with your account.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Retention Exceptions</h2>
          <p>
            We may retain limited information where required for security, fraud
            prevention, legal compliance, or dispute resolution.
          </p>
        </section>
      </div>
    </main>
  );
}
