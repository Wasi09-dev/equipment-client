const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const createGear = async (data)=>{
    const res = await fetch(`${BASE_URL}/gears`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return res.json();
};