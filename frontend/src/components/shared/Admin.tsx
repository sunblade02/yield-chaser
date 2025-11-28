import { contractABI, contractAddress } from "@/constants/contracts/registry";
import { useAccount, useReadContract } from "wagmi";
import UpdateStrategyVaultsNetAPY from "./Admin/UpdateStrategyVaultsNetAPY";
import { useGetStrategy } from "@/hooks/strategy/useGetStrategy";

const Admin = () => {
    const { address } = useAccount();

    const {data: botRole} = useReadContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "BOT_ROLE",
    });

    const {data: isAutorizedBot} = useReadContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "hasRole",
        args: [ botRole, address ],
        query: {
            enabled: !!address && !!botRole
        }
    });

    const { data: strategyAddress } = useReadContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "strategies",
        args: [ 0 ]
    });
    
    const { data: strategy, } = useGetStrategy(strategyAddress);

    return (
        <>
            <h1 className="mb-6">Admin panel</h1>
            {isAutorizedBot &&
                <>
                    <h2 className="mb-6">Bot actions</h2>
                    <div className="flex">
                        <UpdateStrategyVaultsNetAPY strategy={strategy} />
                    </div>
                </>
            }
        </>
    )
}

export default Admin