import { useNavigate } from 'react-router-dom';

const ListItem = ({ text, Icon, to, isDanger, onClick }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else if (to) {
            navigate(to);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`w-full font-medium py-3 px-5 flex items-center justify-start rounded-lg cursor-pointer
                        transition-all duration-300 ease-in-out
                        ${isDanger ? 'hover:bg-red-500' : 'bg-transparent hover:bg-gray-300/30'}`}
        >
            {Icon && <Icon className="h-5 w-5 text-white mr-2" />}
            <span className="text-white">{text}</span>
        </div>
    );
};

export default ListItem;