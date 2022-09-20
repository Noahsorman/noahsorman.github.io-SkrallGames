import useAuth from "./useAuth";
import { useNavigate } from 'react-router'

const useLogout = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const logout = async () => {
        setAuth({})
        return navigate("/Login")
    }
    return logout;
}

export default useLogout