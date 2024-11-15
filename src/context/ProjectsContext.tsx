"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { makeApiCall } from "@/utils/makeApiCall";
import { Project, Task } from "@/utils/api";

interface ProjectsContextProps {
  projects: Project[];
  project: Project | null;
  projectTask: Task[];
  tasks: Task[];
  projectLoading: boolean;
  taskLoading: boolean;
  error: Error | null;
  fetchProjects: () => void;
  fetchProject: (id: number) => void;
  addProject: (project: Omit<Project, "id">) => void;
  deleteProject: (id: number) => void;
  updateProject: (id: number, project: Partial<Project>) => void;
  toggleTask: (task: Task) => Promise<void>;
  createTask: (task: Omit<Task, "id">) => Promise<void>;
  updateTask: (taskId: number, task: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: number) => Promise<void>;
}

const ProjectsContext = createContext<ProjectsContextProps | undefined>(
  undefined
);

export const ProjectsProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskLoading, setTaskLoading] = useState(true);
  const [projectLoading, setProjectLoading] = useState(true);
  const [projectTask, setProjectTask] = useState<Task[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setProjectLoading(true);
    fetchProjects();

  }, []);

  useEffect(() => {
    setTaskLoading(true);
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await makeApiCall("/tasks", "GET");
      setTasks(res);
    } catch (error) {
      setError(error as Error);
    } finally{
      setTaskLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await makeApiCall("/projects", "GET");
      setProjects(res);
    } catch (error) {
      setError(error as Error);
    } finally {
      setProjectLoading(false);
    }
  };

  const fetchProject = async (id: number) => {
    try {
      const res = await makeApiCall(`/projects/${id}`, "GET");
      setProject(res);
      setProjectTask(res.tasks);
    } catch (error) {
      console.error("Error fetching project:", error);
      setError(error as Error);
    }finally{
      setProjectLoading(false);
    }
  };

  const addProject = async (project: Omit<Project, "id">) => {
    try {
      const res = await makeApiCall("/projects", "POST", project);
      if (res) {
        setProjects((prev) => [...prev, res]);
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const deleteProject = async (id: number) => {
    try {
      const res = await makeApiCall(`/projects/${id}`, "DELETE");
      if (res) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const updateProject = async (id: number, project: Partial<Project>) => {
    try {
      const res = await makeApiCall(`/projects/${id}`, "PUT", project);
      if (res) {
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...project } : p))
        );
        setProject((prev) => (prev ? { ...prev, ...project } : prev));
      }
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const toggleTask = async (task: Task) => {
    try {
      const res = await makeApiCall(`/tasks/toggle/${task.id}`, "PUT", {
        done: task.done === 0 ? 1 : 0,
      });
      if (res) {
        fetchProject(task.project_id); 
        fetchTasks();
      }
    } catch (error) {
      console.error("Error marking task as done:", error);
    }
  };

  const createTask = async (task: Omit<Task, "id">) => {
    try {
      const res = await makeApiCall("/tasks", "POST", task);
      if (res) {
        fetchProject(task.project_id);
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const updateTask = async (taskId: number, task: Partial<Task>) => {
    try {
      const res = await makeApiCall(`/tasks/${taskId}`, "PUT", task);
      if (res) {
        fetchProject(res.project_id);
        fetchTasks();
      }
      
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      const res = await makeApiCall(`/tasks/${taskId}`, "DELETE");
      if (res) {
        fetchProject(res.project_id);
        fetchTasks();
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        project,
        tasks,
        projectTask,
        projectLoading,
        taskLoading,
        error,
        fetchProjects,
        fetchProject,
        addProject,
        deleteProject,
        updateProject,
        toggleTask,
        createTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

export const useActionTask = () => {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error("useActionTask must be used within a ProjectsProvider");
  }
  const { createTask, updateTask, deleteTask, toggleTask } = context;
  return { createTask, updateTask, deleteTask, toggleTask };
};

export const useActionProject = () => {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error("useActionProject must be used within a ProjectsProvider");
  }
  const { addProject, deleteProject, updateProject } = context;
  return { addProject, deleteProject, updateProject };
};

export const useGetTask = () => {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error("useGetTask must be used within a ProjectsProvider");
  }
  const { projectTask, tasks, taskLoading } = context;
  const pending = tasks?.filter((task) => task.status === "pending") || [];
  const inProgress =
    tasks?.filter((task) => task.status === "in-progress") || [];
  const completed = tasks?.filter((task) => task.status === "completed") || [];

  const pendingCount = pending.length;
  const inProgressCount = inProgress.length;
  const completedCount = completed.length;

  return {
    loading: taskLoading,
    projectTask,
    tasks,
    pending,
    inProgress,
    completed,
    pendingCount,
    inProgressCount,
    completedCount,
  };
};

export const useGetProject = () => {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error("useGetProject must be used within a ProjectsProvider");
  }
  const {
    projectLoading,
    project,
    projects,
    fetchProject: fetchById,
  } = context;
  return { loading: projectLoading, project, projects, fetchById };
};
