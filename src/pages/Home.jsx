const Home = () => {
    const token = sessionStorage.getItem('authToken');
    console.log("token en Home:", token);
    
    return (
        <div>
        <h1>Bienvenido a la página de inicio</h1>
        <p>Tu token es: {token}</p>
        </div>
    );
}

export default Home;