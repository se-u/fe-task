import { Task } from "@/utils/api";
import { PlusOutlined } from "@ant-design/icons";
import { List, Checkbox, Button } from "antd";
import { getStatusBadge, getPriorityBadge, formatDueDate } from "../../utils/utils";

const TaskItem = ({
    task,
    handleToggle,
    handleTaskClick,
    openSubTaskModal,
    getProjectName,
    disableSubTask,
  }: {
    task: Task;
    handleToggle: (task: Task) => void;
    handleTaskClick: (task: Task) => void;
    openSubTaskModal: (parentId: number) => void;
    getProjectName: (projectId: number) => string;
    disableSubTask?: boolean;
  }) => (
    <>
      <List.Item
        className="flex items-center justify-between p-1 rounded-lg bg-white border-gray-200 mb-2 cursor-pointer group"
        onClick={() => handleTaskClick(task)}
      >
        <div className="flex items-center space-x-4 px-4">
          <Checkbox
            checked={task.done !== 0}
            onChange={() => handleToggle(task)}
            onClick={(e) => e.stopPropagation()}
          />
          <div className={`flex flex-col space-y-1 ${task.done ? "line-through text-gray-400" : ""}`}>
            <p className="font-medium">{task.title}  <span className="text-xs ml-2 italic"> due {formatDueDate(task.due_date)}</span>

            </p>
            <div className="flex items-center space-x-2">
              {getStatusBadge(task.status)}
              {getPriorityBadge(task.priority)}
              <p className="text-sm text-gray-500">#{getProjectName(task.project_id)}</p>
            </div>
            <div>
              
            </div>
          </div>
        </div>
        {!disableSubTask && (
                 <div className="flex items-center space-x-2">
                 <Button
                   type="text"
                   icon={<PlusOutlined />}
                   onClick={(e) => {
                     e.stopPropagation();
                     openSubTaskModal(task.id);
                   }}
                   className="invisible group-hover:visible"
                 >
                   Add Sub-task
                 </Button>
               </div>
        )}
      </List.Item>
  
      {task.subtasks &&
        task.subtasks.map((subTask) => (
          <List.Item
            key={subTask.id}
            className="flex items-center justify-between p-1 rounded-lg bg-white border-gray-200 mb-2 ml-6"
            onClick={() => handleTaskClick(subTask)}
          >
            <div className="flex items-center space-x-4 px-4">
              <Checkbox
                checked={subTask.done !== 0}
                onChange={() => handleToggle(subTask)}
                onClick={(e) => e.stopPropagation()}
              />
              <div className={`flex flex-col space-y-1 ${subTask.done ? "line-through text-gray-400" : ""}`}>
                <p className="font-medium">{subTask.title}</p>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(subTask.status)}
                  {getPriorityBadge(subTask.priority)}
                </div>
              </div>
            </div>
          </List.Item>
        ))}
    </>
  );

  export default TaskItem;