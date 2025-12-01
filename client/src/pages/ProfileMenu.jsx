import React from 'react'
import Header from '../components/Header'
import MobileFooter from '../components/MobileFooter'
import Footer from '../components/Footer'

const ProfileMenu = () => {
    return (
        <div>
            <div>
                <Header />
            </div>
            <div>
                <Footer />
            </div>
            <div className="fixed bottom-0 w-full md:hidden z-50">
                <MobileFooter />
            </div>
        </div>
    )
}

export default ProfileMenu
