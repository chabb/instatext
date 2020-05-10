export interface ITMessage {
    recipients: string[];
    message: string;
    timestamp: number;
    ts: number;
}

export interface ModalProps {
    onFinish: () => void;
    form: any;
}

// DB -> a users
