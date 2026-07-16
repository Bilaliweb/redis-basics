import { fetchLeaderboardUsers } from "./newUsers.js"

export async function getLeaderboard(req, res) {
    const allUsers = await fetchLeaderboardUsers()
    console.log('All users in get lead: ', allUsers);
    
    return res.render('leaderboard', {
        users: allUsers
    })
}