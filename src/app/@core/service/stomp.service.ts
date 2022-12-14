import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';
import * as Stomp from 'stompjs';
import { LocalStorageService } from './local-storage.service';
@Injectable({
	providedIn: 'root',
})
export class StompService {
	public connecting: boolean = false;
	private topicQueue: any[] = [];
	private SOCKET_ENDPOINT = environment.SOCKET_END_POINT;
	socket = new SockJS(this.SOCKET_ENDPOINT);
	stompClient = Stomp.over(this.socket);

	constructor(private localStorageService: LocalStorageService) {}
	subscribe(topic: string, callback: any): void {
		// If stomp client is currently connecting add the topic to the queue
		if (this.connecting) {
			this.topicQueue.push({
				topic,
				callback,
			});
			return;
		}

		const connected: boolean = this.stompClient.connected;
		if (connected) {
			// Once we are connected set connecting flag to false
			this.connecting = false;
			this.subscribeToTopic(topic, callback);
			return;
		}

		// If stomp client is not connected connect and subscribe to topic
		this.connecting = true;
		this.stompClient.connect(
			{ Authorization: 'Bearer ' + this.localStorageService.getToken() },
			(): any => {
				this.subscribeToTopic(topic, callback);

				// Once we are connected loop the queue and subscribe to remaining topics from it
				this.topicQueue.forEach((item: any) => {
					this.subscribeToTopic(item.topic, item.callback);
				});

				// Once done empty the queue
				this.topicQueue = [];
			}
		);
	}

	private subscribeToTopic(topic: string, callback: any): void {
		this.stompClient.subscribe(topic, (message?: Stomp.Message): any => {
			callback(message);
		});
	}
	disconnect() {
		if (this.stompClient != null) {
			this.socket.close();
		}
	}
}
