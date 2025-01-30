import { Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { MyHttpService } from 'src/core/my-http-client-service/my-http.service';
import { Request as ExpressRequest } from 'express';

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
  async updateMessage(data: any, header: any, messageId: string): Promise<any> {
    const url = `${this.baseUrl}/${messageId}`;
    return await firstValueFrom(
      this.httpService.patch(url, data, header).pipe(map((item) => item.data)),
    );
  }
  async removeMessage(header: any, messageId: string): Promise<any> {
    const url = `${this.baseUrl}/${messageId}`;
    return await firstValueFrom(
      this.httpService.delete(url, header).pipe(map((item) => item.data)),
    );
  }
}
