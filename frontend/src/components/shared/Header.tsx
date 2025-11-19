import { Button } from "../ui/button"

const Header = () => {
    return (
        <header className="fixed w-full">
            <nav className="flex items-center justify-between h-[60px] px-20 border-b">
                <div>Yield Chaser</div>
                <div className="hidden md:flex gap-6">
                    <a className="text-muted-foreground hover:text-foreground  transition-colors" href="#">Product</a>
                    <a className="text-muted-foreground hover:text-foreground transition-colors" href="#">Pricing</a>
                    <a className="text-muted-foreground hover:text-foreground transition-colors" href="#">Docs</a>
                    <a className="text-muted-foreground hover:text-foreground transition-colors" href="#">Contact</a>
                </div>
                <Button>Open App</Button>
            </nav>
        </header>
    )
}

export default Header