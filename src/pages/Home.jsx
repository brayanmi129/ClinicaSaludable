import HomePatient from "./HomePatient.jsx";
import HomeAdmin from "./HomeAdmin.jsx";
import HomeDoctor from "./HomeDoctor.jsx";
import AppointmentAndLabSwitch from "./DoctorSeccion.jsx"; // Importa el componente que maneja citas y laboratorios

const Home = () => {
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  if (!userData) return <div>Please log in to access your dashboard.</div>;

  switch (userData.role_name) {
    case "PATIENT":
      return <HomePatient userData={userData} />;
    case "ADMIN":
      return <HomeAdmin userData={userData} />;
    case "DOCTOR":
      // return <HomeDoctor userData={userData} />;
      return <AppointmentAndLabSwitch />;
    default:
      return (
        <div>
          Hubo un problema al obtener tu información de la base de datos. Contacta al administrador
          del sitio.
        </div>
      );
  }
};

export default Home;
