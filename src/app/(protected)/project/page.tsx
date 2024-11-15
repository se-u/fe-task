"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { useActionTask, useGetTask } from "@/context/ProjectsContext";
import { TaskList } from "../../components/TaskList";
import { Spin } from "antd";

const ProjectPage = () => {
  const currentDate = new Date();
  const formattedDate = currentDate.toDateString();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const { toggleTask } = useActionTask();
  const { pending, inProgress, completed, tasks, loading } = useGetTask();

  let tasksToDisplay;
  switch (status) {
    case "pending":
      tasksToDisplay = pending;
      break;
    case "in_progress":
      tasksToDisplay = inProgress;
      break;
    case "completed":
      tasksToDisplay = completed;
      break;
    default:
      tasksToDisplay = tasks;
  }

  const greeting = () => {
    const currentHour = currentDate.getHours();
    if (currentHour < 12) {
      return "Good Morning";
    } else if (currentHour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  }
  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-4 w-full h-full">
      <h1 className="text-3xl font-semibold mb-2">
        {greeting()}! 👋
      </h1>
      <p className="text-gray-700 mb-2">Today is {formattedDate}</p>
      <TaskList tasks={tasksToDisplay} handleToggle={toggleTask} disableSubTask={true} />
    </div>
  );
};

export default ProjectPage;
