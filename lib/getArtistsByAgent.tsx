const getArtistsByAgent = async (agent: any) => {
    try {
        const socialIds = agent.agent_status.map((agent_status: any) => agent_status.social_id)
        const response = await fetch("/api/get_artists_by_socials", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({socialIds})
        })

        const data = await response.json();

        return data.artistIds || []
    } catch(error) {
        console.error(error)
        return []
    }
}

export default getArtistsByAgent