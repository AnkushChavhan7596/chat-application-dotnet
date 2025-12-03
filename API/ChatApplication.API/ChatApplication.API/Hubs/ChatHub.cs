using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace ChatApplication.API.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        // Store online users
        private static ConcurrentDictionary<string, string> OnlineUsers = new();

        // Called when the user is typing
        public async Task TypingStarted(string receiverId)
        {
            await Clients.User(receiverId).SendAsync("UserTyping", new
            {
                SenderId = Context.UserIdentifier,
                IsTyping = true
            });
        }

        // Called when the user stops typing
        public async Task TypingStopped(string receiverId)
        {
            await Clients.User(receiverId).SendAsync("UserTyping", new
            {
                SenderId = Context.UserIdentifier,
                IsTyping = false
            });
        }

        // on user connect
        public override Task OnConnectedAsync()
        {
            // Use NameIdentifier as unique user ID
            var userId = Context.UserIdentifier;

            if (!OnlineUsers.ContainsKey(userId))
            {
                OnlineUsers.TryAdd(userId, Context.ConnectionId);
            }

            // Broadcast updated online users to all clients
            Clients.All.SendAsync("OnlineUsersUpdated", OnlineUsers.Keys.ToList());

            return base.OnConnectedAsync();
        }

        // on user disconnect
        public override Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.UserIdentifier;
            OnlineUsers.TryRemove(userId, out _);

            // Broadcast the updated list to everyone
            Clients.All.SendAsync("OnlineUsersUpdated", OnlineUsers.Keys.ToList());

            return base.OnDisconnectedAsync(exception);
        }
    }
}
