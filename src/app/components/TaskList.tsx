"use client";
import { List, Form } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Task } from "@/utils/api";
import { useState } from "react";
import { useParams } from "next/navigation";
import SubTaskModal from "./SubTaskModal";
import TaskModal from "./TaskModal";
import TaskItem from "./TaskItem";
import { useActionTask, useGetProject } from "../../context/ProjectsContext";

dayjs.extend(relativeTime);

interface TaskListProps {
  tasks: Task[];
  handleToggle: (task: Task) => void;
  disableSubTask?: boolean;
}

export function TaskList({
  tasks,
  handleToggle,
  disableSubTask,
}: TaskListProps) {
  const { id } = useParams();
  const { updateTask, deleteTask, createTask } = useActionTask();
  const { projects } = useGetProject();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubTaskModalVisible, setIsSubTaskModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [subTaskParentId, setSubTaskParentId] = useState<number | null>(null);

  const getProjectName = (projectId: number): string => {
    const project = projects.find((project) => project.id === projectId);
    return project ? project.name : "Unknown Project";
  };

  const handleRefetch = () => {
    console.log("Refetching tasks");
  };

  const handleDelete = async (taskId: number): Promise<void> => {
    await deleteTask(taskId);
    handleRefetch();
    setSelectedTask(null);
    setIsModalVisible(false);
  };

  const handleUpdate = async (): Promise<void> => {
    if (!selectedTask) return;
    try {
      const updatedTask = await form.validateFields();
      await updateTask(selectedTask.id, {
        ...updatedTask
      });
      handleRefetch();
      setSelectedTask(null);
      setIsModalVisible(false);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleTaskClick = (task: Task): void => {
    setSelectedTask(task);
    form.setFieldsValue(task);
    setIsModalVisible(true);
  };

  const handleModalClose = (): void => {
    setSelectedTask(null);
    setIsModalVisible(false);
  };

  const openSubTaskModal = (parentId: number): void => {
    setSubTaskParentId(parentId);
    form.resetFields();
    setIsSubTaskModalVisible(true);
  };

  const handleSubTaskSubmit = async (): Promise<void> => {
    try {
      const values = await form.validateFields();
      const newSubTask = {
        ...values,
        due_date: values.due_date.format("YYYY-MM-DD"),
        done: 0,
        parent_id: subTaskParentId,
        project_id: Number(id),
      };
      await createTask(newSubTask);
      setIsSubTaskModalVisible(false);
      setSubTaskParentId(null);
    } catch (error) {
      console.error("Failed to create sub-task:", error);
    }
  };

  const sortedTasks = tasks.sort((a, b) => {
    if (a.done !== b.done) return b.done - a.done;
    if (a.done === 0) {
      if (a.priority === b.priority)
        return dayjs(a.due_date).diff(dayjs(b.due_date));
      return a.priority === "high" ? -1 : b.priority === "high" ? 1 : 0;
    }
    return 0;
  });

  return (
    <>
      <List
        className="border-dashed border-2 border-gray-300 h-[90%] overflow-y-scroll rounded-lg p-2"
        dataSource={sortedTasks}
        renderItem={(task) => (
          <TaskItem
            task={task}
            handleToggle={handleToggle}
            handleTaskClick={handleTaskClick}
            openSubTaskModal={openSubTaskModal}
            getProjectName={getProjectName}
            disableSubTask={disableSubTask}
          />
        )}
      />
      <TaskModal
        isModalVisible={isModalVisible}
        handleUpdate={handleUpdate}
        handleModalClose={handleModalClose}
        handleDelete={handleDelete}
        selectedTask={selectedTask}
        form={form}
      />
      <SubTaskModal
        isSubTaskModalVisible={isSubTaskModalVisible}
        handleSubTaskSubmit={handleSubTaskSubmit}
        setIsSubTaskModalVisible={setIsSubTaskModalVisible}
        form={form}
      />
    </>
  );
}
