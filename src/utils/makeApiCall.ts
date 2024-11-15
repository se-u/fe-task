export const makeApiCall = async (
    endpoint: string,
    method: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body?: any
  ) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  
    if (!response.ok) {
      console.error(`Error: ${response.statusText}`);
    }
  
    return response.json();
  };
  