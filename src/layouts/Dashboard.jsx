import LogotypeCentered from "../components/LogotypeCentered";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Divider from "../components/Divider";

const Home = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 h-full overflow-auto bg-gradient-to-b from-blue-500 to-blue-700 shadow-xl/90 px-10 pt-15 flex flex-col items-center text-white scrollbar-custom">
        <LogotypeCentered text="Clínica del Norte" isMobile={false} />
        <Divider />
        <Sidebar />
      </div>
      <div className="w-full h-full">
        <Outlet />
      </div>
    </div>  
  );
};

export default Home;