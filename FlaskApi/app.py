from flask import Flask, request, send_file,jsonify
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS
from sklearn.decomposition import PCA
from tensorflow.keras.preprocessing.image import ImageDataGenerator, load_img,img_to_array
from PIL import Image
import io
import numpy as np

app = Flask(__name__)
CORS(app)

df = pd.read_pickle("dataset_P4_final.pkl")
feature_map=pd.read_pickle("features_P4_final.pkl")

def load_dataset(gender):
    try:
        # Load the dataset from the pickle file
        df = pd.read_pickle("dataset_P4_final.pkl")

        # Filter the dataset based on the gender column
        gender_filtered_df = df[df["gender"] == gender]

        # Group the filtered dataset by the 'usage' column
        grouped = gender_filtered_df.groupby("usage")

        # Create an empty list to store the sampled rows
        sampled_rows = []

        # Iterate over each group and sample 5 rows
        for category, group in grouped:
            sampled = group.sample(n=min(5, len(group)), replace=False)  # Take up to 5 rows
            sampled_rows.append(sampled)

        # Concatenate all sampled rows into a single DataFrame
        sampled_df = pd.concat(sampled_rows).reset_index(drop=True)

        # Extract the 'link' column as a list and return it
        return sampled_df[["link", "usage"]].to_dict(orient="records")
    except Exception as e:
        print(f"Error loading dataset: {e}")
        return []
    
def read_img(image_path):
    image = load_img(image_path, target_size=(256, 256, 3))
    image = img_to_array(image) / 255.
    return image

# End point to get random Images    
@app.route('/api/images', methods=['POST'])
def get_images():
    try:
        # Get the gender from the POST request
        data = request.get_json()
        gender = data.get("gender")
        print("gender is ",gender)

        if not gender:
            return jsonify({"error": "Gender not provided"}), 400

        # Load images filtered by gender
        images = load_dataset(gender)

        return jsonify({'images': images})
    except Exception as e:
        print("error is ",e)
        return jsonify({"error": str(e)}), 500
    
# @app.route('/api/images/selected-images',methods=['POST'])
# def store_user_specific_images():
#     data=request.get_json()
#     user_selected_images = data.get("selectedImages")
#     gender=data.get("gender")
#     for image in user_selected_images:
#         user_specific_images.append(image)
    
#     return jsonify({"images_array":user_specific_images})

# End point to get Recommendations
@app.route('/api/category', methods=["POST"])
def get_recommendations():
    try:
        # Parse the JSON payload from the request
        data = request.get_json()
        category = data.get("category")
        gender=data.get("gender")
        user_specific_images=data.get("userFavorites")

        # Log the received category to verify
        print("Category is:", category)
        print("gender is:", gender)
        filtered_train=df[(df['gender'] == gender) & (df['usage'] == category)]
        
        links = filtered_train['link'].tolist()
        limited_links = links[:20]
        print("indexes are",filtered_train.index)

        filtered_data_json = filtered_train.to_dict(orient="records")


        matching_indices = []

        for link in user_specific_images:
            # Get the subset of filtered_train where the link matches
            matching_rows = filtered_train[filtered_train['link'] == link]
            
            # If there are matching rows, append their indices to the list
            if not matching_rows.empty:
                matching_indices.extend(matching_rows.index.tolist())

        # Print the matching indices
        print("Matching indices:", matching_indices)

        if(len(matching_indices)==0):
            return jsonify({"message":"Please select images in this category from random images "}),206

        # This will give that particular index feature row
        user_favorites_features = feature_map[matching_indices]
        print("user favorites",user_favorites_features)
        filtered_train_indixes = filtered_train.index.tolist()
        print("filtered favorites",filtered_train_indixes)
        filtered_train_feature_map=feature_map[filtered_train_indixes]
        print("filtered_indexes are",filtered_train_feature_map)


        
        similar_images = []  # List to store indices of similar images for each user favorite feature

        for user_feature in user_favorites_features:  # Loop over each feature in user_favorites_features
            try:
                # Compute cosine similarity for the current user feature
                similarities = cosine_similarity(user_feature.reshape(1, -1), filtered_train_feature_map)
            except Exception as e:
                print("Error during cosine similarity computation:", e)
                continue  # Skip to the next feature if there's an error

            # Get top 5 indices of similar images from filtered_train_feature_map
            descending_order = np.argsort(similarities[0])[::-1]  # Extract top 5 indices
            top_5_indices=descending_order[:10]
            print('done1',top_5_indices)

            # Append the corresponding image links to the similar_images list
            similar_images.extend(filtered_train.iloc[top_5_indices]['link'].tolist())
            print('done2')

        return jsonify({"similar_images": similar_images}), 200


        # Return a success response
        if category:
            return jsonify({"message": f"Category '{category}' received successfully!"}), 200
        else:
            return jsonify({"error": "Category is missing from the request."}), 400
    except Exception as e:
        print("error is",e)
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500




if __name__ == '__main__':
    app.run(debug=True)

