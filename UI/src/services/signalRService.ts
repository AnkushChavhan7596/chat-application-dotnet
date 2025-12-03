import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

let connection: any = null;

export const getConnection = () => connection;

export const startConnection = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        console.warn("No token found → SignalR will not connect.");
        return;
    }

    if (!connection) {
        connection = new HubConnectionBuilder()
            .withUrl("https://localhost:7229/chathub", {
                accessTokenFactory: () => token,
                withCredentials: true,
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();
    }

    if (connection.state === "Connected") return;

    try {
        await connection.start();
        console.log("SignalR Connected");
    } catch (err) {
        console.error("Connection failed:", err);
        setTimeout(startConnection, 3000);
    }
};
