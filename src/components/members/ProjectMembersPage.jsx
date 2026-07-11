import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit2, Trash2, Users, Shield } from "lucide-react";
import { getMembersRequest, removeMemberRequest } from "../../api/membersApi";
import { getProjectRequest } from "../../api/projectsApi";
import { ROLE_COLORS } from "../../utils/roles";
import { showError, showSuccess } from "../../utils/toast";
import AddMemberModal from "./AddMemberModal";
import UpdateRoleModal from "./UpdateRoleModal";
import DeleteMemberModal from "./DeleteMemberModal";

/**
 * ProjectMembersPage - Manage project members
 */
export default function ProjectMembersPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [addOpen, setAddOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deletingMember, setDeletingMember] = useState(null);

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch project
      const projectData = await getProjectRequest(projectId);
      setProject(projectData);

      // Fetch members
      const membersData = await getMembersRequest(projectId);
      setMembers(membersData.content || []);
    } catch (err) {
      const message = err.response?.data?.detail || "Failed to load data";
      setError(message);
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!deletingMember) return;

    try {
      await removeMemberRequest(projectId, deletingMember.userId);
      showSuccess("Member removed");
      setDeletingMember(null);
      fetchData();
    } catch (err) {
      const message = err.response?.data?.detail || "Failed to remove member";
      showError(message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <div>
      {/* Back link */}
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to projects
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Project Members
            </h1>
            <p className="text-slate-600 mt-1">{project.name}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Member
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700 mb-6">
          {error}
        </div>
      )}

      {/* Members table */}
      <div className="rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                User ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                Email
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-slate-700">
                Role
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {members.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-8 text-center text-sm text-slate-600"
                >
                  No members yet
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr key={member.userId} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-mono text-slate-900">
                    {member.userId}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">
                    {member.name || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {member.email}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        ROLE_COLORS[member.role]
                      }`}
                    >
                      <Shield className="h-3 w-3" />
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingMember(member)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600"
                        title="Update role"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingMember(member)}
                        className="p-1.5 hover:bg-red-100 rounded-lg text-red-600"
                        title="Remove member"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <AddMemberModal
        open={addOpen}
        projectId={projectId}
        onClose={() => setAddOpen(false)}
        onMemberAdded={fetchData}
      />

      <UpdateRoleModal
        open={!!editingMember}
        projectId={projectId}
        member={editingMember}
        onClose={() => setEditingMember(null)}
        onRoleUpdated={fetchData}
      />

      <DeleteMemberModal
        open={!!deletingMember}
        member={deletingMember}
        onClose={() => setDeletingMember(null)}
        onConfirm={handleRemoveMember}
      />
    </div>
  );
}
