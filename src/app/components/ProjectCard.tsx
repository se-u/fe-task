import { Project } from "@/utils/api";
import { DeleteOutlined } from "@ant-design/icons";
import { Card } from "antd";
import { getColorForProject, getStatusBadge } from "../../utils/utils";

const ProjectCard = ({ project, isActive, onClick, onDelete }: {project: Project, isActive: boolean, onClick: () => void, onDelete: (taskId: number) => void}) => (
    <Card
      key={project.id}
      onClick={onClick}
      className={`relative shadow-md rounded-lg cursor-pointer ${
        isActive ? "border-2 border-blue-500" : ""
      }`}
    >
      <div className="flex items-center justify-center mb-2">
        <div
          className={`w-12 h-12 flex items-center justify-center rounded-full text-white ${getColorForProject(
            project.name
          )}`}
        >
          <span className="text-xl font-bold">{project.name.charAt(0)}</span>
        </div>
      </div>
      <h4 className="text-center font-medium flex items-center justify-center space-x-2">
        {project.name}
      </h4>
      {getStatusBadge(project.status)}
      <div className="absolute top-2 left-2 w-full h-full text-red-600 cursor-pointer transition-opacity opacity-0 hover:opacity-100">
        <DeleteOutlined
          onClick={(e) => {
            e.stopPropagation();
            onDelete(project.id);
          }}
        />
      </div>
    </Card>
  );


  export default ProjectCard;