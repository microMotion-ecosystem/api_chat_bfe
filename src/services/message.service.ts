import { Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { MyHttpService } from 'src/core/my-http-client-service/my-http.service';
import { Request as ExpressRequest } from 'express';
import * as FormData  from 'form-data';

@Injectable()
export class MessageService {
  constructor(private readonly httpService: MyHttpService) {}
  baseUrl = process.env.URL_CHAT_SERVICE + '/api/v1/message';
  async sendMessageLlm(data: any, header: any, llm_type: string): Promise<any> {
    const url = `${this.baseUrl}/llm/${llm_type}`;
    return await firstValueFrom(
      this.httpService.post(url, data, header).pipe(map((item) => item.data)),
    );
  }
  async getSessionMessages(
    sessionId: string,
    header: any,
    req: ExpressRequest,
  ): Promise<any> {
    const queryString: string = req.url.split('?')[1] || '';
    const url = `${this.baseUrl}/sessions/${sessionId}?${queryString}`;
    return await firstValueFrom(
      this.httpService.get(url, header).pipe(map((item) => item.data)),
    );
  }
  async createMessage(data: any, header: any): Promise<any> {
    const url = `${this.baseUrl}`;
    return await firstValueFrom(
      this.httpService.post(url, data, header).pipe(map((item) => item.data)),
    );
  }


  async createAudioMessage(
    file: Express.Multer.File,
    data: any,  // This represents the body data
    headers: any
  ): Promise<any> {
    const formData = new FormData();
    
    formData.append('audio', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });
  
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
  
    const requestHeaders = {
      ...headers,
      ...formData.getHeaders(),
    };
  
    const url = `${this.baseUrl}/upload-audio`;
  
    return await firstValueFrom(
      this.httpService
        .post(url, formData, requestHeaders )
        .pipe(map((response) => response.data)),
    );
  }

  async createImageMessage(
    file: Express.Multer.File,
    data: any,  // This represents the body data
    headers: any
  ): Promise<any> {
    const formData = new FormData();
    
    // Append the audio file
    formData.append('image', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });
  
    // Append the body data fields (ensure `data` is an object)
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
  
    const requestHeaders = {
      ...headers,
      ...formData.getHeaders(),
    };
  
    const url = `${this.baseUrl}/upload-image`;
  
    return await firstValueFrom(
      this.httpService
        .post(url, formData, requestHeaders )
        .pipe(map((response) => response.data)),
    );
  }

  async createPdfMessage(
    file: Express.Multer.File,
    data: any,  // This represents the body data
    headers: any
  ): Promise<any> {
    const formData = new FormData();
    
    // Append the audio file
    formData.append('pdf', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });
  
    // Append the body data fields (ensure `data` is an object)
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
  
    const requestHeaders = {
      ...headers,
      ...formData.getHeaders(),
    };
  
    const url = `${this.baseUrl}/upload-pdf`;
  
    return await firstValueFrom(
      this.httpService
        .post(url, formData, requestHeaders )
        .pipe(map((response) => response.data)),
    );
  }
  

  async updateMessage(data: any, header: any, messageId: string): Promise<any> {
    const url = `${this.baseUrl}/${messageId}`;
    return await firstValueFrom(
      this.httpService.put(url, data, header).pipe(map((item) => item.data)),
    );
  }
  async removeMessage(header: any, messageId: string): Promise<any> {
    const url = `${this.baseUrl}/${messageId}`;
    return await firstValueFrom(
      this.httpService.delete(url, header).pipe(map((item) => item.data)),
    );
  }
}
