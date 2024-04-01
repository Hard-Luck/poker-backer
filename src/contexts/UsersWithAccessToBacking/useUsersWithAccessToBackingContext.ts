import { useContext } from "react";
import { UsersWithAccessToBackingContext } from "../UsersWithAccessToBacking";

const useUsersWithAccessToBackingContext = () => {
  const context = useContext(UsersWithAccessToBackingContext);
  if (!context) {
    throw new Error(
      "context must be used within a UsersWithAccessToBackingProvider"
    );
  }
  return context;
};

export default useUsersWithAccessToBackingContext;
