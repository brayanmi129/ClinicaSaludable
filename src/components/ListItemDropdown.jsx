import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const ListItem = ({ text, Icon }) => {
    const [open, setOpen] = useState(false);
    const listItemStyle = "w-full cursor-pointer h-10 flex items-center px-5 py-2 transition-transform duration-300 ease-in-out";

    return (
        <div className="w-full h-fit">
            <div
                onClick={() => setOpen(!open)}
                className={`w-full mb-2 font-medium py-3 px-5 flex items-center justify-between rounded-lg cursor-pointer
                        transition-all duration-300 ease-in-out
                        ${open ? 'bg-blue-600' : 'bg-transparent'} hover:bg-blue-600`}
            >
                <div className="flex items-center">
                    {Icon && <Icon className="h-5 w-5 text-white mr-2" />}
                    <span className="text-white"> {text} </span>
                </div>
                {open ? (
                    <ChevronUpIcon className="h-5 w-5 text-white transition-transform duration-300" />
                ) : (
                    <ChevronDownIcon className="h-5 w-5 text-white transition-transform duration-300" />
                )}
            </div>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-40 opacity-100 mb-5' : 'max-h-0 opacity-0'}`}
            >
                <div className="px-5 py-3 bg-blue-500 rounded-b-lg text-white">
                    <p className={`${listItemStyle} hover:scale-105 `}>Elemento 1</p>
                    <p className={`${listItemStyle} hover:scale-105 `}>Elemento 2</p>
                    <p className={`${listItemStyle} hover:scale-105`}>Elemento 3</p>
                </div>
            </div>
        </div>
    );
}

export default ListItem;