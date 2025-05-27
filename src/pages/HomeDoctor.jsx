import { useState, useEffect, useCallback } from "react";
import { getMyLabs, getAllLabs, getLabsForUser } from "../utils/laboratorios";
import { GetUsersByID } from "../utils/users";
import { Eye, Search, XCircle, CheckCircle, SlidersHorizontal } from "lucide-react"; // SlidersHorizontal se mantiene para el filtro

export default function HomeDoctor() {
  // Estados para la gestión de vistas y datos
  const [activeTab, setActiveTab] = useState("mis"); // 'mis', 'consultar', 'subir'
  const [myLabResults, setMyLabResults] = useState([]); // Labs del usuario actual (FILTRADOS para "Mis Laboratorios")
  const [myLabResultsBase, setMyLabResultsBase] = useState([]); // Labs del usuario actual (SIN FILTRAR, la base)
  const [allLabsData, setAllLabsData] = useState([]); // TODOS los laboratorios (base para "Consultar Laboratorio" y sus filtros)
  const [filteredLabs, setFilteredLabs] = useState([]); // Resultados mostrados en la tabla de 'consultar'
  const [isLoading, setIsLoading] = useState(false);

  // --- ESTADOS PARA LOS FILTROS DE 'MIS LABORATORIOS' ---
  const [myFilterLabName, setMyFilterLabName] = useState("");
  const [myFilterLabDate, setMyFilterLabDate] = useState("");
  const [myFilterPatientName, setMyFilterPatientName] = useState(""); // <--- NUEVO ESTADO PARA EL FILTRO POR NOMBRE DE PACIENTE

  // ESTADOS PARA LOS FILTROS DE 'CONSULTAR LABORATORIO'
  const [consultFilterPatientId, setConsultFilterPatientId] = useState("");
  const [consultFilterLabName, setConsultFilterLabName] = useState("");
  const [consultFilterLabDate, setConsultFilterLabDate] = useState("");

  // Estados para el formulario de subir laboratorio
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [labName, setLabName] = useState("");
  const [labDate, setLabDate] = useState("");
  const [patientId, setPatientId] = useState(""); // Para el formulario de subir
  const [patientValidation, setPatientValidation] = useState(null);
  const [patientFullName, setPatientFullName] = useState("");
  const [doctorId, setDoctorId] = useState(""); // Para el formulario de subir
  const [doctorValidation, setDoctorValidation] = useState(null);
  const [doctorFullName, setDoctorFullName] = useState("");

  // Estados para mensajes de feedback (errores y éxitos)
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // --- Funciones de Carga de Datos ---

  const fetchMyLabs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getMyLabs();
      if (response) {
        setMyLabResultsBase(response); // Guarda la base sin filtrar
        setMyLabResults(response); // Inicialmente, muestra todos
      } else {
        setError("Error al obtener tus laboratorios.");
      }
    } catch (err) {
      console.error("Error fetching my labs:", err);
      setError("No se pudieron cargar tus laboratorios. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAllLabsOnce = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAllLabs();
      if (response) {
        setAllLabsData(response); // Guarda TODOS los labs originales como base para la búsqueda general
      } else {
        setError("Error al obtener todos los laboratorios.");
      }
    } catch (err) {
      console.error("Error fetching all labs:", err);
      setError("No se pudieron cargar todos los laboratorios. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- Función para aplicar los filtros a "Mis Laboratorios" ---
  const applyMyFilters = useCallback(() => {
    let currentFiltered = [...myLabResultsBase];

    // Filtro por nombre del examen
    if (myFilterLabName) {
      currentFiltered = currentFiltered.filter((lab) =>
        lab.lab_name.toLowerCase().includes(myFilterLabName.toLowerCase())
      );
    }

    // Filtro por fecha del examen
    if (myFilterLabDate) {
      currentFiltered = currentFiltered.filter(
        (lab) => new Date(lab.lab_date).toISOString().slice(0, 10) === myFilterLabDate
      );
    }

    // <--- NUEVO FILTRO POR NOMBRE DE PACIENTE (EN MIS LABORATORIOS) ---
    if (myFilterPatientName) {
      currentFiltered = currentFiltered.filter((lab) =>
        lab.patient_name.toLowerCase().includes(myFilterPatientName.toLowerCase())
      );
    }

    setMyLabResults(currentFiltered);
    if (
      currentFiltered.length === 0 &&
      (myFilterLabName || myFilterLabDate || myFilterPatientName)
    ) {
      setError("No se encontraron laboratorios con los filtros aplicados.");
      setTimeout(() => setError(null), 3000);
    }
  }, [myLabResultsBase, myFilterLabName, myFilterLabDate, myFilterPatientName]);

  // --- Efecto para aplicar filtros cuando cambian los estados de filtro de "Mis Labs" ---
  useEffect(() => {
    if (activeTab === "mis") {
      applyMyFilters();
    }
  }, [myFilterLabName, myFilterLabDate, myFilterPatientName, activeTab, applyMyFilters]); // myFilterPatientName añadido a las dependencias

  // --- Efecto para cargar datos iniciales o resetear vistas al cambiar de pestaña ---
  useEffect(() => {
    setError(null);
    setSuccess(null);
    setIsLoading(false); // Resetear loading al cambiar de tab

    if (activeTab === "mis") {
      fetchMyLabs(); // Carga los laboratorios del usuario directamente
      setMyFilterLabName(""); // Limpiar filtros al cambiar a esta pestaña
      setMyFilterLabDate("");
      setMyFilterPatientName(""); // Limpiar el nuevo filtro
    } else if (activeTab === "consultar") {
      fetchAllLabsOnce(); // Asegura que tenemos todos los labs cargados para la base de búsqueda
      setFilteredLabs([]); // Inicia la tabla de consultar VACÍA
      setConsultFilterPatientId(""); // Limpiar campos de búsqueda al cambiar a esta pestaña
      setConsultFilterLabName("");
      setConsultFilterLabDate("");
    } else if (activeTab === "subir") {
      // Limpiar campos del formulario de subir si se vuelve a la pestaña
      setFile(null);
      setFileName("");
      setLabName("");
      setLabDate("");
      setPatientId("");
      setDoctorId("");
      setPatientValidation(null);
      setPatientFullName("");
      setDoctorValidation(null);
      setDoctorFullName("");
    }
  }, [activeTab, fetchMyLabs, fetchAllLabsOnce]); // Dependencias para useCallback

  // --- Funciones de Búsqueda y Filtrado (Solo para "Consultar Laboratorio") ---
  const handleSearch = async () => {
    if (activeTab !== "consultar") return;

    if (!consultFilterPatientId) {
      setError("Por favor, ingresa el ID del paciente para buscar.");
      setTimeout(() => setError(null), 3000);
      setFilteredLabs([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await getLabsForUser(consultFilterPatientId);
      let currentFiltered = [...results];

      if (consultFilterLabName) {
        currentFiltered = currentFiltered.filter((lab) =>
          lab.lab_name.toLowerCase().includes(consultFilterLabName.toLowerCase())
        );
      }
      if (consultFilterLabDate) {
        currentFiltered = currentFiltered.filter(
          (lab) => new Date(lab.lab_date).toISOString().slice(0, 10) === consultFilterLabDate
        );
      }

      setFilteredLabs(currentFiltered);
      if (currentFiltered.length === 0) {
        setError("No se encontraron laboratorios para el paciente con ese ID y filtros.");
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      console.error("Error searching labs:", err);
      setError("Hubo un error al buscar laboratorios. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    if (activeTab !== "consultar") return;

    setConsultFilterPatientId("");
    setConsultFilterLabName("");
    setConsultFilterLabDate("");
    setFilteredLabs([]);
    setError(null);
  };

  // --- Funciones de Validación de IDs (Paciente/Doctor para Subir Laboratorio) ---
  const validateUser = async (id, setUserValidation, setUserNameCallback, expectedRole) => {
    if (!id) {
      setError("Ingresa un ID para buscar.");
      setTimeout(() => setError(null), 3000);
      return;
    }
    setUserValidation(null);
    if (setUserNameCallback) {
      setUserNameCallback("");
    }

    try {
      const user = await GetUsersByID(id);

      if (!Array.isArray(user) || user.length === 0) {
        setUserValidation("notfound");
        setError(`No se encontró el ${expectedRole === "PATIENT" ? "paciente" : "doctor"}.`);
        return;
      }

      if (user[0].role_name === expectedRole) {
        setUserValidation("ok");
        if (setUserNameCallback) {
          setUserNameCallback(`${user[0].first_name} ${user[0].last_name}`);
        }
        setSuccess(
          `${expectedRole === "PATIENT" ? "Paciente" : "Doctor"} validado: ${user[0].first_name} ${
            user[0].last_name
          }.`
        );
      } else {
        setUserValidation("notfound");
        setError(
          `El ID ingresado no corresponde a un ${
            expectedRole === "PATIENT" ? "paciente" : "doctor"
          }.`
        );
      }
    } catch (error) {
      console.error("Error validating user:", error);
      setUserValidation("notfound");
      setError("Error de conexión al validar. Intenta de nuevo.");
    } finally {
      setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
    }
  };

  // --- Función para Subir Laboratorio ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (patientValidation !== "ok" || doctorValidation !== "ok") {
      setError(
        "Por favor, valida el ID del paciente y el ID del doctor antes de subir el laboratorio."
      );
      setTimeout(() => setError(null), 5000);
      return;
    }

    if (!file || !labName || !labDate || !patientId || !doctorId) {
      setError("Por favor, completa todos los campos del formulario.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("lab_Name", labName);
    formData.append("lab_Date", labDate);
    formData.append("patient_Id", patientId);
    formData.append("doctor_Id", doctorId);

    try {
      const response = await fetch("http://localhost:3000/labs/create", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al subir el laboratorio.");
      }

      setSuccess("Laboratorio subido con éxito.");
      // Limpiar formulario para una nueva entrada
      setFile(null);
      setFileName("");
      setLabName("");
      setLabDate("");
      setPatientId("");
      setDoctorId("");
      setPatientValidation(null);
      setPatientFullName("");
      setDoctorValidation(null);
      setDoctorFullName("");
    } catch (err) {
      console.error("Error submitting lab:", err);
      setError(err.message || "Error al subir el laboratorio. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
    }
  };

  return (
    <div className="h-screen p-6 bg-gray-100 flex flex-col">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-blue-600 text-center">Laboratorios</h1>
      </div>

      {/* --- Navegación por Pestañas --- */}
      <div className="flex flex-col md:flex-row border-b border-gray-300 mb-4">
        <div className="flex justify-center w-full md:w-1/3 py-2">
          <button
            onClick={() => setActiveTab("mis")}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === "mis"
                ? "border-b-4 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            Mis Laboratorios
          </button>
        </div>

        <div className="flex justify-center w-full md:w-1/3 py-2">
          <button
            onClick={() => setActiveTab("consultar")}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === "consultar"
                ? "border-b-4 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            Consultar Laboratorio
          </button>
        </div>

        <div className="flex justify-center w-full md:w-1/3 py-2">
          <button
            onClick={() => setActiveTab("subir")}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === "subir"
                ? "border-b-4 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            Subir Laboratorio
          </button>
        </div>
      </div>

      {/* --- Contenido de la Vista Activa --- */}
      <div className="flex-1 p-4 bg-white rounded-lg shadow overflow-auto">
        {/* --- Vista: Mis Laboratorios --- */}
        {activeTab === "mis" && (
          <>
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4">Mis Laboratorios</h2>

              {/* --- Barra de filtros para Mis Laboratorios --- */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end">
                <input
                  type="text"
                  placeholder="Filtrar por nombre de paciente"
                  value={myFilterPatientName}
                  onChange={(e) => setMyFilterPatientName(e.target.value)}
                  className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Filtrar por nombre de examen"
                  value={myFilterLabName}
                  onChange={(e) => setMyFilterLabName(e.target.value)}
                  className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  placeholder="Filtrar por fecha"
                  value={myFilterLabDate}
                  onChange={(e) => setMyFilterLabDate(e.target.value)}
                  className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex items-center justify-start gap-2 col-span-full md:col-span-1">
                  {" "}
                  {/* Ajuste en columnas */}
                  <button
                    onClick={() => {
                      setMyFilterPatientName("");
                      setMyFilterLabName("");
                      setMyFilterLabDate("");
                    }}
                    className="px-8 py-3 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition w-full md:w-auto"
                  >
                    Limpiar Filtros
                  </button>
                </div>
              </div>
              {/* --- Fin Barra de filtros --- */}

              {isLoading ? (
                <p className="text-center text-gray-600">Cargando tus laboratorios...</p>
              ) : (
                <table className="w-full border-collapse border border-neutral-400">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="border border-neutral-400 p-2">ID Lab</th>
                      <th className="border border-neutral-400 p-2">Paciente</th>
                      <th className="border border-neutral-400 p-2">Doctor</th>
                      <th className="border border-neutral-400 p-2">Examen</th>
                      <th className="border border-neutral-400 p-2">Fecha</th>
                      <th className="border border-neutral-400 p-2">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="text-black">
                    {myLabResults.length > 0 ? (
                      myLabResults.map((result) => (
                        <tr key={result.lab_id} className="bg-white hover:bg-gray-50">
                          <td className="border border-neutral-300 p-2">{result.lab_id}</td>
                          <td className="border border-neutral-300 p-2">{result.patient_name}</td>
                          <td className="border border-neutral-300 p-2">{result.doctor_name}</td>
                          <td className="border border-neutral-300 p-2">{result.lab_name}</td>
                          <td className="border border-neutral-300 p-2">
                            {new Date(result.lab_date).toLocaleDateString()}
                          </td>
                          <td className="border border-neutral-300 p-2">
                            <div className="flex justify-center items-center">
                              <a
                                href={result.file_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center"
                                title="Ver Documento"
                              >
                                <Eye size={18} />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center text-gray-500 py-4">
                          No tienes laboratorios registrados o no hay resultados para los filtros
                          aplicados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* --- Vista: Consultar Laboratorio --- */}
        {activeTab === "consultar" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end">
              <input
                type="text"
                placeholder="ID del paciente"
                value={consultFilterPatientId}
                onChange={(e) => setConsultFilterPatientId(e.target.value)}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={handleSearch}
                  className="px-8 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition flex items-center justify-center gap-2"
                >
                  <Search size={18} /> Buscar
                </button>
                <button
                  onClick={clearSearch}
                  className="px-8 py-3 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition flex items-center justify-center gap-2"
                >
                  limpiar filtro
                </button>
              </div>
            </div>

            {/* Tabla de resultados de la consulta */}
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4">Resultados de la Consulta</h2>
              {isLoading ? (
                <p className="text-center text-gray-600">Buscando laboratorios...</p>
              ) : (
                <table className="w-full border-collapse border border-neutral-400">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="border border-neutral-400 p-2">ID Lab</th>
                      <th className="border border-neutral-400 p-2">Paciente</th>
                      <th className="border border-neutral-400 p-2">Doctor</th>
                      <th className="border border-neutral-400 p-2">Examen</th>
                      <th className="border border-neutral-400 p-2">Fecha</th>
                      <th className="border border-neutral-400 p-2">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="text-black">
                    {filteredLabs.length > 0 ? (
                      filteredLabs.map((result) => (
                        <tr key={result.lab_id} className="bg-white hover:bg-gray-50">
                          <td className="border border-neutral-300 p-2">{result.lab_id}</td>
                          <td className="border border-neutral-300 p-2">{result.patient_name}</td>
                          <td className="border border-neutral-300 p-2">{result.doctor_name}</td>
                          <td className="border border-neutral-300 p-2">{result.lab_name}</td>
                          <td className="border border-neutral-300 p-2">
                            {new Date(result.lab_date).toLocaleDateString()}
                          </td>
                          <td className="border border-neutral-300 p-2">
                            <div className="flex justify-center items-center">
                              <a
                                href={result.file_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center"
                                title="Ver Documento"
                              >
                                <Eye size={18} />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center text-gray-500 py-4">
                          Realiza una búsqueda por ID de paciente para ver resultados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* --- Vista: Subir Laboratorio --- */}
        {activeTab === "subir" && (
          <div className="max-w-xl mx-auto">
            <h2 className="text-xl font-bold mb-6 text-center text-blue-600">Subir Laboratorio</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col">
                Archivo (PDF, imagen o documento)
                <input
                  type="file"
                  accept=".pdf,image/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(e) => {
                    const selectedFile = e.target.files[0];
                    setFile(selectedFile);
                    setFileName(selectedFile ? selectedFile.name : "");
                  }}
                  className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {fileName && (
                  <p className="text-sm text-gray-500 mt-1">Archivo seleccionado: {fileName}</p>
                )}
              </label>

              <label className="flex flex-col">
                Nombre del examen
                <input
                  type="text"
                  value={labName}
                  onChange={(e) => setLabName(e.target.value)}
                  placeholder="Nombre del examen"
                  className="mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </label>

              <label className="flex flex-col">
                Fecha del examen
                <input
                  type="date"
                  value={labDate}
                  onChange={(e) => setLabDate(e.target.value)}
                  className="mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </label>

              {/* ID del paciente con icono de búsqueda */}
              <label className="flex flex-col relative">
                ID del paciente
                <input
                  type="text"
                  value={patientId}
                  onChange={(e) => {
                    setPatientId(e.target.value);
                    setPatientValidation(null);
                    setPatientFullName("");
                  }}
                  placeholder={patientValidation === "ok" ? patientFullName : "ID del paciente"}
                  className={`mt-1 p-3 border rounded-md focus:outline-none focus:ring-2 ${
                    patientValidation === "ok"
                      ? "border-green-500 focus:ring-green-500"
                      : patientValidation === "notfound"
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  required
                />
                <Search
                  size={20}
                  className="absolute right-3 top-1/2 -translate-y-1/4 cursor-pointer text-gray-500 hover:text-blue-600"
                  onClick={() =>
                    validateUser(patientId, setPatientValidation, setPatientFullName, "PATIENT")
                  }
                  title="Validar paciente"
                />
                {patientValidation === "notfound" && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <XCircle size={16} /> Paciente no encontrado con ese id.
                  </p>
                )}
                {patientValidation === "ok" && (
                  <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                    <CheckCircle size={16} /> Paciente validado: <strong>{patientFullName}</strong>
                  </p>
                )}
              </label>

              {/* ID del doctor con icono de búsqueda */}
              <label className="flex flex-col relative">
                ID del doctor
                <input
                  type="text"
                  value={doctorId}
                  onChange={(e) => {
                    setDoctorId(e.target.value);
                    setDoctorValidation(null);
                    setDoctorFullName("");
                  }}
                  placeholder={doctorValidation === "ok" ? doctorFullName : "ID del doctor"}
                  className={`mt-1 p-3 border rounded-md focus:outline-none focus:ring-2 ${
                    doctorValidation === "ok"
                      ? "border-green-500 focus:ring-green-500"
                      : doctorValidation === "notfound"
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  required
                />
                <Search
                  size={20}
                  className="absolute right-3 top-1/2 -translate-y-1/4 cursor-pointer text-gray-500 hover:text-blue-600"
                  onClick={() =>
                    validateUser(doctorId, setDoctorValidation, setDoctorFullName, "DOCTOR")
                  }
                  title="Validar doctor"
                />
                {doctorValidation === "notfound" && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <XCircle size={16} /> Doctor no encontrado con ese id.
                  </p>
                )}
                {doctorValidation === "ok" && (
                  <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                    <CheckCircle size={16} /> Doctor validado: <strong>{doctorFullName}</strong>
                  </p>
                )}
              </label>

              {/* Botón de submit */}
              <button
                type="submit"
                className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:bg-blue-300"
                disabled={isLoading || patientValidation !== "ok" || doctorValidation !== "ok"}
              >
                {isLoading ? "Subiendo..." : "Subir Laboratorio"}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* --- Mensajes de Feedback --- */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-[9999] flex items-center gap-2">
          <XCircle size={20} /> {error}
        </div>
      )}
      {success && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-[9999] flex items-center gap-2">
          <CheckCircle size={20} /> {success}
        </div>
      )}
    </div>
  );
}