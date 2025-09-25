//app/issues/[id]/edit/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import IssueForm from "@/components/IssueForm";

export default function EditIssuePage({ params }) {
  const router = useRouter();
  const [issueData, setIssueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [issueId, setIssueId] = useState(null);

  // Resolve params asynchronously
  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;
      // Use 'Id' (capital I) to match your route structure
      setIssueId(resolvedParams.Id);
    }
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!issueId) return; // Wait for issueId to be resolved

    async function fetchIssue() {
      try {
        const res = await fetch(`/api/issues/${issueId}`);
        if (res.ok) {
          const data = await res.json();
          setIssueData(data);
        } else {
          alert("Issue not found");
          router.push("/issues");
        }
      } catch (error) {
        console.error("Error fetching issue:", error);
        alert("Failed to load issue");
        router.push("/issues");
      }
      setLoading(false);
    }
    fetchIssue();
  }, [issueId, router]);

  const handleUpdate = (updated) => {
    router.push(`/issues/${issueId}`);
  };

  if (loading) return <p>Loading...</p>;
  if (!issueData) return null;

  return (
    <IssueForm
      initialData={issueData}
      onSubmit={handleUpdate}
      onCancel={() => router.push("/issues")}
    />
  );
}