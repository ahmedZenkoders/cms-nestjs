import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import { API_KEY } from './constants';

@Injectable()
export class UploadService {
  
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image',file.buffer.toString('base64'));
    

    try {
      const response = await axios.post(`https://api.imgbb.com/1/upload?key=${API_KEY}`, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });
      console.log('Image upload response:', response.data.data.url);
      return response.data.data.url;
    } catch (error) {
      console.error('Error uploading image:', error.response?.data || error.message);
      throw new HttpException('Failed to upload image', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
