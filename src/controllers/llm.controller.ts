import { Controller, Get, Headers, Post, Body, Param } from '@nestjs/common';
import { ResponseDto } from 'src/dtos/response.dto';
import { LlmService } from 'src/services/llm.service';

@Controller('api/v1/llm')
export class LlmController {
    constructor(private llmService: LlmService) {}

    @Post(':llm_type')
    async createGemini(@Body() body: any, @Headers() headers: any, @Param('llm_type') llm_type: string) {
        try {
            return await this.llmService.create(body, headers, llm_type);
        } catch (error) {
            return ResponseDto.handleCatchError(error);
        }
    }
}