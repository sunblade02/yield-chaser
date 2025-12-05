import { contractABI, contractAddress } from "@/constants/contracts/registry";
import { useAccount, useReadContract } from "wagmi";
import UpdateStrategyVaultsNetAPY from "./admin/update-strategy-vaults-net-apy";
import { useGetStrategy } from "@/hooks/strategy/use-get-strategy";
import SetNoReallocationPeriod from "./admin/set-no-reallocation-period";
import Reallocate from "./admin/reallocate";
import IncAssets from "./admin/inc-assets";
import { useYcAccount } from "@/provider/yc-account-provider";

const Admin = () => {
    const { address } = useAccount();
    const { hasAccount } = useYcAccount();

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

    const { data: strategy } = useGetStrategy(strategyAddress ? strategyAddress as `0x${string}` : undefined);

    return (
        <>
            <h1 className="mb-6">Admin panel</h1>
            {hasAccount &&
                <>
                    <h2 className="mb-6">Account</h2>
                    <div className="flex gap-4">
                        <SetNoReallocationPeriod />
                        <Reallocate />
                    </div>
                </>
            }
            {isAutorizedBot &&
                <>
                    <h2 className="mb-6">Bot actions</h2>
                    <div className="flex">
                        <UpdateStrategyVaultsNetAPY strategy={strategy} />
                    </div>
                </>
            }
            <h1 className="mb-6">Simulation</h1>
            <div className="flex">
                <IncAssets strategy={strategy} />
            </div>
        </>
    )
}

export default Admin