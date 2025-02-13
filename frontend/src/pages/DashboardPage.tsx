import Freezer from '@/assets/icons/Freezer'
import Fridge from '@/assets/icons/Fridge'

const DashboardPage = () => {
    return (
        <div>
            <h1>Dashboard</h1>

            <Fridge size={100} />
            <Freezer size={100} />
        </div>
    )
}

export default DashboardPage