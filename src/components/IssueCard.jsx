"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function IssueCard({ issue, onDeleted }) {
  const { data: session } = useSession();
  const router = useRouter();

  async function handleDelete(e) {
    e.preventDefault();
    if (!confirm("Delete this complaint?")) return;
    const res = await fetch(`/api/issues/${issue._id}`, { method: "DELETE" });
    if (res.status === 204) {
      if (typeof onDeleted === "function") onDeleted();
    } else {
      const t = await res.text();
      alert("Failed to delete: " + t);
    }
  }

  const isOwner = session?.user?.id === issue.createdBy;

  return (
    <div className="border rounded-md overflow-hidden shadow-sm bg-white">
      {issue.image?.url && <img src={issue.image.url} alt={issue.title} className="w-full h-44 object-cover" />}
      <div className="p-4">
        <h3 className="text-lg font-semibold">{issue.title}</h3>
        <p className="text-sm text-gray-600">{issue.location}</p>
        <p className="mt-2 text-sm text-gray-700">{issue.description?.slice(0, 140)}{issue.description?.length > 140 ? "..." : ""}</p>
        <div className="mt-3 flex items-center justify-between">
          <Link href={`/issues/${issue._id}`} className="text-blue-600">
            View
          </Link>

          <div>
            {isOwner && (
              <>
                <button onClick={() => router.push(`/issues/${issue._id}/edit`)} className="mr-2 text-sm cursor-pointer">
                  Edit
                </button>
                <button onClick={handleDelete} className="text-sm text-red-600 cursor-pointer">
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
