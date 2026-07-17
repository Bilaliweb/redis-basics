import { fetchLeaderboardUsers } from "./newUsers.js"

export async function getLeaderboard(req, res) {
    const allUsers = await fetchLeaderboardUsers()
    
    return res.render('leaderboard', {
        users: allUsers
    })
}