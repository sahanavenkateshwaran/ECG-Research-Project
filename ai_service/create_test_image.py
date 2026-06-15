from PIL import Image
from pathlib import Path
p = Path(__file__).parent / 'test_upload.png'
Image.new('RGB', (224,224), (128,128,128)).save(p)
print('Created', p)
