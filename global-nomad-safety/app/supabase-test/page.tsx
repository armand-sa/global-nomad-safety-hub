import SupabaseConnectionTest from "@/components/SupabaseConnectionTest";

export default function SupabaseTestPage() {
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6 max-w-screen-lg mx-auto">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Supabase Connection Test</h1>
          <p className="text-muted-foreground max-w-[700px]">
            This page helps you verify that your Supabase connection is working properly.
          </p>
        </div>

        <SupabaseConnectionTest />

        <div className="bg-muted p-6 rounded-lg mt-6">
          <h2 className="text-xl font-bold mb-4">Supabase Connection Troubleshooting</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Verify your Supabase credentials in <code className="bg-background px-1 py-0.5 rounded">.env.local</code> file:
              <pre className="bg-background p-2 rounded mt-2 overflow-x-auto">
                NEXT_PUBLIC_SUPABASE_URL=your-project-url{"\n"}
                NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
              </pre>
            </li>
            <li>Make sure your Supabase project is active at <a href="https://supabase.com" className="text-primary underline" target="_blank" rel="noopener noreferrer">supabase.com</a></li>
            <li>Check if your browser can access the Supabase domain by visiting your project URL directly</li>
            <li>Ensure there are no network restrictions blocking access to Supabase services</li>
            <li>Check if your Supabase project has Authentication service enabled</li>
          </ol>
        </div>
        
        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Common Auth Error Solutions</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>AuthRetryableFetchError:</strong> This usually indicates a network connectivity issue or CORS problem. Check your internet connection and make sure your Supabase project's URL is correct.</li>
            <li><strong>NEXT_NOT_FOUND errors:</strong> This occurs when trying to access routes that don't exist, like "/test". Use existing routes like "/supabase-test", "/login", or "/".</li>
            <li><strong>Session errors:</strong> Make sure you've run the database migrations to set up the necessary tables and schema.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}