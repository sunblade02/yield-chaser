import React from "react"
import Footer from "./footer"
import Header from "./header"

const Layout = ({
    children
} : {
    children: React.ReactNode
}) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="grow md:mt-[60px] p-20 xl:px-80">
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default Layout