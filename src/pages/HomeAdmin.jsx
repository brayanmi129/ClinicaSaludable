import React, { useState, useEffect } from "react";
import {
  DeleteUser,
  GetUsers,
  UpdateUser,
  CreateUser,
  GetUsersByID,
  GetUsersByEmail,
  GetUsersByName,
} from "../utils/users";
import { Home } from "lucide-react";

const HomeAdmin = () => {
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [role, setRole] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [editedUser, setEditedUser] = useState(null); // Usado para manejar el estado del usuario editado en el formulario
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editData, setEditData] = useState({}); // Cambiado a objeto vacío para que se construya con los cambios
  const [spinner, setSpinner] = useState(false); // Corregido el nombre a 'spinner'
  const [filtro, setFiltro] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    user_id: "", // Agregado campo para el ID/Cédula
    first_name: "",
    last_name: "",
    email: "",
    address: "",
    phone: "",
    birth_date: "",
    password: "",
    role_name: "",
    blood_type: "",
    specialty: "",
    health_insurance: "",
    allergies: "",
  });

  const initialFormData = {
    user_id: "", // Reiniciar también el campo ID/Cédula
    first_name: "",
    last_name: "",
    email: "",
    address: "",
    phone: "",
    birth_date: "",
    password: "",
    role_name: "",
    blood_type: "",
    specialty: "",
    health_insurance: "",
    allergies: "",
  };

  // --- Manejo de mensajes de error y éxito ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
    }, 2500);
    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(null);
    }, 2500);
    return () => clearTimeout(timer);
  }, [success]);

  // --- Funciones de obtención de datos ---
  const fetchData = async () => {
    setSpinner(true);
    try {
      const data = await GetUsers();
      setUsers(Array.isArray(data) ? data : []); // Asegurar que data sea un array
    } catch (err) {
      setError("Error al cargar usuarios.");
      console.error("Error fetching users:", err);
    } finally {
      setSpinner(false);
    }
  };

  const getUser = async () => {
    if (!filtro) {
      setError("Por favor selecciona un filtro para la búsqueda.");
      return;
    }
    if (!searchTerm) {
      setError("Por favor ingresa un término de búsqueda.");
      return;
    }

    setSpinner(true);
    try {
      let user = [];
      if (filtro === "ID") {
        user = await GetUsersByID(searchTerm);
      } else if (filtro === "Nombre") {
        user = await GetUsersByName(searchTerm);
      } else if (filtro === "Correo") {
        user = await GetUsersByEmail(searchTerm);
      }
      setUsers(Array.isArray(user) ? user : [user].filter(Boolean)); // Asegurar que sea un array, incluso si la API devuelve un solo objeto
      if (!user || (Array.isArray(user) && user.length === 0)) {
        setSuccess("No se encontraron usuarios con ese criterio.");
      }
    } catch (err) {
      setError("Error al buscar usuario.");
      console.error("Error searching user:", err);
      setUsers([]); // Limpiar la tabla en caso de error
    } finally {
      setSpinner(false);
    }
  };

  // --- Cargar usuarios al inicio y al refrescar ---
  useEffect(() => {
    fetchData();
  }, [refresh]);

  // --- Funciones para eliminar usuario ---
  function handleCancelDelete() {
    setIsDeleting(false);
  }

  async function handleConfirmDelete() {
    setSpinner(true);
    try {
      const response = await DeleteUser(selectedUser?.user_id);
      if (!response.error) {
        setSuccess(response.message || "Usuario eliminado con éxito.");
        setRefresh(!refresh);
        setSelectedUser(null); // Deseleccionar usuario después de eliminar
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError("Error al eliminar usuario.");
      console.error("Error deleting user:", err);
    } finally {
      setSpinner(false);
      setIsDeleting(false);
    }
  }

  // --- Funciones para crear usuario ---
  const handleCreate = () => {
    setIsCreating(true);
    setFormData(initialFormData); // Resetear el formulario al abrir
    setRole(""); // Resetear el rol para el formulario de creación
    setError(null); // Limpiar errores previos
    setSuccess(null); // Limpiar éxitos previos
  };

  const handleCloseForm = () => {
    setIsCreating(false);
    setFormData(initialFormData); // Resetear el formulario al cerrar
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSpinner(true);

    // Validar que el ID/Cédula sea solo numérico
    if (formData.user_id && !/^\d+$/.test(formData.user_id)) {
      setError("El campo ID/Cédula debe contener solo números.");
      setSpinner(false);
      return;
    }

    try {
      const response = await CreateUser(formData);
      if (!response.error) {
        setSuccess(response.message || "Usuario creado con éxito.");
        setFormData(initialFormData);
        setRefresh(!refresh);
        setIsCreating(false);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError("Error al crear usuario. Intenta de nuevo.");
      console.error("Error creating user:", err);
    } finally {
      setSpinner(false);
    }
  };

  // --- Funciones para editar usuario ---
  const handleEdit = async () => {
    if (!selectedUser) {
      setError("Por favor selecciona un usuario para editar.");
      return;
    }
    setSpinner(true);
    try {
      const userToEdit = await GetUsersByID(selectedUser.user_id);
      if (userToEdit && userToEdit.length > 0) {
        setSelectedUser(userToEdit[0]); // Asegurarse de tener el usuario completo para editar
        setEditedUser({ ...userToEdit[0] }); // Copia para el estado del formulario de edición
        setEditData({}); // Resetear editData para nuevos cambios
        setIsEditing(true);
        setError(null); // Limpiar errores previos
        setSuccess(null); // Limpiar éxitos previos
      } else {
        setError("No se pudo obtener la información del usuario para editar.");
      }
    } catch (err) {
      setError("Error al cargar datos del usuario para editar.");
      console.error("Error fetching user for edit:", err);
    } finally {
      setSpinner(false);
    }
  };

  const handleCloseEditForm = () => {
    setIsEditing(false);
    setEditedUser(null); // Limpiar el usuario editado
    setEditData({}); // Limpiar los datos de edición
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSpinner(true);

    // Validar que el ID/Cédula sea solo numérico si se edita (aunque no se permite editar el ID en el formulario actual)
    if (editData.user_id && !/^\d+$/.test(editData.user_id)) {
      setError("El campo ID/Cédula debe contener solo números.");
      setSpinner(false);
      return;
    }

    try {
      const response = await UpdateUser(selectedUser.user_id, editData);
      if (!response.error) {
        setSuccess(response.message || "Usuario actualizado con éxito.");
        setIsEditing(false);
        setRefresh(!refresh);
        setSelectedUser(null); // Deseleccionar usuario después de editar
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError("Error al actualizar usuario. Intenta de nuevo.");
      console.error("Error updating user:", err);
    } finally {
      setSpinner(false);
    }
  };

  // --- Renderizado del componente ---
  return (
    <div className="h-screen flex flex-col p-8 bg-gray-100">
      <div className="flex justify-between items-center">
        <nav className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Panel de Administración de Usuarios</h1>
        </nav>

        <div className="flex gap-4 mb-6 justify-end">
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            + Crear
          </button>

          <button
            onClick={handleEdit}
            disabled={!selectedUser}
            className={`px-4 py-2 rounded transition ${
              selectedUser
                ? "bg-yellow-500 text-white hover:bg-yellow-600"
                : "bg-yellow-200 text-white cursor-not-allowed"
            }`}
          >
            ✎ Editar
          </button>

          <button
            onClick={() => setIsDeleting(true)}
            disabled={!selectedUser}
            className={`px-4 py-2 rounded transition ${
              selectedUser
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-red-300 text-white cursor-not-allowed"
            }`}
          >
            🗑 Eliminar
          </button>
        </div>
      </div>

      <div className="pt-1 px-8 pb-8 bg-gray-100 h-screen overflow-y-auto">
        <div className="mb-6 p-4 bg-white rounded-lg shadow flex flex-col md:flex-row md:items-end gap-4">
          {/* Selector de filtro */}
          <div className="flex-1">
            <label htmlFor="filterBy" className="block mb-1 text-sm font-medium text-gray-700">
              Filtrar por
            </label>
            <select
              id="filterBy"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setFiltro(e.target.value)}
              value={filtro} // Controlar el valor del select
            >
              <option value="">Seleccionar filtro</option>
              <option value="ID">ID</option>
              <option value="Nombre">Nombre</option>
              <option value="Correo">Correo</option>
            </select>
          </div>
          {/* Input de búsqueda */}
          <div className="flex-1">
            <label htmlFor="search" className="block mb-1 text-sm font-medium text-gray-700">
              Buscar usuario
            </label>
            <input
              id="search"
              type="text"
              placeholder="Buscar usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Botón de búsqueda */}
          <div>
            <button
              onClick={getUser}
              className="w-full px-5 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Buscar
            </button>
          </div>
          <div>
            <button
              onClick={() => {
                fetchData(), setSearchTerm(""), setFiltro("");
              }} // Usar fetchData para refrescar todos los usuarios
              className="w-full px-5 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Recargar
            </button>
          </div>
        </div>

        <table className="min-w-full bg-white rounded shadow-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700">Seleccionar</th>
              <th className="px-4 py-2 text-left text-gray-700">ID</th>
              <th className="px-4 py-2 text-left text-gray-700">Nombre</th>
              <th className="px-4 py-2 text-left text-gray-700">Apellido</th>
              <th className="px-4 py-2 text-left text-gray-700">Correo</th>
              <th className="px-4 py-2 text-left text-gray-700">Rol</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user.user_id}
                  className={`border-b hover:bg-gray-50 ${
                    selectedUser?.user_id === user.user_id ? "bg-blue-100" : ""
                  }`}
                  onClick={() => setSelectedUser(user)} // Seleccionar fila
                >
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedUser?.user_id === user.user_id}
                      onChange={() => setSelectedUser(user)} // Cambia el usuario seleccionado
                    />
                  </td>
                  <td className="px-4 py-2">{user.user_id}</td>
                  <td className="px-4 py-2">{user.first_name}</td>
                  <td className="px-4 py-2">{user.last_name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.role_name}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                  No hay usuarios para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Creación de Usuario */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Crear Nuevo Usuario
            </h2>

            <form onSubmit={handleCreateSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campo: ID/Cédula */}
              <div>
                <label htmlFor="user_id" className="block mb-1 font-medium text-gray-700">
                  ID / Cédula <span className="text-red-500">*</span>
                </label>
                <input
                  id="user_id"
                  onChange={(e) => {
                    const value = e.target.value;
                    // Permitir solo números
                    if (/^\d*$/.test(value)) {
                      setFormData({ ...formData, user_id: value });
                    }
                  }}
                  value={formData.user_id} // Controlar el valor del input
                  type="text" // Usar text para poder validar antes de convertir a number
                  inputMode="numeric" // Sugerir teclado numérico en móviles
                  pattern="[0-9]*" // Patrón para validación básica en HTML5
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              {/* Campo: Nombre */}
              <div>
                <label htmlFor="first_name" className="block mb-1 font-medium text-gray-700">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  id="first_name"
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  type="text"
                  value={formData.first_name}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Campo: Apellido */}
              <div>
                <label htmlFor="last_name" className="block mb-1 font-medium text-gray-700">
                  Apellido <span className="text-red-500">*</span>
                </label>
                <input
                  id="last_name"
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  type="text"
                  value={formData.last_name}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Campo: Correo */}
              <div>
                <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
                  Correo <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  value={formData.email}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Campo: Dirección */}
              <div>
                <label htmlFor="address" className="block mb-1 font-medium text-gray-700">
                  Dirección
                </label>
                <input
                  id="address"
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  type="text"
                  value={formData.address}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Campo: Teléfono */}
              <div>
                <label htmlFor="phone" className="block mb-1 font-medium text-gray-700">
                  Teléfono
                </label>
                <input
                  id="phone"
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  type="tel"
                  value={formData.phone}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Campo: Fecha de Nacimiento */}
              <div>
                <label htmlFor="birth_date" className="block mb-1 font-medium text-gray-700">
                  Fecha de Nacimiento
                </label>
                <input
                  id="birth_date"
                  onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                  type="date"
                  value={formData.birth_date}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Campo: Contraseña */}
              <div>
                <label htmlFor="password" className="block mb-1 font-medium text-gray-700">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  type="password" // Cambiado a type="password" para seguridad
                  value={formData.password}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Campo: Rol */}
              <div>
                <label htmlFor="role" className="block mb-1 font-medium text-gray-700">
                  Rol <span className="text-red-500">*</span>
                </label>
                <select
                  id="role"
                  value={formData.role_name} // Usar formData.role_name directamente
                  onChange={(e) => {
                    setFormData({ ...formData, role_name: e.target.value });
                    setRole(e.target.value); // Mantener el estado 'role' para el renderizado condicional
                  }}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="" disabled>
                    Selecciona un rol
                  </option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="PATIENT">PACIENTE</option>
                  <option value="DOCTOR">DOCTOR</option>
                </select>
              </div>

              {/* Campos condicionales para DOCTOR */}
              {formData.role_name === "DOCTOR" && (
                <>
                  <div className="mt-4">
                    <label htmlFor="specialty" className="block mb-1 font-medium text-gray-700">
                      Especialidad <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="specialty"
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      type="text"
                      value={formData.specialty}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required // Hacer obligatorio para doctores
                    />
                  </div>
                  {/* Campo: Tipo de Sangre (para DOCTOR) */}
                  <div>
                    <label
                      htmlFor="blood_type_doctor"
                      className="block mb-1 font-medium text-gray-700"
                    >
                      Tipo de Sangre
                    </label>
                    <input
                      id="blood_type_doctor" // ID único
                      onChange={(e) => setFormData({ ...formData, blood_type: e.target.value })}
                      type="text"
                      value={formData.blood_type}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
              {/* Campos condicionales para PATIENT */}
              {formData.role_name === "PATIENT" && (
                <>
                  <div className="mt-4">
                    <label
                      htmlFor="health_insurance"
                      className="block mb-1 font-medium text-gray-700"
                    >
                      Seguro Médico
                    </label>
                    <input
                      id="health_insurance"
                      onChange={(e) =>
                        setFormData({ ...formData, health_insurance: e.target.value })
                      }
                      type="text"
                      value={formData.health_insurance}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mt-4">
                    <label htmlFor="allergies" className="block mb-1 font-medium text-gray-700">
                      Alergias
                    </label>
                    <input
                      id="allergies"
                      onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                      type="text"
                      value={formData.allergies}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {/* Campo: Tipo de Sangre (para PATIENT) */}
                  <div>
                    <label
                      htmlFor="blood_type_patient"
                      className="block mb-1 font-medium text-gray-700"
                    >
                      Tipo de Sangre
                    </label>
                    <input
                      id="blood_type_patient" // ID único
                      onChange={(e) => setFormData({ ...formData, blood_type: e.target.value })}
                      type="text"
                      value={formData.blood_type}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              {/* Botones */}
              <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-5 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Edición de Usuario */}
      {isEditing && selectedUser && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Editar Usuario</h2>

            <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campo: ID (solo lectura para edición) */}
              <div>
                <label htmlFor="edit_user_id" className="block mb-1 font-medium text-gray-700">
                  ID / Cédula
                </label>
                <input
                  id="edit_user_id"
                  type="text"
                  value={selectedUser.user_id} // Mostrar el ID original
                  readOnly // Hacerlo de solo lectura
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                />
              </div>
              {/* Campo: Nombre */}
              <div>
                <label htmlFor="edit_first_name" className="block mb-1 font-medium text-gray-700">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit_first_name"
                  type="text"
                  onChange={(e) => setEditData({ ...editData, first_name: e.target.value })}
                  defaultValue={selectedUser.first_name}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Campo: Apellido */}
              <div>
                <label htmlFor="edit_last_name" className="block mb-1 font-medium text-gray-700">
                  Apellido <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit_last_name"
                  type="text"
                  onChange={(e) => setEditData({ ...editData, last_name: e.target.value })}
                  defaultValue={selectedUser.last_name}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Campo: Correo */}
              <div>
                <label htmlFor="edit_email" className="block mb-1 font-medium text-gray-700">
                  Correo <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit_email"
                  type="email"
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  defaultValue={selectedUser.email}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              {/* Campo: Dirección */}
              <div>
                <label htmlFor="edit_address" className="block mb-1 font-medium text-gray-700">
                  Dirección
                </label>
                <input
                  id="edit_address"
                  type="text"
                  onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                  defaultValue={selectedUser.address}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Campo: Teléfono */}
              <div>
                <label htmlFor="edit_phone" className="block mb-1 font-medium text-gray-700">
                  Teléfono
                </label>
                <input
                  id="edit_phone"
                  type="tel"
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  defaultValue={selectedUser.phone}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Campo: Fecha de Nacimiento */}
              <div>
                <label htmlFor="edit_birth_date" className="block mb-1 font-medium text-gray-700">
                  Fecha de Nacimiento
                </label>
                <input
                  id="edit_birth_date"
                  type="date"
                  onChange={(e) => setEditData({ ...editData, birth_date: e.target.value })}
                  defaultValue={selectedUser.birth_date?.slice(0, 10)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Campo: Rol (Editable) */}
              <div>
                <label htmlFor="edit_role_name" className="block mb-1 font-medium text-gray-700">
                  Rol <span className="text-red-500">*</span>
                </label>
                <select
                  id="edit_role_name"
                  value={editedUser.role_name} // Controlar con editedUser para el estado interno del select
                  onChange={(e) => {
                    setEditedUser((prev) => ({
                      ...prev,
                      role_name: e.target.value,
                    }));
                    setEditData({ ...editData, role_name: e.target.value });
                  }}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="" disabled>
                    Seleccione un rol
                  </option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="PATIENT">PACIENTE</option>
                  <option value="DOCTOR">DOCTOR</option>
                </select>
              </div>
              {/* Campos condicionales para DOCTOR en edición */}
              {editedUser.role_name === "DOCTOR" && (
                <>
                  <div className="mt-4">
                    <label
                      htmlFor="edit_specialty"
                      className="block mb-1 font-medium text-gray-700"
                    >
                      Especialidad <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="edit_specialty"
                      type="text"
                      onChange={(e) => setEditData({ ...editData, specialty: e.target.value })}
                      defaultValue={selectedUser?.specialty}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  {/* Campo: Tipo de Sangre (para DOCTOR en edición) */}
                  <div>
                    <label
                      htmlFor="edit_blood_type_doctor"
                      className="block mb-1 font-medium text-gray-700"
                    >
                      Tipo de Sangre
                    </label>
                    <input
                      id="edit_blood_type_doctor"
                      type="text"
                      onChange={(e) => setEditData({ ...editData, blood_type: e.target.value })}
                      defaultValue={selectedUser?.blood_type}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
              {/* Campos condicionales para PATIENT en edición */}
              {editedUser.role_name === "PATIENT" && (
                <>
                  <div className="mt-4">
                    <label
                      htmlFor="edit_health_insurance"
                      className="block mb-1 font-medium text-gray-700"
                    >
                      Seguro Médico
                    </label>
                    <input
                      id="edit_health_insurance"
                      type="text"
                      onChange={(e) =>
                        setEditData({ ...editData, health_insurance: e.target.value })
                      }
                      defaultValue={selectedUser?.health_insurance}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mt-4">
                    <label
                      htmlFor="edit_allergies"
                      className="block mb-1 font-medium text-gray-700"
                    >
                      Alergias
                    </label>
                    <input
                      id="edit_allergies"
                      type="text"
                      onChange={(e) => setEditData({ ...editData, allergies: e.target.value })}
                      defaultValue={selectedUser?.allergies}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {/* Campo: Tipo de Sangre (para PATIENT en edición) */}
                  <div>
                    <label
                      htmlFor="edit_blood_type_patient"
                      className="block mb-1 font-medium text-gray-700"
                    >
                      Tipo de Sangre
                    </label>
                    <input
                      id="edit_blood_type_patient"
                      type="text"
                      onChange={(e) => setEditData({ ...editData, blood_type: e.target.value })}
                      defaultValue={selectedUser?.blood_type}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              {/* Botones */}
              <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={handleCloseEditForm}
                  className="px-5 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Confirmación para eliminar */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Confirmar Eliminación</h2>
            <p className="mb-6 text-gray-600">
              ¿Estás seguro de que quieres eliminar a {selectedUser?.first_name}{" "}
              {selectedUser?.last_name}?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Mensajes de error y éxito */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-[9999]">
          {error}
        </div>
      )}
      {success && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-[9999]">
          {success}
        </div>
      )}
      {/* Spinner de carga */}
      {spinner && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeAdmin;