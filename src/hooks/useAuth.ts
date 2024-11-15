const useAuth = () => {
    const signout = () => {
        localStorage.removeItem("token");
    };
    const signin = async (email: string, password: string) => {
      try{
        const res  = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (data.token) {
            localStorage.setItem("token", data.token);
            return true;
        } else {
            return false;
        }
      }catch(error){
        console.log(error);
        throw new Error("An error occurred during login.");
      }
    };
    return { signout,signin };
};

export default useAuth;