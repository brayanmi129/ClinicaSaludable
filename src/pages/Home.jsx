import Logotype from "../components/Logo";

const Home = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-fit bg-blue-500 shadow-xl/90 p-20">
        <Logotype text="Clínica del Norte" />
      </div>
    </div>  
  );
};

export default Home;