import { useState } from "react";
import { User, Eyes, Gmail, EyesLash } from "../../icons/AllIcons.jsx";
import { supabase } from "../../lib/supabaseClient.js";

export const Login = () => {
    // 1. Estados para formulario y UI
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // 2. Función para mostrar mensajes de error/info
    const showMessage = (message) => {
        setError(message);
        setTimeout(() => setError(""), 5000);
    };

    // Funciones de manejo de UI
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    // 3. Lógica de inicio de sesión con Email y Contraseña (Supabase)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        setError("");
        setLoading(true);

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (authError) {
                if (authError.status === 400) {
                    showMessage("Credenciales inválidas. Verifica tu email y contraseña.");
                } else {
                    showMessage("Error al iniciar sesión: " + authError.message);
                }
            } else {
                window.location.href = '/home';
            }
        } catch (err) {
            showMessage("Ocurrió un error inesperado durante el login.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    // 4. Lógica de inicio de sesión con Google Auth (Supabase)
    const handleGoogleLogin = async () => {
        if (loading) return;

        setError("");
        setLoading(true);

        try {
            const { error: authError } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/home`,
                },
            });

            if (authError) {
                showMessage("Error al iniciar sesión con Google: " + authError.message);
                setLoading(false);
            }
        } catch (e) {
            showMessage("Excepción al iniciar sesión con Google.");
            console.error('Excepción al iniciar sesión:', e);
            setLoading(false);
        }
    };

    return (
        <div className="mt-6 w-full">
            {/* Mensaje de Error/Carga */}
            {error && (
                <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg shadow-md transition-all duration-300 border border-red-200">
                    {error}
                </div>
            )}
            {loading && !error && (
                <div className="p-3 mb-4 text-sm text-indigo-700 bg-indigo-100 rounded-lg shadow-md border border-indigo-200">
                    Cargando...
                </div>
            )}

            {/* ESTRUCTURA DEL FORMULARIO EMAIL/PASSWORD */}
            <form onSubmit={handleSubmit}>
                <div className="relative mb-4 flex flex-row justify-center items-center bg-white shadow-md rounded-lg">
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder=" "
                        disabled={loading}
                        className="peer w-full p-3 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0c3b87]"
                    />
                    <label
                        htmlFor="email"
                        className="absolute left-4 top-1/2 -translate-y-2/3 text-gray-400 text-sm transition-all duration-200 
                                     peer-placeholder-shown:text-sm 
                                     peer-focus:top-0 peer-focus:text-xs peer-focus:text-[#0c3b87]
                                     peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-xs bg-white px-1"
                    >
                        Digite su Email
                    </label>
                    <User className="w-6 h-6 absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 peer-focus:text-[#0c3b87]" />
                </div>

                <div className="relative mb-3 flex flex-row justify-center items-center bg-white shadow-md rounded-lg">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        onChange={handleChange}
                        value={formData.password}
                        placeholder=" "
                        disabled={loading}
                        className="peer w-full p-3 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0c3b87]"
                        required
                    />
                    <label
                        htmlFor="password"
                        className="absolute left-4 top-1/2 -translate-y-2/3 text-gray-400 text-sm transition-all duration-200 
                                     peer-placeholder-shown:text-sm 
                                     peer-focus:top-0 peer-focus:text-xs peer-focus:text-[#0c3b87]
                                     peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-xs bg-white px-1"
                    >
                        Digite su Contraseña
                    </label>
                    <button
                        type="button"
                        disabled={loading}
                        className="cursor-pointer text-gray-700 peer-focus:text-[#0c3b87] absolute right-3 top-1/2 -translate-y-1/2 p-1"
                        onClick={togglePassword}
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                        {showPassword ? <Eyes className="w-6 h-6" /> : <EyesLash className="w-6 h-6" />}
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="cursor-pointer w-full p-3 mt-3 rounded-lg bg-[#0c3b87] hover:bg-[#0c3b87]/85 text-white font-semibold shadow-md transition duration-150 disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    {loading ? "Verificando..." : "Iniciar sesión"}
                </button>
            </form>


        </div>
    )
}