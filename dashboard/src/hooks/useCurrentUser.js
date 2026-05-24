import { useContext } from "react";
import UserContext from "../context/UserContext";

export function useCurrentUser() {
  const user = useContext(UserContext);
  if (!user) throw new Error("useCurrentUser must be used inside <UserProvider>");
  return user;
}
