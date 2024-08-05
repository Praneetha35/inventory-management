"use client";

import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Typography, Modal, Stack, TextField, Button, Card, CardContent, CircularProgress } from "@mui/material";
import { collection, getDocs, query, setDoc, doc, getDoc, deleteDoc } from "firebase/firestore";
import KitchenIcon from '@mui/icons-material/Kitchen'; // Pantry-related icon

import ImageUploader from "./components/imageUploader";
import { convertImageToBase64 } from "./utils/imageUtils";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [recipe, setRecipe] = useState("");
  const [loadingRecipe, setLoadingRecipe] = useState(false);


  const handleOpenImageModal = () => setOpenImageModal(true);
  const handleCloseImageModal = () => setOpenImageModal(false);

  const handleImageUpload = (imageSrc) => {
    convertImageToBase64(imageSrc, async (imageBase64) => {
      setLoadingImage(true);
      try {
        const response = await fetch("/api/classify-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageBase64 }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to classify image");
        }
  
        const data = await response.json();
        const itemName = data.label;
        console.log("itemName: ", itemName);
        
        // setItemName(itemName)
        await addItem(itemName);
        setItemName("");
        handleCloseImageModal();
      } catch (error) {
        console.error("Error processing image: ", error);
      } finally {
        setLoadingImage(false);
      }
    });
  };

  const handleGenerateRecipe = async () => {
    setLoadingRecipe(true);
    try {
      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pantryItems: inventory.map((item) => item.name) }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to generate recipe");
      }
  
      const data = await response.json();
      console.log("recipe:",recipe);
      setRecipe(data.recipe);
    } catch (error) {
      console.error("Error generating recipe: ", error);
    } finally {
      setLoadingRecipe(false);
    }
  };
  

  const updateInventory = async () => {
    setLoading(true);
    try {
      const snapshot = query(collection(firestore, "inventory"));
      const docs = await getDocs(snapshot);
      const inventoryList = [];

      docs.forEach((doc) => {
        inventoryList.push({
          name: doc.id,
          ...doc.data(),
        });
      });
      setInventory(inventoryList);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item.toLowerCase());
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const addItem = async (productName) => {
    console.log("log inside: ", productName);
    
    if (productName.trim() === "") return;
    const lowerCaseItemName = productName.trim().toLowerCase();
    console.log("lowerCaseItemName: ", lowerCaseItemName);
    
    const docRef = doc(collection(firestore, "inventory"), lowerCaseItemName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + newItemQuantity });
    } else {
      await setDoc(docRef, { quantity: newItemQuantity });
    }
    setItemName('');
    setNewItemQuantity(1);
    handleCloseAdd();
    await updateInventory();
  };

  const updateItemQuantity = async () => {
    if (selectedItem === null || itemQuantity.trim() === "") return;
    const docRef = doc(collection(firestore, "inventory"), selectedItem.toLowerCase());
    await setDoc(docRef, { quantity: parseInt(itemQuantity, 10) });
    setItemQuantity('');
    setSelectedItem(null);
    handleCloseUpdate();
    await updateInventory();
  };

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleOpenUpdate = (item) => {
    setSelectedItem(item.toLowerCase());
    setOpenUpdate(true);
  };

  const handleCloseUpdate = () => setOpenUpdate(false);

  useEffect(() => {
    updateInventory();
  }, []);

  return (
    <Box
      width="100vw"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      bgcolor="#e8f5e9" // Subtle background color
    >
      <Box
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        textAlign="center"
        p={4}
        bgcolor="#a5d6a7" // Subtle green color
        borderBottom="4px solid #81c784" // Slightly darker green for accent
      >
        <KitchenIcon sx={{ fontSize: 40, color: "white" }} />
        <Typography variant="h4" fontWeight="bold" color="white">
          Pantry Tracker
        </Typography>
        <Typography variant="subtitle1" color="white">
          Your favorite food inventory management app
        </Typography>
      </Box>
      <Box flex={1} padding={2} display="flex" flexDirection="column" alignItems="center">
        <Stack direction="row" spacing={2} width="100%">
      <Button
        variant="contained"
        sx={{ 
          bgcolor: "#66bb6a", 
          mt: 4, 
          mb: 2, 
          borderRadius: '20px', 
          '&:hover': { bgcolor: "#4caf50" }, 
          px: 4, 
          py: 1 
        }} // Subtle green color
        onClick={handleOpenAdd}
      >
        Add New Item
      </Button>

      <Button
        variant="contained"
        sx={{ 
          bgcolor: "#66bb6a", 
          mt: 4, 
          mb: 2, 
          borderRadius: '20px', 
          '&:hover': { bgcolor: "#4caf50" }, 
          px: 4, 
          py: 1 
        }} // Subtle green color
        onClick={handleOpenImageModal}
      >
        SCAN ITEM
      </Button>

      <Button
        variant="contained"
        sx={{ 
          bgcolor: "#66bb6a", 
          mt: 4, 
          mb: 2, 
          borderRadius: '20px', 
          '&:hover': { bgcolor: "#4caf50" }, 
          px: 4, 
          py: 1 
        }} // Subtle green color
        onClick={handleGenerateRecipe}
      >
        GENERATE RECIPE
      </Button>
      </Stack>
      {loadingRecipe ? (
          <CircularProgress sx={{ marginTop: "20px" }} />
        ) : (
          <Box border="1px solid #333" sx={{ width: "100%", padding: "20px", marginTop: "20px" }}>
            <Typography variant="h4" color="#333" textAlign="center" marginBottom="20px">
              Generated Recipe
            </Typography>
            <Typography variant="body1" color="#333" style={{ whiteSpace: "pre-wrap" }}>
              {recipe
                ? recipe
                : "No recipe generated yet. Click the 'Generate Recipe' button to create a recipe."}
            </Typography>
          </Box>
        )}
      </Box>

      <Modal open={openImageModal} onClose={handleCloseImageModal}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          {loadingImage ? (
          <CircularProgress />
        ) : (
          <ImageUploader onImageUpload={handleImageUpload} />
        )}
        </Box>
      </Modal>

      <Box width="80%" p={4} bgcolor="white" borderRadius="8px" boxShadow={3} mt={2}>
        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
          Inventory Items
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={2} overflow="auto">
            {inventory.map(({ name, quantity }) => (
              <Card key={name} sx={{ backgroundColor: '#f1f8e9', boxShadow: 3 }}> {/* Very light green for cards */}
                <CardContent
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                  }}
                >
                  <Typography variant="h6" fontWeight="medium">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Quantity: {quantity}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ 
                        bgcolor: "#e57373", 
                        borderRadius: '20px', 
                        '&:hover': { bgcolor: "#ef5350" }, 
                        px: 2, 
                        py: 1 
                      }} // Subtle red color for removal
                      onClick={() => removeItem(name)}
                    >
                      Remove
                    </Button>
                    <Button
                      variant="outlined"
                      color="success"
                      sx={{ 
                        borderColor: "#66bb6a", 
                        color: "#66bb6a", 
                        borderRadius: '20px', 
                        '&:hover': { borderColor: "#4caf50", color: "#4caf50" }, 
                        px: 2, 
                        py: 1 
                      }} // Subtle green for update
                      onClick={() => handleOpenUpdate(name)}
                    >
                      Update Quantity
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>

      <Modal open={openAdd} onClose={handleCloseAdd}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #66bb6a"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%, -50%)',
            borderRadius: '8px'
          }}
        >
          <Typography variant="h6" fontWeight="medium">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              label="Item Name"
            />
            <TextField
              variant="outlined"
              type="number"
              value={newItemQuantity}
              onChange={(e) => setNewItemQuantity(parseInt(e.target.value, 10))}
              label="Quantity"
              InputProps={{ inputProps: { min: 1 } }}
            />
            <Button
              variant="contained"
              color="success"
              onClick={(e) => addItem(itemName)}
              sx={{ 
                bgcolor: "#66bb6a", 
                borderRadius: '20px', 
                '&:hover': { bgcolor: "#4caf50" }, 
                px: 4, 
                py: 1 
              }} // Matching subtle green color
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Modal open={openUpdate} onClose={handleCloseUpdate}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #66bb6a"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%, -50%)',
            borderRadius: '8px'
          }}
        >
          <Typography variant="h6" fontWeight="medium">Update Quantity</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              type="number"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(e.target.value)}
              label="New Quantity"
              InputProps={{ inputProps: { min: 0 } }}
            />
            <Button
              variant="contained"
              color="success"
              onClick={updateItemQuantity}
              sx={{ 
                bgcolor: "#66bb6a", 
                borderRadius: '20px', 
                '&:hover': { bgcolor: "#4caf50" }, 
                px: 4, 
                py: 1 
              }} // Matching subtle green color
            >
              Update
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}

