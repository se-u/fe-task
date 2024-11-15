import { Modal, Form, DatePicker, Select, Input } from "antd";
import dayjs from "dayjs";

const SubTaskModal = ({
    isSubTaskModalVisible,
    handleSubTaskSubmit,
    setIsSubTaskModalVisible,
    form,
  }: {
    isSubTaskModalVisible: boolean;
    handleSubTaskSubmit: () => void;
    setIsSubTaskModalVisible: (visible: boolean) => void;
    form: any;
  }) => (
    <Modal
      title="Add Sub-task"
      open={isSubTaskModalVisible}
      onOk={handleSubTaskSubmit}
      onCancel={() => setIsSubTaskModalVisible(false)}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="title" label="Title" rules={[{ required: true, message: "Please enter the title" }]}>
          <Input placeholder="Enter sub-task title" />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea placeholder="Enter sub-task description" />
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
    </Modal>
  );

  export default SubTaskModal;
  