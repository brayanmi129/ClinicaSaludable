export const getAllDoctors = async (token) => {
    try {
        const response = await fetch(import.meta.env.VITE_GET_ALL_DOCTORS, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        });
    
        if (!response.ok) {
        throw new Error('Failed to fetch doctors');
        }
    
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching doctors:', error);
        throw error;
    }
}