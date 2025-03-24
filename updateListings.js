const Listing = require("./models/listing");
const mongoose = require("mongoose");
const axios = require("axios");

mongoose.connect("mongodb://127.0.0.1:27017/wanderlust", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Function to get coordinates from location
const getCoordinates = async (location) => {
    try {
        console.log(`🌍 Fetching coordinates for: ${location}`);
        const response = await axios.get("https://nominatim.openstreetmap.org/search", {
            params: { q: location, format: "json", limit: 1 }
        });

        if (response.data.length > 0) {
            const { lat, lon } = response.data[0];
            return [parseFloat(lon), parseFloat(lat)];
        } else {
            console.log(`❌ No coordinates found for: ${location}`);
            return null;
        }
    } catch (error) {
        console.error(`⚠️ Error fetching coordinates for ${location}:`, error.message);
        return null;
    }
};

// Function to update missing coordinates
const updateListings = async () => {
    const listings = await Listing.find({ "geometry.coordinates": [-73.935242, 40.73061] });

    for (let listing of listings) {
        if (!listing.location) {
            console.log(`⚠️ No location found for listing: ${listing.title}`);
            continue;
        }

        const coordinates = await getCoordinates(listing.location);
        if (coordinates) {
            listing.geometry = { type: "Point", coordinates };
            await listing.save();
            console.log(`✅ Updated: ${listing.title} -> ${coordinates}`);
        } else {
            console.log(`❌ Could not update: ${listing.title}`);
        }

        await new Promise(resolve => setTimeout(resolve, 1000)); // Avoid API rate limit
    }

    console.log("🎉 All listings updated!");
    mongoose.connection.close();
};

// Run the update function
updateListings();
