
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import IssueCard from "@/components/IssueCard";

export default function IssuesPage() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchIssues() {
    setLoading(true);
    try {
      const res = await fetch("/api/issues");
      const data = await res.json();
      setIssues(data);
    } catch (err) {
      console.error("Failed to fetch issues", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchIssues();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">All Complaints</h1>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : issues.length === 0 ? (
        <div>No complaints yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map((issue) => (
            <IssueCard key={issue._id} issue={issue} onDeleted={fetchIssues} />
          ))}
        </div>
      )}
    </div>
  );
}
