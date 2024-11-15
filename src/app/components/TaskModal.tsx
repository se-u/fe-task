import { Task } from "@/utils/api";
import { Modal, Button, Form, Select, Input, DatePicker } from "antd";
import dayjs from "dayjs";

const TaskModal = ({
  isModalVisible,
  handleUpdate,
  handleModalClose,
  handleDelete,
  selectedTask,
  form,
}: {
  isModalVisible: boolean;
  handleUpdate: () => void;
  handleModalClose: () => void;
  handleDelete: (taskId: number) => void;
  selectedTask: Task | null;
  form: any;
}) => {
  return (
    <Modal
      title="Task Details"
      open={isModalVisible}
      onOk={handleUpdate}
      onCancel={handleModalClose}
      footer={[
        <Button key="back" onClick={handleModalClose}>
          Cancel
        </Button>,
        <Button
          key="delete"
          danger
          onClick={() => handleDelete(selectedTask!.id)}
        >
          Delete
        </Button>,
        <Button key="submit" type="primary" onClick={handleUpdate}>
          Save
        </Button>,
      ]}
    >
      {selectedTask && (
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter the title" }]}
          >
            <Input placeholder="Enter task title" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="Enter task description" />
          </Form.Item>
          <Form.Item name="due_date" label="Due Date" getValueProps={(value) => ({ value: value ? dayjs(value) : "", })}>
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>
          <Form.Item name="status" label="Status">
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
      )}
    </Modal>
  );
};

export default TaskModal;
