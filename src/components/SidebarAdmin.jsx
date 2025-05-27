import {
  CalendarIcon,
  CogIcon,
} from "@heroicons/react/24/outline";

import ListItem from "./ListItem";
import Divider from "./Divider";

const SidebarAdmin = () => {
  return (
    <div className="w-full h-full flex">
      <ul className="w-full h-fit">
        <ListItem text='Usuarios' Icon={CalendarIcon}/>
        <Divider />
        <ListItem text='Ajustes' Icon={CogIcon} to='/dashboard/settings'/>
      </ul>
    </div>
  );
}

export default SidebarAdmin;