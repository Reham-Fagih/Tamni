import sys
import torch
from torchvision import transforms
from PIL import Image

class SimpleCNN(torch.nn.Module):
    def __init__(self):
        super(SimpleCNN, self).__init__()
        self.conv1 = torch.nn.Conv2d(3, 16, kernel_size=3, padding=1)
        self.pool = torch.nn.MaxPool2d(kernel_size=2, stride=2)
        self.conv2 = torch.nn.Conv2d(16, 32, kernel_size=3, padding=1)
        self.fc1 = torch.nn.Linear(32 * 32 * 32, 128)
        self.fc2 = torch.nn.Linear(128, len(classes))

    def forward(self, x):
        x = self.pool(torch.nn.functional.relu(self.conv1(x)))
        x = self.pool(torch.nn.functional.relu(self.conv2(x)))
        x = x.view(-1, 32 * 32 * 32) 
        x = torch.nn.functional.relu(self.fc1(x))
        x = self.fc2(x)
        return x

classes = [
    'Eczema',
    'Warts Molluscum and other Viral Infections',
    'Melanoma',
    'Atopic Dermatitis',
    'Basal Cell Carcinoma (BCC)',
    'Melanocytic Nevi (NV)',
    'Benign Keratosis-like Lesions (BKL)',
    'Psoriasis pictures Lichen Planus and related diseases',
    'Seborrheic Keratoses and other Benign Tumors',
    'Tinea Ringworm Candidiasis and other Fungal Infections'
]

model = SimpleCNN()
model.load_state_dict(torch.load('skin_disease_model.pth'))
model.eval()  

transform = transforms.Compose([
    transforms.Resize((128, 128)),
    transforms.ToTensor(),
    transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5)),  
])

image_path = sys.argv[1]

try:
    image = Image.open(image_path)
    if image.mode not in ['RGB', 'RGBA']:
        image = image.convert('RGB')  
except Exception as e:
    print(f"Error opening image {image_path}: {e}")
    sys.exit(1)

image_tensor = transform(image).unsqueeze(0)  
with torch.no_grad():
    output = model(image_tensor)  
    _, predicted = torch.max(output.data, 1)  
    


prediction = classes[predicted.item()]


print(prediction)