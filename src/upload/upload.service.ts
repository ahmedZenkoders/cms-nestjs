import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import * as fs from 'fs';

@Injectable()
export class UploadService {
  private readonly apiKey = 'b93e64a648c9dcd8dcef13cc9dfaea71';

  async uploadImage(file: Express.Multer.File) {
    const formData = new FormData();
    formData.append('image', fs.createReadStream(file.path));

    try {
      const response = await axios.post(`https://api.imgbb.com/1/upload?key=${this.apiKey}`, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });
      console.log('Image upload response:', response.data);
      return response.data.data.url;
    } catch (error) {
      console.error('Error uploading image:', error.response?.data || error.message);
      throw new HttpException('Failed to upload image', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
