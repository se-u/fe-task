import { Badge } from "antd";
import dayjs from "dayjs";

  // Utility functions for priority and status badges
  export const getPriorityBadge = (priority: string) => {
    const color = priority === "high" ? "red" : priority === "medium" ? "orange" : "green";
    return <Badge color={color} text={priority.charAt(0).toUpperCase() + priority.slice(1)} />;
  };


  export const getStatusBadge = (status: string) => {
    const color = status === "completed" ? "blue" : status === "in-progress" ? "purple" : "gray";
    return <Badge color={color} text={status.charAt(0).toUpperCase() + status.slice(1)} />;
  };


  export  const formatDueDate = (dueDate: string) => {
    const date = dayjs(dueDate);
    if (date.isSame(dayjs(), "day")) return "Today";
    return date.fromNow();
  };

  // Fixed color options
const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500"];

// Hash function to assign a consistent color based on project name
export const getColorForProject = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return "bg-red-200";
};