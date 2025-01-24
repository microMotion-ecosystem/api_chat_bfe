import { Controller, Get, Headers, Post, Body, Param } from '@nestjs/common';
import { ResponseDto } from 'src/dtos/response.dto';
import { ChatService } from 'src/services/chat.service';

@Controller('api/v1/chat')
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Post('llm/:llm_type')
    async createGemini(@Body() body: any, @Headers() headers: any, @Param('llm_type') llm_type: string) {
        try {
            return await this.chatService.create(body, headers, llm_type);
        } catch (error) {
            return ResponseDto.handleCatchError(error);
        }
    }
}