import {
    AvatarComponent,
} from '@rainbow-me/rainbowkit';
import { Wallet } from 'lucide-react';

const CustomAvatar: AvatarComponent = ({ address, size }) => {
    return (
        <div className="flex justify-center items-center border"
            style={{
                borderRadius: 999,
                height: size,
                width: size,
            }}
        >
            <Wallet size={40} className="text-muted-foreground" />
        </div>
    );
};

export default CustomAvatar;