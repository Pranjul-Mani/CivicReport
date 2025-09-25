"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import IssueForm from "@/components/IssueForm";

export default function EditIssuePage({ params }) {
  const router = useRouter();
  const [issueData, setIssueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [issueId, setIssueId] = useState(null);
  const [error, setError] = useState(null);

 
  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;
    
      setIssueId(resolvedParams.Id);
    }
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!issueId) return; 

    async function fetchIssue() {
      try {
        setLoading(true);
        const res = await fetch(`/api/issues/${issueId}`);
        if (res.ok) {
          const data = await res.json();
          setIssueData(data);
        } else {
          setError("Issue not found");
          setTimeout(() => router.push("/issues"), 2000);
        }
      } catch (error) {
        console.error("Error fetching issue:", error);
        setError("Failed to load issue. Please try again.");
        setTimeout(() => router.push("/issues"), 2000);
      }
      setLoading(false);
    }
    fetchIssue();
  }, [issueId, router]);

  const handleUpdate = (updated) => {
    router.push(`/issues/${issueId}`);
  };

 
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        
          
        
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Issue</h3>
          <p className="text-gray-600">
            Fetching issue details
            <span className="inline-flex ml-1">
              <span className="animate-bounce">.</span>
              <span className="animate-bounce" style={{animationDelay: '0.1s'}}>.</span>
              <span className="animate-bounce" style={{animationDelay: '0.2s'}}>.</span>
            </span>
          </p>
          
        
          <div className="mt-6 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
          </div>
        </div>
      </div>
    );
  }

  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
         
          <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          
         
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
            >
              Try Again
            </button>
            <button 
              onClick={() => router.push("/issues")}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors duration-200 font-medium"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!issueData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => router.back()}
                  className="cursor-pointer inline-flex items-center text-white hover:text-blue-100 mr-4 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                
              </div>
            </div>
          </div>
          
          
          <div className="">
            <IssueForm
              initialData={issueData}
              onSubmit={handleUpdate}
              onCancel={() => router.push("/issues")}
            />
          </div>
        </div>
        
       
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-blue-900 mb-1">Need Help?</h3>
              <p className="text-sm text-blue-700">
                Make sure to provide accurate information about the issue location and detailed description 
                to help authorities resolve the problem effectively.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}