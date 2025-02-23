import { Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { MyHttpService } from 'src/core/my-http-client-service/my-http.service';
import { Request as ExpressRequest } from 'express';

@Injectable()
export class SessionService {
    constructor(private readonly httpService: MyHttpService) {}
    baseUrl = process.env.URL_CHAT_SERVICE + '/api/v1/session';
    async createSessionllm(data:any,header:any,llm_type: string):Promise<any>{
        const url = `${this.baseUrl}/llm/${llm_type}`;
        return await firstValueFrom(this.httpService.post(url, data, header).pipe(map((item) => item.data)));
    }
    async getParticipatedSession(header:any,req:ExpressRequest):Promise<any>{
        const queryString:string=req.url.split('?')[1]||''

        const url = `${this.baseUrl}?${queryString}`;
        return await firstValueFrom(this.httpService.get(url, header).pipe(map((item) => item.data)));
    }
    async getMySession(header:any,req:ExpressRequest):Promise<any>{
        const queryString:string=req.url.split('?')[1]||''

        const url = `${this.baseUrl}/mySessions?${queryString}`;
        return await firstValueFrom(this.httpService.get(url, header).pipe(map((item) => item.data)));
    }
    async getOneSession(id:string,header:any):Promise<any>{
        const url = `${this.baseUrl}/${id}`;
        return await firstValueFrom(this.httpService.get(url, header).pipe(map((item) => item.data)));
    }
    async createSession(data:any,header:any):Promise<any>{
        const url = `${this.baseUrl}`;
        return await firstValueFrom(this.httpService.post(url, data, header).pipe(map((item) => item.data)));
    }
    async addParticipantSession(data:any,header:any,sessionId: string):Promise<any>{
        const url = `${this.baseUrl}/addParticipant/${sessionId}`;
        return await firstValueFrom(this.httpService.patch(url, data, header).pipe(map((item) => item.data)));
    }
    async removeParticipantSession(data:any,header:any,sessionId: string):Promise<any>{
        const url = `${this.baseUrl}/removeParticipant/${sessionId}`;
        return await firstValueFrom(this.httpService.patch(url, data, header).pipe(map((item) => item.data)));
    }
    async renameSession(data:any,header:any,sessionId: string):Promise<any>{
        const url = `${this.baseUrl}/rename/${sessionId}`;
        return await firstValueFrom(this.httpService.patch(url, data, header).pipe(map((item) => item.data)));
    }
    async removeSession(header:any,sessionId: string):Promise<any>{
        const url = `${this.baseUrl}/${sessionId}`;
        return await firstValueFrom(this.httpService.delete(url, header).pipe(map((item) => item.data)));
    }

    async acceptJoinInvitation(data: any, header:any,code: string, req:ExpressRequest):Promise<any>{
        const url = `${this.baseUrl}/acceptInvitation/${code}`;
        return await firstValueFrom(this.httpService.patch(url, data, header).pipe(map((item) => item.data)));
    }


    async enableLLM(data:any,header:any,sessionId: string):Promise<any>{
        const url = `${this.baseUrl}/enable_llm/${sessionId}`;
        return await firstValueFrom(this.httpService.patch(url, data, header).pipe(map((item) => item.data)));
    }
    async disableLLM(data:any,header:any,sessionId: string):Promise<any>{
        const url = `${this.baseUrl}/disable_llm/${sessionId}`;
        return await firstValueFrom(this.httpService.patch(url, data, header).pipe(map((item) => item.data)));
    }


}
