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
    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1">
     
      {issue.image?.url && (
        <div className="relative overflow-hidden">
          <img 
            src={issue.image.url} 
            alt={issue.title} 
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      )}

      
      <div className="p-5">
  
        <div className="mb-3">
         
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-200 flex-1 mr-3">
              Issue : {issue.title}
            </h3>
            <div className="flex items-center text-sm text-gray-500 flex-shrink-0">
              <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium">Location : {issue.location}</span>
            </div>
          </div>
        </div>

      
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          Description : {issue.description?.slice(0, 140)}
          {issue.description?.length > 140 ? "..." : ""}
        </p>

       
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        
          <Link 
            href={`/issues/${issue._id}`} 
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md transform hover:scale-105"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Details
          </Link>

          
          {isOwner && (
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => router.push(`/issues/${issue._id}/edit`)} 
                className="cursor-pointer inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 hover:shadow-sm transform hover:scale-105"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              
              <button 
                onClick={handleDelete} 
                className="cursor-pointer inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 hover:shadow-sm transform hover:scale-105"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
}