import {
  BeakerIcon,
  CogIcon,
  ClipboardDocumentCheckIcon 
} from "@heroicons/react/24/outline";

import ListItemDropdown from "./ListItemDropdown";
import ListItem from "./ListItem";
import Divider from "./Divider";

const SidebarDoctor = () => {
  return (
    <div className="w-full h-full flex">
      <ul className="w-full h-fit">
        <ListItemDropdown text='Laboratorios' Icon={BeakerIcon}/>
        <ListItemDropdown text='Historias Clìnicas' Icon={ClipboardDocumentCheckIcon}/>
        <Divider />
        <ListItem text='Ajustes' Icon={CogIcon} to='/dashboard/settings'/>
      </ul>
    </div>
  );
}

export default SidebarDoctor;