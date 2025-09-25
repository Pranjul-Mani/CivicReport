
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function IssueDetailPage() {
  const { Id } = useParams();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();

  async function fetchIssue() {
    setLoading(true);
    try {
      const res = await fetch(`/api/issues/${Id}`);
      if (res.ok) {
        const data = await res.json();
        setIssue(data);
      } else {
        console.error("Failed to fetch issue", await res.text());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (Id) fetchIssue();
  }, [Id]);

  async function handleDelete() {
    if (!confirm("Delete this complaint?")) return;
    const res = await fetch(`/api/issues/${Id}`, { method: "DELETE" });
    if (res.status === 204) {
      router.push("/issues");
    } else {
      const txt = await res.text();
      alert("Delete failed: " + txt);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!issue) return <div>Not found</div>;

  const isOwner = session?.user?.id === issue.createdBy;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex items-start gap-4">
        <h1 className="text-2xl font-semibold">{issue.title}</h1>
        <div className="ml-auto flex gap-2">
          {isOwner && (
            <>
              <button
                onClick={() => router.push(`/issues/${Id}/edit`)}
                className="btn btn-outline cursor-pointer"
              >
                Edit
              </button>
              <button onClick={handleDelete} className="btn btn-danger cursor-pointer">
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded p-4 shadow">
        {issue.image?.url && <img src={issue.image.url} alt="issue image" className="w-full max-h-96 object-cover mb-4" />}
        <p className="mb-2"><strong>Category:</strong> {issue.category}</p>
        <p className="mb-2"><strong>Priority:</strong> {issue.priority}</p>
        <p className="mb-2"><strong>Location:</strong> {issue.location}</p>
        <p className="mb-4"><strong>Description:</strong><br/>{issue.description}</p>
        <p className="text-sm text-gray-500">Reported on: {new Date(issue.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
}
