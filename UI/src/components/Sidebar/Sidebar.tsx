import { useEffect, useState } from "react";
import "./Sidebar.css"
import { useNavigate } from 'react-router-dom';
import { usersService } from "../../services/usersService";
import { useAppSelector } from "../../store/hooks";
import { connect, useDispatch } from "react-redux";
import { clearCurrentChat, setCurrentChat } from "../../store/slices/chatSlice";
import { AuthUser, clearUser, setOnlineUserIds } from "../../store/slices/authSlice";
import { saveCurrentChatToLocal } from "../../utils/chat";
import { getConnection, startConnection } from "../../services/signalRService";

const Sidebar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [users, setUsers] = useState<AuthUser[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<AuthUser[]>([]);

    const currentUser = useAppSelector((state) => state.auth.user);
    const onlineUserIds = useAppSelector((state) => state.auth.onlineUserIds);

    const currentChat = useAppSelector((state) => state.chat.currentChat);

    const isChatActive = currentChat && (currentChat?.targetUser && currentChat?.currentUser);

    console.log("Current chat : ", currentChat)

    // handle search
    const handleSearch = (val: string) => {
        const searchText = val.trim().toLowerCase();

        if (searchText.length > 0) {
            const filteredUsers = users.filter(u => u.displayName?.toLowerCase().includes(searchText));
            setFilteredUsers(filteredUsers);
        } else {
            setFilteredUsers(users);
        }
    }

    // handle logout
    const handleLogout = () => {
        // clean local storage
        localStorage.removeItem("token");
        localStorage.removeItem("currentChat")
        localStorage.removeItem("loggedInUser")

        // reseting the store current chat
        dispatch(clearCurrentChat())

        // reseting the store user
        dispatch(clearUser());

        // stop singnalR connection
        getConnection()?.stop(); // this will update online users as well

        navigate("/login", { replace: true });
    };

    // handle chat selection
    const handleChatSelection = (targetUser: AuthUser) => {
        const currentChat = {
            currentUser: currentUser,
            targetUser: targetUser
        }

        // set current chat to local
        saveCurrentChatToLocal(currentChat);

        // set current chat to store
        dispatch(setCurrentChat(currentChat));
    }

    // load users except logged in user
    const loadUsers = async () => {
        if (!currentUser?.id) return;

        const fetchedUsers = await usersService.getAllUsersExceptProvided(currentUser?.id);
        setUsers(fetchedUsers);
        setFilteredUsers(fetchedUsers)
    }

    // useEffect(() => {
    //     loadUsers();
    // }, [currentUser]);

    console.log("currentUser : ", currentUser)
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        let conn: any;

        const init = async () => {
            await startConnection();    // Start SignalR first
            conn = getConnection();     // Now get connection
            if (!conn) return;

            await loadUsers();          // Load users AFTER connection

            // Listen for online user updates
            conn.on("OnlineUsersUpdated", (userIds: string[]) => {
                console.log("online user ids : ", userIds);

                dispatch(setOnlineUserIds(userIds));
                loadUsers(); // Refresh full user list
            });
        };

        init(); // call async function

        return () => {
            if (conn) {
                conn.off("OnlineUsersUpdated");
            }
        };
    }, [currentUser]);


    return (
        <div className={`sidebar ${isChatActive ? "hide-on-mobile" : ""}`}>
            <div className="header">
                <h2 className='header__title'>Chat Bus</h2>
                <div className="header__profile">
                    <img src="https://images.pexels.com/photos/1040882/pexels-photo-1040882.jpeg?auto=compress&cs=tinysrgb&w=600" alt="profile-image" />
                    <h2>{currentUser?.displayName}</h2>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </div>

            <div className="search">
                <input type="text" placeholder='Search user' onChange={(e) => handleSearch(e.target.value)} />
                <img src="https://cdn-icons-png.flaticon.com/128/2811/2811806.png" alt="search-icon" className="search-icon" />
            </div>

            <div className="contacts">
                {
                    filteredUsers?.map(user => {
                        const isOnline = onlineUserIds?.includes(user?.id);
                        return (
                            <div className="contact" key={user.id} onClick={() => handleChatSelection(user)}>
                                <div className="profile">
                                    <img src="https://images.pexels.com/photos/3772510/pexels-photo-3772510.jpeg?auto=compress&cs=tinysrgb&w=600" alt="user" />
                                </div>
                                <div className="info">
                                    <h2 className='username'>{user.displayName}</h2>
                                    <p className={`last-msg ${isOnline && 'green-text'}`}>{isOnline ? 'online' : 'offline'}</p>
                                </div>
                            </div>
                        )
                    })
                }

                {
                    users?.length == 0 && <p className="empty-warning">No users joined.</p>
                }

            </div>

        </div>
    )
}

export default Sidebar