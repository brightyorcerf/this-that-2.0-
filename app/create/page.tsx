"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function CreatePoll() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async () => {
    if (!title) return;
    setLoading(true);

    try {
      const res = await fetch("/api/poll/create", {
        method: "POST",
        body: JSON.stringify({ title }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      
      // Redirect to the upload page with the generated token
      router.push(`/upload/${data.slug}?token=${data.upload_token}`);
    } catch (err) {
      console.error("Failed to create poll", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create New Mash</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Poll Title</label>
            <Input 
              placeholder="e.g., Best Pizza in NY" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <Button 
            className="w-full" 
            onClick={handleCreate} 
            disabled={loading || !title}
          >
            {loading ? "Creating..." : "Create & Start Uploading"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}