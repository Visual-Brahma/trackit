import { CustomComponentProps } from "@/types";
import { FC } from "react";

const AppLayout: FC<CustomComponentProps>=({ children }) => {
    return (
        <div>
            {children}
        </div>
    );
};

export default AppLayout;
