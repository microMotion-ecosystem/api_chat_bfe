import { OnModuleInit, UseGuards } from "@nestjs/common";
import { MessageBody, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { session } from "passport";
import { Socket } from "socket.io";
// import { CheckUserService } from "../api-services/check-user/check-user.service";
import { JwtAuthGuard } from "src/core/jwt-auth-guard/jwt-auth.guard";
import { WsAuthGuard } from "src/core/jwt-auth-guard/ws-auth.guard";
import { CheckUserService } from "src/api-services/check-user/check-user.service";
import Redis from "ioredis";
import { createAdapter } from "@socket.io/redis-adapter";
import { io, Socket as ClientSocket } from 'socket.io-client';

@WebSocketGateway({
    cors: {
      origin: '*', 
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
    },
  })
export class GateWaySocket implements OnModuleInit, OnGatewayDisconnect {
    private clientToServer2: ClientSocket;
    private clientToServer3: ClientSocket;
    constructor(
        private readonly checkUserService:CheckUserService
    ){}
    @WebSocketServer()
    server: Server;

    async onModuleInit() {
        this.clientToServer2 = io('http://localhost:5512', {
            auth: { token: process.env.GATEWAY_SECRET } 
        });

        this.clientToServer3 = io('http://localhost:5511', {
            auth: { token: process.env.GATEWAY_SECRET } 
        });
        this.clientToServer2.on('connect', () => {
            console.log('Gateway connected to Server 2');
        });
        this.clientToServer3.on('connect', () => {
            console.log('Gateway connected to Server 3');
        });
        
        this.clientToServer2.on('connect_error', (err) => {
            console.error('Error connecting to Server 2:', err);
        });
        this.clientToServer3.on('connect_error', (err) => {
            console.error('Error connecting to Server 3:', err);
        });
        this.setRemoteListeners()

        

    }
    setRemoteListeners(){
        this.clientToServer2.on('recieve-message', (data) => {
            console.log('Received "recieve-message" from Server 2:', data);
            this.server.to(data.sessionId).emit('recieve-messages', {data: data.body});
        });
        this.clientToServer2.on('chat-message-created', (data) => {
            // console.log('Received "recieve-message" from Server 2:', {data: data.body});
            this.server.to(data.sessionId).emit('chat-message-created', {data: data.body});
        });
        this.clientToServer2.on('user-message-created', (data) => {
            // console.log('Received "recieve-message" from Server 2:', {data: data.body});
            this.server.to(data.sessionId).emit('user-message-created', {data: data.body});
        });
        this.clientToServer2.on('recommended-session-title', (data) => {
            // console.log('Received "recieve-message" from Server 2:', {data: data.body});
            this.server.to(data.sessionId).emit('recommended-session-title', {data: data.body});
        });
        this.clientToServer2.on('message-updated', (data) => {
            // console.log('Received "recieve-message" from Server 2:', {data: data.body});
            this.server.to(data.sessionId).emit('message-updated', {data: data.body});
        });
        this.clientToServer2.on('message-deleted', (data) => {
            // console.log('Received "recieve-message" from Server 2:', {data: data.body});
            this.server.to(data.sessionId).emit('message-deleted', {data: data.body});
        });
        this.clientToServer2.on('participant-added', (data) => {
            // console.log('Received "recieve-message" from Server 2:', {data: data.body});
            console.log('participant added')
            this.server.to(data.sessionId).emit('participant-added', {data: data.body});
        });
        this.clientToServer2.on('participant-removed', (data) => {
            // console.log('Received "recieve-message" from Server 2:', {data: data.body});
            console.log('participant removed')
            this.server.to(data.sessionId).emit('participant-removed', {data: data.body});
        });
        this.clientToServer2.on('session-renamed', (data) => {
            // console.log('Received "recieve-message" from Server 2:', {data: data.body});
            this.server.to(data.sessionId).emit('session-renamed', {data: data.body});
        });
        this.clientToServer2.on('llm-enabled', (data) => {
            console.log('enabled llm nowwwwwww', {data: data.body});
            console.log('helloooooooooooooo')
            this.server.to(data.sessionId).emit('llm-enabled', {data: data.body});
        });
        this.clientToServer2.on('llm-disabled', (data) => {
            // console.log('Received "recieve-message" from Server 2:', {data: data.body});
            this.server.to(data.sessionId).emit('llm-disabled', {data: data.body});
        });
        this.clientToServer2.on('session-deleted', (data) => {
            // console.log('Received "recieve-message" from Server 2:', {data: data.body});
            this.server.to(data.sessionId).emit('session-deleted', {data: data.body});
        });
        this.clientToServer3.on('stream-data', (data) => {
            console.log('Received "recieve-message" from Server 3:', data);
            this.server.to(data.sessionId).emit('stream-data', {data: data.body});
        });
        this.clientToServer3.on('stream-end', (data) => {
            // console.log('Received "recieve-message" from Server 2:', {data: data.body});
            this.server.to(data.sessionId).emit('stream-end', {data: data.body});
        });
        this.clientToServer3.on('stream-error', (data) => {
            // console.log('Received "recieve-message" from Server 2:', {data: data.body});
            this.server.to(data.sessionId).emit('stream-end', {data: data.body});
        });

    }
    
    handleConnection(client: Socket) {
        console.log(`Client connected with id: ${client.id}`)
        client.on('error', (error:Error)=>{
            console.log(`Error: ${error.message}`)
        })
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected with id: ${client.id}`)
        
    }

    @UseGuards(WsAuthGuard)
    @SubscribeMessage('join-session')
    handleJoinSession(socket: Socket, data: { sessionId: string }) {
    socket.join(data.sessionId);
    console.log(`Client ${socket.id} joined session ${data.sessionId}`);
    
        // Emit ONLY to the joined room
        this.server.to(data.sessionId).emit('joined-session', {
            sessionId: data.sessionId,
        });
    }
    
    @UseGuards(WsAuthGuard)
    @SubscribeMessage('leave-session')
    handleLeaveSession(socket:Socket, data:{sessionId: string}){
        socket.leave(data.sessionId)
        console.log(`Client with id ${socket.id} leaved session ${data.sessionId}`)
        socket.emit('leaved-session', {sessionId: data.sessionId})
    }

    @UseGuards(WsAuthGuard)
    @SubscribeMessage('typing')
    async isTyping(socket:Socket, data:{sessionId: string, userId: string}){
        const user = await this.checkUserService.checkUser(data.userId);
        if (user.success) {
            console.log(`user ${user} is typing`);
            socket.to(data.sessionId).emit('is-typing', {data: user.user})
        } else {
            socket.to(data.sessionId).emit('is-typing-error', {data: 'user not found'})
        }
    }

}
