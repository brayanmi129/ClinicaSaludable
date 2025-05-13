import { useNavigate } from 'react-router-dom';

const ListItem = ({ text, Icon, to }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(to)}
            className="w-full font-medium py-3 px-5 flex items-center justify-start rounded-lg cursor-pointer
                       transition-all duration-300 ease-in-out
                       bg-transparent hover:bg-blue-600"
        >
            {Icon && <Icon className="h-5 w-5 text-white mr-2" />}
            <span className="text-white">{text}</span>
        </div>
    );
};

export default ListItem;