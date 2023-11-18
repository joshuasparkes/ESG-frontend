import { useCallback } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase"; // Assuming the db is exported from your firebase.js
import { useAuth } from "../components/authContext";

export const useTreePurchase = (treeCount, setTreeCount, setTreesPlanted) => {
  const { currentUser } = useAuth();

  const handlePurchase = useCallback(async () => {
    if (!currentUser) {
      console.error("No user is signed in.");
      return;
    }

    const userDocRef = doc(db, "users", currentUser.uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      const ecologiKey = userData.ecologiKey;

      if (!ecologiKey) {
        console.error("Ecologi API key is not set for the user.");
        return;
      }

      // Change the URL to your Flask server's endpoint
      const proxyUrl = `http://localhost:5000/purchase-trees`;

      try {
        const response = await fetch(proxyUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${ecologiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            number: parseInt(treeCount, 10), // Change this to "number" to match the API's expected format
            // You can optionally include other fields like "name" or "test" if required
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Handle the response
        const data = await response.json();
        console.log("Trees purchased successfully:", data);

        // Update UI
        setTreeCount(0);
        // Ensure to call fetchTreesPlanted if necessary and if it's passed as a prop or available in this scope
      } catch (error) {
        console.error("Error purchasing trees:", error);
      }
    } else {
      console.log("User document does not exist.");
    }
}, [currentUser, treeCount, setTreeCount]); // Removed setTreesPlanted from dependencies

  return handlePurchase;
};
