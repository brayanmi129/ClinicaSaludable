import SidebarAdmin from "./SidebarAdmin";
import SidebarDoctor from "./SidebarDoctor";
import SidebarPatient from "./SidebarPatient";

const Sidebar = () => {
  const userData = JSON.parse(sessionStorage.getItem("userData"));

  if (userData?.role_name === "ADMIN") {
    return (
      <>
        <SidebarAdmin />
      </>
    );
  }

  if (userData?.role_name === "DOCTOR") {
    return (
      <>
        <SidebarDoctor />
      </>
    );
  }

  return (
    <>
      <SidebarPatient />
    </>
  );
};

export default Sidebar;