"use client";
import { Card, Button, Modal, Form, Input, Select, Spin } from "antd";
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  ClockCircleTwoTone,
  BuildTwoTone,
  CheckSquareTwoTone,
  HomeTwoTone,
  LogoutOutlined,
} from "@ant-design/icons";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { ReactElement, useState } from "react";
import { getStatusBadge } from "../../utils/utils";
import {
  useActionProject,
  useGetProject,
  useGetTask,
} from "../../context/ProjectsContext";
import useAuth from "@/hooks/useAuth";
import clsx from "clsx";

const colors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
];

// Hash function to assign a consistent color based on project name
const getColorForProject = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export function ProjectList(): ReactElement {
  const router = useRouter();
  const { id } = useParams();
  const { signout } = useAuth();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  const { projects, loading } = useGetProject();
  const { addProject, deleteProject } = useActionProject();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => setIsModalOpen(true);
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      addProject(values);
      form.resetFields();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };
  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };
  const handleDelete = (projectId: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this project?",
      icon: <ExclamationCircleOutlined />,
      content: "Once deleted, this project cannot be recovered.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        deleteProject(projectId);
      },
    });
  };

  const { pendingCount, inProgressCount, completedCount } = useGetTask();

  const data = [
    {
      id: 1,
      title: " Pending",
      icon: <ClockCircleTwoTone />,
      color: "border-yellow-500",
      url: "/project?status=pending",
      count: pendingCount,
    },
    {
      id: 2,
      title: "On Progress",
      icon: <BuildTwoTone />,
      color: "border-sky-500",
      url: "/project?status=in_progress",
      count: inProgressCount,
    },
    {
      id: 3,
      title: "Completed",
      icon: <CheckSquareTwoTone />,
      color: "border-green-500",
      url: "/project?status=completed",
      count: completedCount,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-4 h-full">
      <div className="flex w-full justify-between">
        <h3 className="text-lg font-semibold mb-4">Projects</h3>
        <Button type="primary" onClick={() => setIsLogoutModalOpen(true)}>
          <LogoutOutlined />
        </Button>
      </div>

      <>
        <div>
          <ul>
            <li
              className={`flex px-2 py-2 gap-2 mb-2 backdrop-opacity-50 rounded-md bg-slate-100 ${
                !status ? "border-2 border-blue-500" : ""
              }`}
              onClick={() => router.push("/project")}
            >
              <div className="list-item-icon">
                <HomeTwoTone />
              </div>
              <div className="flex justify-between w-full">
                <span className="list-item-title">Home</span>
                <span className="text-transparent rounded-full py-1 px-2">
                  0
                </span>
              </div>
            </li>
            {data.map((item: any) => (
              <li
                key={item.id}
                className={`flex px-2 py-2 gap-2 mb-2 backdrop-opacity-50 rounded-md bg-slate-100 ${
                  item.url.includes(status!) ? `border-2  ${item.color}` : ""
                }`}
                onClick={() => router.push(item.url)}
              >
                <div className="list-item-icon">{item.icon}</div>
                <div className="flex justify-between w-full">
                  <span className="list-item-title">{item.title}</span>
                  <span className="bg-sky-200 rounded-full py-1 px-2">
                    {item.count}{" "}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className=" h-[65%] overflow-y-scroll ">
          <div className="grid grid-cols-2 gap-4 ">
            <Card
              onClick={showModal}
              className={`shadow-md rounded-lg cursor-pointer flex items-center justify-center bg-slate-100 `}
            >
              <span className="text-4xl">+</span>
            </Card>
            {projects.length > 0 && (
              <>
                {projects.map((project) => {
                  const isActive = String(project.id) === id; // Check if the current project is active
                  return (
                    <Card
                      key={project.id}
                      onClick={() => router.push(`/project/${project.id}`)}
                      className={`relative shadow-md rounded-lg cursor-pointer ${
                        isActive ? "border-2 border-blue-500" : ""
                      }`}
                    >
                      <div className="flex items-center justify-center mb-2">
                        <div
                          className={clsx(
                            `w-12 h-12 flex items-center justify-center rounded-full text-white`,
                            getColorForProject(project.name)
                          )}
                        >
                          <span className="text-xl font-bold">
                            {project.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <h4 className="text-center font-medium flex items-center justify-center space-x-2">
                        {project.name}
                      </h4>
                      {getStatusBadge(project.status)}

                      {/* Delete icon on hover */}
                      <div className="absolute top-2 left-2 w-full h-full text-red-600 cursor-pointer transition-opacity opacity-0 hover:opacity-100">
                        <DeleteOutlined
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card click
                            handleDelete(project.id);
                          }}
                        />
                      </div>
                    </Card>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </>

      {/* Modal for Creating a New Project */}
      <Modal
        title="Create New Project"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Project Name"
            rules={[
              { required: true, message: "Please enter the project name" },
            ]}
          >
            <Input placeholder="Enter project name" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input.TextArea placeholder="Enter project description" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select placeholder="Select project status">
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="in-progress">In Progress</Select.Option>
              <Select.Option value="completed">Completed</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for Confirming Logout */}
      <Modal
        title="Confirm Logout"
        open={isLogoutModalOpen}
        onOk={() => {
          signout();
          window.location.href = "/login";
        }}
        onCancel={() => setIsLogoutModalOpen(false)}
        okText="Yes, Logout"
        cancelText="Cancel"
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </div>
  );
}
