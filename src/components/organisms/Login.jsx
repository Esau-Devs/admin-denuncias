import { useState } from "react"
import { User, Eyes, Gmail, EyesLash } from "../../icons/AllIcons.tsx"

export const Login = () => {

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    };
    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.email === "esau@gmail.com" && formData.password === "password") {
            window.location.href = '/home';
        } else {
            alert("Credenciales incorrectas");
        }
    }

    return (
        <div className="mt-6 w-full ">
            <form onSubmit={handleSubmit}>
                <div className="relative mb-4 flex flex-row justify-center items-center bg-gray-300/5 shadow-md rounded-lg">
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder=" "
                        className="peer w-full p-3 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0c3b87]"
                    />
                    <label
                        htmlFor="email"
                        className="absolute left-4 top-1/2 -translate-y-2/3 text-gray-400  text-sm transition-all duration-200 
                                peer-placeholder-shown:text-sm 
                                peer-focus:top-0 peer-focus:text-xs 
                                peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-xs bg-white px-1"
                    >
                        Digite su Email
                    </label>
                    <User className="w-6 h-6 absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 peer-focus:text-[#0c3b87]" />
                </div>



                <div className="relative mb-3 flex flex-row justify-center items-center bg-gray-300/5 shadow-md rounded-lg">

                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        onChange={handleChange}
                        value={formData.password}
                        placeholder=" "
                        className="peer w-full p-3 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0c3b87]"
                        required
                    />
                    <label
                        htmlFor="password"
                        className="absolute left-4 top-1/2 -translate-y-2/3 text-gray-400  text-sm transition-all duration-200 
                                peer-placeholder-shown:text-sm 
                                peer-focus:top-0 peer-focus:text-xs 
                                peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-xs bg-white px-1"
                    >
                        Digite su Contraseña
                    </label>
                    <button
                        type="button"
                        className="cursor-pointer text-gray-700 peer-focus:text-[#0c3b87]"
                        onClick={togglePassword}
                    >
                        {showPassword ? <Eyes className="w-6 h-6 absolute right-3 top-1/2 -translate-y-1/2 " /> : <EyesLash className="w-6 h-6 absolute right-3 top-1/2 -translate-y-1/2" />}

                    </button>

                </div>
                <button
                    type="submit" className="cursor-pointer w-full p-3 mt-3 rounded-lg bg-[#0c3b87] hover:bg-[#0c3b87]/85 text-white">
                    Iniciar sesion
                </button>
            </form>
            <button
                type="button"
                className="flex items-center justify-center gap-2 w-full p-3 mt-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 shadow-sm cursor-pointer"
                onClick={() => {/* Aquí va la lógica para login con Google */ }}
            >
                <Gmail className="w-6 h-6" />
                Iniciar sesión con Google
            </button>
        </div>
    )
}