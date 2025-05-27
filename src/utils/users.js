const API_URL = import.meta.env.VITE_API_URL;

export const updateUserInfo = async (token, data) => {
  try {
    const response = await fetch(`${API_URL}/users/update/${data.user_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        address: data.address,
        phone: data.phone
      }),
    });

    const result = await response.json();

    switch (response.status) {
      case 200:
        if (result?.newToken) {
          sessionStorage.setItem("authToken", result.newToken);
          console.log("Token actualizado:", result.newToken);
        }
        if (result?.updatedUser) {
          sessionStorage.setItem("userData", JSON.stringify(result.updatedUser));
        }
        return result;
      case 401:
        throw new Error("Credenciales incorrectas. Intente nuevamente.");
      case 404:
        throw new Error("Usuario no encontrado.");
      default:
        throw new Error("Ocurrió un error al actualizar la información del usuario.");
    }
  } catch (error) {
    if (error.message === "Failed to fetch") {
      throw new Error("No se pudo conectar con el servidor.");
    }
    throw error;
  }
};

export const GetUsers = async () => {
  try {
    const token = sessionStorage.getItem("authToken");
    const response = await fetch(`${API_URL}/users/all`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Error al obtener los usuarios.");
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const GetUsersByID = async (id) => {
  try {
    const token = sessionStorage.getItem("authToken");
    const response = await fetch(`${API_URL}/users/id/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Error al obtener el usuario.");
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const GetUsersByEmail = async (email) => {
  try {
    const token = sessionStorage.getItem("authToken");
    const response = await fetch(`${API_URL}/users/email/${email}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Error al obtener el usuario.");
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const GetUsersByName = async (name) => {
  try {
    const token = sessionStorage.getItem("authToken");
    const response = await fetch(`${API_URL}/users/name/${name}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Error al obtener el usuario.");
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const DeleteUser = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/users/delete/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Error al eliminar el usuario.");
    return await response.json();
  } catch (error) {
    if (error.message === "Failed to fetch") {
      throw new Error("No se pudo conectar con el servidor.");
    }
    throw error;
  }
};

export const UpdateUser = async (id, userData) => {
  try {
    const token = sessionStorage.getItem("authToken");
    const response = await fetch(`${API_URL}/users/update/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.message || "Error al actualizar el usuario.";
      return { error: errorMessage };
    }

    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

export const CreateUser = async (userData) => {
  try {
    const token = sessionStorage.getItem("authToken");
    const response = await fetch(`${API_URL}/users/register`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.message || "Error al crear el usuario.";
      return { error: errorMessage };
    }

    return await response.json();
  } catch (error) {
    return { error: error.message || "Error desconocido." };
  }
};