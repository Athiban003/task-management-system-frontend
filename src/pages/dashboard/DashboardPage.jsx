import { useEffect, useState } from "react";
import { FolderKanban, ListTodo } from "lucide-react";
import { Link } from "react-router-dom";
import { getProjectsRequest } from "../../api/projectsApi";
import { useCurrentUser } from "../../hooks/useCurrentUser";

export default function DashboardPage() {
  const user = useCurrentUser();
  const [projectCount, setProjectCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getProjectsRequest(0, 1);
        setProjectCount(data.totalElements || 0);
      } catch {
        // Silently fail
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900">
        Welcome back, {user?.displayName || "there"}!
      </h1>
      <p className="text-slate-600 mt-2">
        Here's an overview of your workspace
      </p>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Projects */}
        <Link
          to="/projects"
          className="rounded-lg border border-slate-200 bg-white p-6 hover:shadow-md transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">
                Active Projects
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {isLoading ? "..." : projectCount}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <FolderKanban className="h-6 w-6" />
            </div>
          </div>
        </Link>

        {/* Tasks */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Open Tasks</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">0</p>
            </div>
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <ListTodo className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
