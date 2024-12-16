import { useState } from 'react';
import { Grid, Card, CardContent, Typography, Button, FormLabel, RadioGroup, FormControlLabel, Radio, Box, Stack } from '@mui/material';
import axios from 'axios';
import { CONFIG } from '../../constants/Constants';
import { COLORS } from '../../Colors/Colors';
import casual_bg from '../../assets/images/casual_bg.avif'
import ethnic_bg from '../../assets/images/ethnic.jpg'
import party_bg from '../../assets/images/party1.jpg'
import smart_casual_bg from '../../assets/images/smart_casual.jpg'
import sport_bg from '../../assets/images/sports.jpg'
import travel_bg from '../../assets/images/travel.jpg'
import formal_bg from '../../assets/images/formal.jpg'
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';
import { setSnackbarMessage, setSnackBarState } from '../../redux/Slices/AlertSlice/AlertSlice';
import { useDispatch } from 'react-redux';

const categories =['Casual','Sports', 'Formal','Ethnic','Party','Smart Casual','Travel']
const bg_images=[casual_bg,sport_bg,formal_bg,ethnic_bg,party_bg,smart_casual_bg,travel_bg]

export const Recommendations = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [gender, setGender] = useState('');
  const [images, setImages] = useState([]); 
  const dispatch=useDispatch()

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  // Send the selected category to the backend
  const sendSelectedCategory = async () => {

    try {
      /** Request to get User favorites */
      const response = await axios.get('http://localhost:8081/api/user/userFavorites',CONFIG);
      console.log('User Favorites ', response.data.imageUrls);
      /** Hit python api to get recommendations */
      const recommendationResponse=await axios.post('http://127.0.0.1:5000/api/category',{
        gender,
        category:selectedCategory,
        userFavorites:response.data.imageUrls
      })
      console.log("recommendation response",recommendationResponse);
      if(recommendationResponse.status==206){
        dispatch(setSnackBarState(true))
        dispatch(setSnackbarMessage("User does not have any choice on this combination "))

      }else{
      setImages(recommendationResponse.data.similar_images);
      dispatch(setSnackBarState(true))
      dispatch(setSnackbarMessage("Selected images submitted successfully!"))

      }
      

      // alert('Category submitted successfully!');

    } catch (error) {
      console.error('Error sending category:', error);
    }

  };

  return (
    <Box p={3}>
     
       {/* Gender Selection */}
       <div style={{ marginBottom: '20px' }}>
        <FormLabel component="legend">Select Gender</FormLabel>
        <RadioGroup row value={gender} onChange={handleGenderChange}>
          <Stack direction='row' alignItems='center'>
          <ManIcon/>
          <FormControlLabel value="Men" control={<Radio />} label="Male" />
          </Stack>
          <Stack direction='row' alignItems='center'>
          <WomanIcon/>
          <FormControlLabel value="Women" control={<Radio />} label="Female" />
          </Stack>
        </RadioGroup>
      </div>
      {/** Category Selection */}
      <Typography variant="h6" gutterBottom color={COLORS.GREEN_TEXT}>
        Select a Category
      </Typography>
      <Grid container spacing={2}>
        {categories.map((category, index) => (
          <Grid item xs={4} key={index}>
            <Card  sx={{backgroundImage:`url(${bg_images[index]})`}}
              onClick={() => handleCategorySelect(category)}
              style={{
                border: selectedCategory === category ? '2px solid blue' : '1px solid grey',
                cursor: 'pointer',
              }}
            >
              <CardContent>
                <Typography variant="h6" align="center" fontWeight={600}>
                  {category}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Button
        variant="contained"
        color="success"
        onClick={sendSelectedCategory}
        disabled={!selectedCategory || !gender }
        style={{ marginTop: '20px' }}
      >
        Submit Selected Category
      </Button>
        {/* Display Images */}
        {images.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <Typography variant="h5" gutterBottom>
            Recommended Images
          </Typography>
          <Grid container spacing={2}>
            {images.map((image, index) => (
              <Grid item xs={2} key={index}>
                <Card>
                  <img src={image} alt={`Recommended ${index}`} style={{ width: '100%', height: '150px',objectFit:'contain' }} />
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      )}
    </Box>
  );
};

