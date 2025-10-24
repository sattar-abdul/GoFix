import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  Avatar,
} from "@mui/material";
import { chatAPI } from "../utils/api.js";
import { useParams } from "react-router-dom";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { taskId } = useParams();

  useEffect(() => {
    if (taskId) fetchChat();
  }, [taskId]);

  const fetchChat = async () => {
    if (!taskId) return;
    setLoading(true);
    try {
      const response = await chatAPI.getChat(taskId);
      setMessages(response.data?.messages || []);
    } catch (error) {
      console.error("Failed to fetch chat:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !taskId) return;
    try {
      await chatAPI.sendMessage({ taskId, message: newMessage });
      setNewMessage("");
      fetchChat(); // Refresh messages
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Chat
      </Typography>

      <Card>
        <CardContent>
          <Paper
            sx={{
              height: 400,
              overflow: "auto",
              p: 2,
              mb: 2,
              bgcolor: "grey.50",
            }}
          >
            {loading ? (
              <Typography>Loading messages...</Typography>
            ) : messages.length === 0 ? (
              <Typography color="text.secondary">
                No messages yet. Start the conversation!
              </Typography>
            ) : (
              <List>
                {messages.map((message, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      flexDirection:
                        message.sender === "user" ? "row-reverse" : "row",
                      alignItems: "flex-start",
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor:
                          message.sender === "user"
                            ? "primary.main"
                            : "secondary.main",
                        mr: message.sender === "user" ? 0 : 1,
                        ml: message.sender === "user" ? 1 : 0,
                      }}
                    >
                      {message.sender === "user" ? "U" : "P"}
                    </Avatar>
                    <ListItemText
                      primary={message.message}
                      secondary={new Date(message.timestamp).toLocaleString()}
                      sx={{
                        textAlign: message.sender === "user" ? "right" : "left",
                        bgcolor:
                          message.sender === "user"
                            ? "primary.light"
                            : "grey.200",
                        p: 1,
                        borderRadius: 1,
                        maxWidth: "70%",
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>

          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              label="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              fullWidth
              disabled={!taskId}
            />
            <Button
              variant="contained"
              onClick={sendMessage}
              disabled={!newMessage.trim() || !taskId}
            >
              Send
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
