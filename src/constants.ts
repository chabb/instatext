export interface ITMessage {
    recipients: string[];
    message: string;
    timestamp: number;
}

export interface ModalProps {
    onFinish: () => void;
}

// DB -> a users
