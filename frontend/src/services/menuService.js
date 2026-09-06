export async function getMenu(options = {}) {
    const response = await fetch('/api/menu', {
        signal: options.signal,
    })

    const responseBody = await response.json()

    if (!response.ok) {
        throw new Error(
            responseBody.message || 'The menu could not be loaded.',
        )
    }

    return responseBody.categories
}