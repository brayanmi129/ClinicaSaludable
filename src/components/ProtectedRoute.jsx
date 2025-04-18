const ProtectedRoute = ({ children }) => {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

export default ProtectedRoute;