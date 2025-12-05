import { Spinner } from "../ui/spinner"

const Loading = ({
    title,
    description
} : {
    title: string,
    description?: string
}) => {
    return (
        <div className="flex items-center justify-center px-20">
            <div className="flex flex-col items-center max-w-[700px]">
                <Spinner className="size-10 mb-6 text-main" />
                <h2 className="mb-6 text-center">{title}</h2>
                {description && 
                    <div className="text-muted-foreground text-center">
                        {description}
                    </div>
                }
            </div>
        </div>
    )
}

export default Loading