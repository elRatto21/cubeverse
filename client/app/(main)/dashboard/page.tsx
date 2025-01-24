'use client';
import { useAuth } from "@/store/useAuth"

const DashboardPage = () => {

    const { user, loading, error} = useAuth();

    return (
        <div>
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
            {user && <div>Welcome, {user.username}! {user.id} </div>}
        </div>
    )
} 

export default DashboardPage;