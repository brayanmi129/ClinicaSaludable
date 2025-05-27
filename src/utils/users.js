export const updateUserInfo = async (token, data) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_UPDATE_USER_INFO}/${data.user_id}`, {
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
}