import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search/SearchBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            CRO Analyst v2.0
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Modern CRO Analyst application with Next.js, TypeScript, PostgreSQL, and vector search capabilities.
          </p>
          <div className="flex justify-center mb-8">
            <SearchBar />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Experiments</CardTitle>
              <CardDescription>
                Browse and search through all CRO experiments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/experiments">
                <Button className="w-full">View All Experiments</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Search</CardTitle>
              <CardDescription>
                Semantic search powered by vector embeddings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/search">
                <Button className="w-full" variant="outline">Advanced Search</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Built with Next.js, TypeScript, PostgreSQL, and pgvector</p>
        </div>
      </div>
    </div>
  );
}
