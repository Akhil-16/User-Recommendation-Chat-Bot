import { useState } from 'react';
import { Grid, Card, Typography, Button, TextField, Box, Stack } from '@mui/material';
import axios from 'axios';
import { CONFIG } from '../../constants/Constants';
import SmartToyIcon from '@mui/icons-material/SmartToy';

export const ChatBot = () => {
  const [messages, setMessages] = useState([]); // Store chat messages
  const [userInput, setUserInput] = useState(''); // User's input

  // Handle sending a message
  const sendMessage = async () => {
    if (!userInput.trim()) return;

    // Add the user's message to the chat
    const newMessages = [...messages, { sender: 'user', text: userInput }];
    setMessages(newMessages);

    /** Request to get User favorites */
    const userFavoritesResponse = await axios.get('http://localhost:8081/api/user/userFavorites',CONFIG);

    try {
      /** All images that are generated after for loop */
        const allImageLinks = [];
      /** Send prompt to CrewAi Endpoint to get user gender and Category */
      const response = await axios.post(
        'http://127.0.0.1:5001/classify', 
        { userMessage: userInput }
      );

      console.log("response is",response.data.Category[0])
      const allCategories=response.data.Category

      /** Send that category to retrieve user specific recommendation images */
      for (let i=0;i<allCategories.length;i++ ){
        console.log("categories are",allCategories[i]);
        const recommendationResponse=await axios.post('http://127.0.0.1:5000/api/category',{
            gender:response.data.Age,
            category:allCategories[i],
            userFavorites:userFavoritesResponse.data.imageUrls
          })
          if(recommendationResponse.status==206){
            console.log("hello");
            setMessages([
                ...newMessages,
                { sender: 'bot', text: 'This Category Images are not selected' }, // Handle error response
              ]);
          }else{
              allImageLinks.push(...recommendationResponse.data.similar_images);
            }
      }


      setMessages([
        ...newMessages,
        { sender: 'bot', images: allImageLinks }, // Add the bot's response with images
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([
        ...newMessages,
        { sender: 'bot', text: 'Sorry, something went wrong.' }, // Handle error response
      ]);
    }

    setUserInput(''); // Clear the input field
  };

  return (
    <Box px={3}>
      <Stack direction='row' alignItems='center' py={2} gap={1}>
      <Typography variant="h6">
        ChatBot
      </Typography>
     <SmartToyIcon/>
      </Stack>

      <div
        style={{
          border: '1px solid grey',
          borderRadius: '8px',
          padding: '20px',
          height: '400px',
          overflowY: 'auto',
          marginBottom: '20px',
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-start',
              marginBottom: '15px',
            }}
          >
            <div
              style={{
                maxWidth: '60%',
                padding: '10px',
                borderRadius: '8px',
                background: message.sender === 'user' ? '#d1e7dd' : '#f8d7da',
                textAlign: 'left',
              }}
            >
              {message.text && (
                <Typography variant="body1">{message.text}</Typography>
              )}
              {message.images && (
                <Grid container spacing={2}>
                  {message.images.map((image, idx) => (
                    <Grid item xs={4} key={idx}>
                      <Card>
                        <img
                          src={image}
                          alt={`Response ${idx}`}
                          style={{ width: '100%', height: '150px', objectFit: 'contain' }}
                        />
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          fullWidth
          variant="outlined"
          style={{ marginRight: '10px' }}
        />
        <Button variant="contained" color="success" onClick={sendMessage}>
          Send
        </Button>
      </div>
    </Box>
  );
};
