
export async function checkTokenValidity(token) {
    try {
        const response = await fetch('http://localhost:3001/checkTokenValidity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        });

        const data = await response.json();
        return data.isValid;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}