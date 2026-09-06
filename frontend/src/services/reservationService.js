export async function submitReservation(formData) {
    const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })

    const responseBody = await response.json()

    if (!response.ok) {
        const error = new Error(
            responseBody.message || 'The reservation could not be submitted.',
        )

        error.status = response.status
        error.fieldErrors = responseBody.errors || {}

        throw error
    }

    return responseBody
}