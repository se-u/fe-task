'use client'
import { useEffect } from "react";
import { ProjectList } from "../components/ProjectList";
import { ProjectsProvider } from "../../context/ProjectsContext";

export default function ProctectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  useEffect(() => {
    console.log("Protected layout");
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);
  return (
    <ProjectsProvider>
        <div className="flex flex-wrap h-screen w-screen overflow-y-hidden">
          <div className="w-1/4 h-full">
            <ProjectList />
          </div>
          <div className="w-[75%] p-4 bg-slate-100 h-full ">{children}</div>
        </div>
    </ProjectsProvider>
  );
}
