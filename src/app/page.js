"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  createTheme,
  ThemeProvider,
  Paper,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import Image from "next/image";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "rgb(4, 251, 173)", // Highrise green
    },
    background: {
      default: "rgb(41, 35, 89)", // Highrise purple
      paper: "rgb(41, 35, 89)",
    },
    text: {
      primary: "#ffffff",
    },
  },
});

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessages),
      });

      const data = await response.json();

      if (data.error) {
        console.error("Error:", data.error);
        return;
      }

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: data.answer,
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 800,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <a href="https://support.highrise.game/en/">
            <Image
              src="/imgs/highrise.png"
              alt="Highrise Logo"
              width={40}
              height={40}
            />
          </a>
          <Typography variant="h4" sx={{ color: "white" }}>
            Highrise FAQ Chatbot
          </Typography>
        </Box>

        <Paper
          sx={{
            width: "100%",
            maxWidth: 800,
            p: 3,
            height: "80vh",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "rgba(41, 35, 89, 0.8)", // Slightly transparent
            border: "1px solid rgba(4, 251, 173, 0.2)", // Subtle green border
          }}
        >
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              mb: 2,
              p: 2,
            }}
          >
            {messages.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  mb: 2,
                  textAlign: msg.role === "user" ? "right" : "left",
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    display: "inline-block",
                    maxWidth: "70%",
                    bgcolor:
                      msg.role === "user" ? "primary.main" : "background.paper",
                    boxShadow: "0 2px 8px rgba(4, 251, 173, 0.1)",
                  }}
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </Paper>
              </Box>
            ))}
            {loading && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "rgb(4, 251, 173)",
                  gap: 1,
                }}
              >
                <Typography>Thinking...</Typography>
                <span className="animate-pulse">💭</span>
              </Box>
            )}
          </Box>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={loading}
                sx={{
                  "& .MuiInputBase-input": {
                    color: "white",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "rgba(4, 251, 173, 0.3)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(4, 251, 173, 0.5)",
                    },
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !input.trim()}
                sx={{
                  bgcolor: "rgb(4, 251, 173)",
                  color: "rgb(41, 35, 89)",
                  "&:hover": {
                    bgcolor: "rgba(4, 251, 173, 0.8)",
                  },
                }}
              >
                Send
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
