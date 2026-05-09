import { Plus } from "lucide-react";

function MembersSection({ activeSpace, members, onInvite }) {
  return (
    <section className="section-card">
      <div className="section-header">
        <div>
          <h2>Members</h2>
          <p>People who can access this space</p>
        </div>

        {activeSpace?.type === "shared" && (
          <button className="small-add-btn" onClick={onInvite}>
            <Plus size={16} />
            Invite
          </button>
        )}
      </div>

      <div className="member-list">
        {members.map((member) => (
          <div className="member-card" key={member.id}>
            <div className="avatar">
              {member.profiles?.full_name?.charAt(0)}
            </div>

            <div>
              <h3>{member.profiles?.full_name}</h3>
              <p>{member.profiles?.email}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MembersSection;