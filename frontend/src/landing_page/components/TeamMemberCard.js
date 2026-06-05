import React from "react";

function TeamMemberCard({ member }) {
  return (
    <div className="row p-3 text-muted app-rich-text align-items-center">
      <div className="col-12 col-md-6 p-3 text-center">
        <img src={member.avatar} className="app-team-avatar" alt={member.name} />
        <h4 className="mt-3">{member.name}</h4>
        <h6>{member.title}</h6>
      </div>
      <div className="col-12 col-md-6 p-3">
        {member.bio.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}

export default TeamMemberCard;
