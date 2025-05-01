import React from 'react';

interface AlertProps {
    message: string;
    onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, onClose }) => {
    return (
        <div className="fixed top-0 left-0 right-0 p-4 bg-red-500 text-white text-center">
            <div className="flex justify-between items-center">
                <span>{message}</span>
                <button onClick={onClose} className="ml-2 text-xl font-bold">×</button>
            </div>
        </div>
    );
};

export default Alert;
