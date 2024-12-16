import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Grid,
  Card,
  CardMedia,
  Checkbox,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Stack,
  Box,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CONFIG, PATH_ROUTES } from '../../constants/Constants';
import { COLORS } from '../../Colors/Colors';
import { useDispatch } from 'react-redux';
import {  setSnackbarMessage, setSnackBarState } from '../../redux/Slices/AlertSlice/AlertSlice';

/** Home page */
export const Home = () => {
  /** Random URLs sent from backend */
  const [images, setImages] = useState([]);
  /** Store selected images URL */
  const [selectedImages, setSelectedImages] = useState([]);
  /** Gender selection state */
  const [gender, setGender] = useState('');
  /** Error state */
  const [error, setError] = useState('');
  const navigate=useNavigate()
  const dispatch=useDispatch()

  useEffect(() => {
    if (gender) {
      const fetchImages = async () => {
        try {
            console.log("gender is ",gender);
            
          const response = await axios.post('http://localhost:5000/api/images', { gender });
          console.log("response is ",response.data)
          
          setImages(response.data.images);
          setError('');
         
        } catch (error) {
          console.error('Error fetching images:', error);
          setError('Failed to fetch images. Please try again.');
        }
      };
      fetchImages();
    }
  }, [ gender]);

  // Handle image selection
  const handleSelectImage = (image) => {
    setSelectedImages((prev) =>
      prev.includes(image) ? prev.filter((img) => img !== image) : [...prev, image]
    );
  };

  // Handle gender selection
  const handleGenderChange = (event) => {
    setGender(event.target.value);
    setSelectedImages([]); // Reset selected images on gender change
    setImages([]); // Clear images while fetching new ones
  };

  // Send selected images and gender to the backend
  const sendSelectedImages = async () => {
    console.log("images are",selectedImages,"gender is ",gender)
    try {
      const response = await axios.post('http://localhost:8081/api/user/userFavorites', {
        image_urls:selectedImages,
      },CONFIG);
      console.log('Server Response:', response.data);
      dispatch(setSnackBarState(true))
      dispatch(setSnackbarMessage("Selected images submitted successfully!"))
      // alert('Selected images submitted successfully!');
      navigate(PATH_ROUTES.RECOMMENDATIONS)
    } catch (error) {
      console.error('Error sending images:', error);
    }
  };

  return (
    <Box p={1}>
      <Stack direction='row' gap={5} paddingY={3}>
      <Typography variant="h6" gutterBottom color={COLORS.GREEN_TEXT}>
        Choose your style
      </Typography>
      </Stack>
      <FormControl fullWidth>
        <InputLabel id="gender-select-label">Gender</InputLabel>
        <Select
          labelId="gender-select-label"
          value={gender}
          label="Gender"
          onChange={handleGenderChange}
        >
          <MenuItem value="Men">Male</MenuItem>
          <MenuItem value="Women">Female</MenuItem>
        </Select>
      </FormControl>
      {error && <Typography color="error">{error}</Typography>}
      <Grid container spacing={2} py={1}>
        {images.map((image, index) => (
          <Grid item xs={2}  key={index}>
            <Chip label={image.usage} sx={{backgroundColor:'#F3F4F6',color:'#4B5563',marginBottom:'8px',fontWeight:600}} />
            <Card>
              <CardMedia
                component="img"
                height='150px'
                sx={{objectFit:'contain'}}
                image={image.link}
                alt={`Image ${index + 1}`}
              />
              <Checkbox
                checked={selectedImages.includes(image.link)}
                onChange={() => handleSelectImage(image.link)}
              />
            </Card>
          </Grid>
        ))}
      </Grid>
      <Button
        variant="contained"
        color="success"
        onClick={sendSelectedImages}
        disabled={selectedImages.length === 0 || !gender}
        sx={{marginTop:4}}
      >
        Submit Selected Images
      </Button>
     
    </Box>
  );
};

export default Home;
