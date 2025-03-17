import { Card } from "@/components/ui/card";

export function Privacy() {
  return (
    <section className="container mx-auto px-4 py-16">
      <Card className="mx-auto max-w-3xl p-8">
        <h2 className="mb-6 text-center text-3xl font-bold">Your Privacy Matters</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            At Yokaizen, we understand the deeply personal nature of journaling. Your entries are 
            encrypted end-to-end, and you maintain full control over your data.
          </p>
          <p>
            Our AI analysis is performed locally when possible, and any cloud processing is done with 
            strict privacy measures in place. Your journal entries are yours alone.
          </p>
        </div>
      </Card>
    </section>
  );
}
