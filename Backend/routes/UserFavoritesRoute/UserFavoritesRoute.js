const express =require('express')
const router = express.Router()
const protectRoute = require('../../middleware/protectroute')
const UserFavoritesSchema = require("../../modles/UserFavoritesSchema");
const cookieParser = require('cookie-parser');
router.use(cookieParser());

/** Router Paths */
router.post('/userFavorites',protectRoute,async(req,res)=>{
    const {user_id}=req
    const {image_urls}=req.body
    console.log("image urls are",image_urls)
    /**  Check if image_urls is empty  */
    if (image_urls.length === 0) {
        return res.status(400).json({ message: "An array of image URLs is required" });
      }
      try {
        let favorites = await UserFavoritesSchema.findOne({userId:user_id})
        if(!favorites){
            favorites = new UserFavoritesSchema({
                userId:user_id,
                favoriteImages: image_urls.map((url) => ({ url })),
              });
        }else{
            /** Get unique urls */
            console.log("one");
            
            const existingUrls = new Set(favorites.favoriteImages.map((image) => image.url));
            console.log("two");
            /** Traverse over userFavorites */
            image_urls.forEach((image_url) => {
            /**  if present image urls exists does not exist then push the present user favorites */
                if (!existingUrls.has(image_url)) {
                  favorites.favoriteImages.push({ url:image_url });
                }
              });
              console.log("three");
        }
        await favorites.save();
        res.status(200).json(favorites);

      } catch (error) {
        res.status(500).json({ message: "Error updating favorites", error });
      }

})

/** Endpoint to get similar images of particular user */
router.get('/userFavorites',protectRoute,async(req,res)=>{
  const {user_id}=req
  try {
    const user= await UserFavoritesSchema.findOne({userId:user_id})

    /** If user does not exist in userFavorite schema */
    if(!user){
      res.status(203).json({message:"This user does not have any user favorites"})
    }

    /** Extract image urls from favoriteImages array */
    const imageUrls= user.favoriteImages.map((ele)=>ele.url)
    res.status(200).json({imageUrls})
  } catch (error) {
    res.status(203).json({message:"This user does not have any user favorites"})
    res.status(500).json({ message: "Error retrieving user favorites", error });
  }
})

module.exports=router