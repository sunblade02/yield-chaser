import React from "react"
import { CheckCircle2, CircleX } from "lucide-react"
import { Button } from "../ui/button"
import Link from "next/link"

const TransactionResult = ({
    children,
    type,
    title,
    description,
    onClick,
    buttonText,
    href
} : {
    children?: React.ReactNode,
    type: "success" | "error"
    title: string,
    description?: string,
    onClick?: () => void,
    buttonText?: string
    href?: string
}) => {
    return (
        <div className="flex items-center justify-center px-20">
            <div className="flex flex-col items-center max-w-[560px]">
                {type === "success" ?
                    <CheckCircle2 className="size-10 mb-6 text-main" />
                :
                    <CircleX className="size-10 mb-6 text-red-700" />
                }
                <h2 className="mb-6 text-center">{title}</h2>
                {description &&
                    <div className="text-muted-foreground text-center mb-6">
                        {description}
                    </div>
                }
                {children &&
                    <div className="mb-6">
                        {children}
                    </div>
                }
                {href ?
                    <Button className="w-full" asChild>
                        <Link href={href}>{buttonText ?? "Go back"}</Link>
                    </Button>
                :
                    <Button className="w-full" onClick={onClick}>{buttonText ?? "Go back"}</Button>
                }
            </div>
        </div>
    )
}

export default TransactionResult