import React from "react";
import TeamMemberCard from "../components/TeamMemberCard";
import { TEAM_MEMBERS } from "../../data/teamMembers";

function Team() {
  return (
    <div className="container">
      <div className="row p-3 mt-5 border-top">
        <h1 className="text-center ">People</h1>
      </div>

      {TEAM_MEMBERS.map((member) => (
        <TeamMemberCard key={member.name} member={member} />
      ))}
    </div>
  );
}

export default Team;
