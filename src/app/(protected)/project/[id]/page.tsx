"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Dropdown,
  Menu,
  Spin,
} from "antd";
import { TaskList } from "@/app/components/TaskList";
import {
  useActionProject,
  useActionTask,
  useGetProject,
  useGetTask,
} from "@/context/ProjectsContext";
import { Task } from "@/utils/api";
import { EditTwoTone } from "@ant-design/icons";

const ProjectDetailPage = () => {
  const { id } = useParams();
  const { project } = useGetProject();
  const { projectTask, loading } = useGetTask();
  const { fetchById } = useGetProject();
  const { updateProject } = useActionProject();

  useEffect(() => {
    if (!id) return;
    fetchById(Number(id));
  }, [id]);

  const { createTask, toggleTask } = useActionTask();

  // MODAL STATE
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  const [parentTaskId, setParentTaskId] = useState<number | null>(null);
  const [status, setStatus] = useState(project?.status || "pending");

  const [form] = Form.useForm();

  const handleToggle = async (task: Task) => {
    await toggleTask(task);
  };

  const openTaskModal = (parentId: number | null = null) => {
    setParentTaskId(parentId);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    form.resetFields();
    setIsTaskModalOpen(false);
  };

  const handleprojectTaskubmit = async () => {
    try {
      const values = await form.validateFields();
      const newTask = {
        ...values,
        done: 0,
        due_date: values.due_date.format("YYYY-MM-DD"),
        parent_id: parentTaskId,
        project_id: Number(id),
      };
      await createTask(newTask);
      fetchById(Number(id));
      closeTaskModal();
    } catch (error) {
      console.error("Task creation failed:", error);
    }
  };

  const handleEditSubmit = async () => {
    const values = await form.validateFields();
    await updateProject(Number(id), {
      ...project,
      name: values.name,
      description: values.description,
    });
    closeEditModal();
  };

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    await updateProject(Number(id), { ...project, status: newStatus });
    fetchById(Number(id));
  };

  const statusMenu = (
    <Menu onClick={(e) => handleStatusChange(e.key as string)}>
      <Menu.Item key="pending">Pending</Menu.Item>
      <Menu.Item key="in-progress">In Progress</Menu.Item>
      <Menu.Item key="completed">Completed</Menu.Item>
    </Menu>
  );

  useEffect(() => {
    if (!id) return;
    fetchById(Number(id));
  }, [id]);

  return (
    <div className="w-full h-[85%]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold mb-2">{project?.name}</h1>
          <p className="text-gray-700 mb-4">{project?.description}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Dropdown overlay={statusMenu} trigger={["click"]}>
            <Button>{status}</Button>
          </Dropdown>
          <Button onClick={openEditModal}>
            <EditTwoTone /> Edit
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="border-dashed border-2 border-gray-300 h-[90%] overflow-y-scroll rounded-lg p-2 flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : (
        <TaskList tasks={projectTask} handleToggle={handleToggle} />
      )}

      <Button
        size="large"
        type="primary"
        onClick={() => openTaskModal(null)}
        className="mt-4"
      >
        + Create New Task
      </Button>

      {/* Modal for Editing Project */}
      <Modal
        title="Edit Project"
        open={isEditModalOpen}
        onOk={handleEditSubmit}
        onCancel={closeEditModal}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            name: project?.name,
            description: project?.description,
          }}
        >
          <Form.Item
            name="name"
            label="Project Name"
            rules={[
              { required: true, message: "Please enter the project name" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Project Description">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for Creating a New Task */}
      <Modal
        title={parentTaskId ? "Create Subtask" : "Create New Task"}
        open={isTaskModalOpen}
        onOk={handleprojectTaskubmit}
        onCancel={closeTaskModal}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter the task title" }]}
          >
            <Input placeholder="Enter task title" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please enter the task description" },
            ]}
          >
            <Input.TextArea placeholder="Enter task description" />
          </Form.Item>

          <Form.Item name="due_date" label="Due Date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[
              { required: true, message: "Please select the task status" },
            ]}
          >
            <Select placeholder="Select task status">
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="in-progress">In Progress</Select.Option>
              <Select.Option value="completed">Completed</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="priority" label="Priority">
            <Select placeholder="Select priority level">
              <Select.Option value="low">Low</Select.Option>
              <Select.Option value="medium">Medium</Select.Option>
              <Select.Option value="high">High</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectDetailPage;
