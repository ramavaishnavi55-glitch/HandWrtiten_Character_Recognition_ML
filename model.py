import torch
import torch.nn as nn
import torch.nn.functional as F

class CharacterCNN(nn.Module):
    """
    EMNIST Letters Convolutional Neural Network (CNN) Model.
    Input Shape: 1 x 28 x 28 (Grayscale)
    Output Shape: 26 probabilities (representing English letters A-Z)
    """
    def __init__(self):
        super(CharacterCNN, self).__init__()
        # Convolutional Layer 1: 1 input channel, 32 filters, 3x3 kernel
        self.conv1 = nn.Conv2d(1, 32, kernel_size=3, padding=1)
        # Convolutional Layer 2: 32 input channels, 64 filters, 3x3 kernel
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        
        # Max Pooling: reduces spatial dimension from 28x28 -> 14x14 -> 7x7
        self.pool = nn.MaxPool2d(2, 2)
        
        # Dropout regularization prevents overfitting on training letters
        self.dropout1 = nn.Dropout(0.25)
        self.dropout2 = nn.Dropout(0.5)
        
        # Fully Connected Layer 1: 64 output channels from 7x7 spatial grid -> 256 nodes
        self.fc1 = nn.Linear(64 * 7 * 7, 256)
        # Fully Connected Layer 2: 256 nodes -> 26 alphabet letters classes
        self.fc2 = nn.Linear(256, 26)

    def forward(self, x):
        # Convolution 1 + ReLU Activation + Pooling
        x = self.pool(F.relu(self.conv1(x)))
        # Convolution 2 + ReLU Activation + Pooling
        x = self.pool(F.relu(self.conv2(x)))
        
        # Flatten layer
        x = x.view(-1, 64 * 7 * 7)
        x = self.dropout1(x)
        
        # FC1 + Activation + Dropout
        x = F.relu(self.fc1(x))
        x = self.dropout2(x)
        
        # FC2 Output logits
        x = self.fc2(x)
        return x
