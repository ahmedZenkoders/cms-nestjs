/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';

@Injectable()
export class UploadService {
  async uploadImage(image) {
    const apikey = '59dfcdd6072d0e1e7c7fbe64d871c341';
    const url = `https://api.imgbb.com/1/upload?key=${apikey}`;
    const formData = new FormData();
    formData.append('image', image.buffer.toString('base64'));
    const response = await axios.post(url, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });
    const imageUrl = response.data.data.url;
    return imageUrl;
  }
}
