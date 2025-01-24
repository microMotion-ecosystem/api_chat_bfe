import { Injectable } from '@nestjs/common';
import { MyHttpService } from '../core/my-http-client-service/my-http.service';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LlmService {
    constructor(private readonly httpService: MyHttpService) {}

    baseUrl = process.env.URL_LLM_SERVICE + '/api/v1/llm';

    async create(data: any, header: any, llm_type: string): Promise<any> {
        const url = `${this.baseUrl}/${llm_type}`;
        return await firstValueFrom(this.httpService.post(url, data, header).pipe(map((item) => item.data)));
    }
}