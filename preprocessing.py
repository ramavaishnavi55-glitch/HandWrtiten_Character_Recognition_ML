import io
from PIL import Image
import torch
import torchvision.transforms as transforms

def preprocess_character_image(image_bytes):
    """
    EMNIST Letters Image Preprocessing Pipeline.
    
    Step 1: Convert raw image bytes to a single-channel Grayscale PIL Image.
    Step 2: Resize image to standard 28 x 28 pixels using Bilinear interpolation.
    Step 3: Convert PIL Image to PyTorch Tensor (maps intensities to [0, 1]).
    Step 4: Normalize pixel tensor with mean=0.5 and std=0.5 (scales tensor to [-1, 1]).
    Step 5: Add a batch dimension using unsqueeze (converts [1, 28, 28] to [1, 1, 28, 28]).
    """
    # Load raw bytes into an Image
    image = Image.open(io.BytesIO(image_bytes))
    
    # Preprocessing transforms definition
    transform_pipeline = transforms.Compose([
        # Step 1: Convert image to grayscale
        transforms.Grayscale(num_output_channels=1),
        
        # Step 2: Resize image to 28 x 28
        transforms.Resize((28, 28)),
        
        # Step 3: Convert image to tensor
        transforms.ToTensor(),
        
        # Step 4: Normalize image using mean (0.5,) and std (0.5,)
        transforms.Normalize((0.5,), (0.5,))
    ])
    
    # Execute steps 1-4
    tensor = transform_pipeline(image)
    
    # Step 5: Add batch dimension (equivalent to image.unsqueeze(0))
    tensor = tensor.unsqueeze(0)
    
    return tensor
