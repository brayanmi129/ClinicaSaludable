import ListItemDropdown from "./ListItemDropdown";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { BeakerIcon } from "@heroicons/react/24/outline";
import { DocumentIcon } from "@heroicons/react/24/outline";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { CogIcon } from "@heroicons/react/24/outline";
import ListItem from "./ListItem";
import Divider from "./Divider";

const Sidebar = () => {
    return (
        <div className="w-full h-full flex">
            <ul className="w-full h-fit">
                <ListItemDropdown text='Citas' Icon={CalendarIcon}/>
                <ListItemDropdown text='Laboratorios' Icon={BeakerIcon}/>
                <ListItemDropdown text='Documentos' Icon={DocumentIcon}/>
                <ListItemDropdown text='Hospitalización' Icon={BuildingOfficeIcon}/>
                <Divider />
                <ListItem text='Ajustes' Icon={CogIcon} to='/dashboard/settings'/>
            </ul>
        </div>
    );
}

export default Sidebar;